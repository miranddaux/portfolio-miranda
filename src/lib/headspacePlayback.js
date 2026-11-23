// Uma única fila de reprodução: só o pedido mais recente pode alterar o player.
const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
export function selecionarPrevia(faixa, results) {
  const titulo = normalizar(faixa.titulo), artista = normalizar(faixa.artista).replace(/^the/, '');
  return results.find(x => x.previewUrl && normalizar(x.trackName).startsWith(titulo) && normalizar(x.artistName).replace(/^the/, '') === artista)?.previewUrl;
}
export async function buscarPrevia(faixa, signal) {
  const params = new URLSearchParams({ term: `${faixa.artista} ${faixa.titulo}`, media: 'music', entity: 'song', limit: '25' });
  const res = await fetch(`https://itunes.apple.com/search?${params}`, { signal });
  if (!res.ok) throw new Error('A busca de prévias está indisponível.');
  const url = selecionarPrevia(faixa, (await res.json()).results || []);
  if (!url) throw new Error('Esta música está sem prévia disponível.');
  return url;
}

export function criarReproducao({ audio, preparar = () => {}, resolver = buscarPrevia, estado }) {
  let pedido = 0, pendente = false, carregada = null, selecionada = null, busca, timer, encerrado = false;
  const cache = new Map();
  const avisar = (aviso = '', buscando = false) => { if (!encerrado) estado({ aviso, buscando }); };
  const cancelar = () => { ++pedido; busca?.abort(); clearTimeout(timer); pendente = false; };
  async function tocar(id = pedido) {
    if (!audio.src || id !== pedido || encerrado) return;
    try {
      // play e resume partem juntos, sem esperar o AudioContext antes do gesto de play.
      const pronto = preparar();
      await Promise.all([pronto, audio.play()]);
      if (id === pedido) avisar();
    } catch (erro) {
      if (id !== pedido || encerrado || erro.name === 'AbortError') return;
      if (erro.name === 'NotAllowedError') avisar('Clique em Tocar para permitir o áudio.');
      else {
        if (selecionada) cache.delete(selecionada.id);
        carregada = null;
        avisar('A prévia não carregou. Clique em Tocar para tentar novamente ou importe uma música.');
      }
    }
  }
  async function carregar(faixa) {
    cancelar();
    const id = pedido;
    selecionada = faixa; carregada = null; audio.pause();
    // Nunca deixar a faixa anterior tocar com o nome da nova seleção.
    audio.removeAttribute('src'); audio.load();
    // Desbloqueia o AudioContext ainda no clique, antes de aguardar a busca remota.
    try { Promise.resolve(preparar()).catch(() => {}); } catch { /* tocar() informa a falha se persistir. */ }
    avisar('', faixa.origem === 'catalogo');
    pendente = true;
    let url = faixa.url;
    if (faixa.origem === 'catalogo') {
      busca = new AbortController();
      timer = setTimeout(() => busca?.abort(), 12000);
      try {
        const item = cache.get(faixa.id);
        url = item && Date.now() - item.data < 15 * 60 * 1000 ? item.url : await resolver(faixa, busca.signal);
        if (id !== pedido || encerrado) return;
        cache.set(faixa.id, { url, data: Date.now() });
      } catch (erro) {
        if (id === pedido && !encerrado) {
          pendente = false;
          avisar(erro.name === 'AbortError' ? 'A busca demorou. Clique em Tocar para tentar novamente.' : `${erro.message} Clique em Tocar para tentar novamente ou importe uma música.`);
        }
        return;
      } finally { if (id === pedido) clearTimeout(timer); }
    }
    if (id !== pedido || encerrado) return;
    pendente = false;
    carregada = faixa.id;
    audio.src = url; audio.load();
    avisar();
    await tocar(id);
  }
  return {
    carregar,
    alternar(faixa) {
      if (pendente) { cancelar(); audio.pause(); avisar(); return; }
      if (carregada !== faixa.id || audio.error || !audio.src) return carregar(faixa);
      if (audio.paused) return tocar();
      audio.pause();
    },
    parar() { cancelar(); audio.pause(); if (audio.src) audio.currentTime = 0; avisar(); },
    erro() {
      if (!audio.src || !audio.error || encerrado) return;
      cache.delete(selecionada?.id); carregada = null;
      avisar('A prévia não carregou. Clique em Tocar para tentar novamente ou importe uma música.');
    },
    fechar() { encerrado = true; cancelar(); audio.pause(); },
  };
}
