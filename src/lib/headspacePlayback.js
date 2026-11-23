// Uma única fila de reprodução: só o pedido mais recente pode alterar o player.
const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
export function selecionarPrevia(faixa, results) {
  const titulo = normalizar(faixa.titulo), artista = normalizar(faixa.artista).replace(/^the/, '');
  return results.find(x => x.previewUrl && normalizar(x.trackName).startsWith(titulo) && normalizar(x.artistName).replace(/^the/, '') === artista)?.previewUrl;
}
export async function buscarPrevia(faixa, signal) {
  const params = new URLSearchParams({ term: `${faixa.artista} ${faixa.titulo}`, media: 'music', entity: 'song', limit: '25' });
  const res = await fetch(`https://itunes.apple.com/search?${params}`, { signal });
  if (!res.ok) throw Object.assign(new Error('A busca de prévias está indisponível.'), { transitorio: res.status === 429 || res.status >= 500 });
  const url = selecionarPrevia(faixa, (await res.json()).results || []);
  if (!url) throw new Error('Esta música está sem prévia disponível.');
  return url;
}

// Retentativas limitadas da mesma faixa. Trocar, pausar ou fechar invalida a recuperação.
export function criarReproducao({ audio, preparar = () => {}, resolver = buscarPrevia, estado, atrasos = [400, 1200] }) {
  let pedido = 0, pendente = false, carregada = null, selecionada = null, busca, timer, timerTocar, retentativa, encerrado = false;
  let repeticoes = 0, recuperando = false;
  const cache = new Map();
  const avisar = (aviso = '', buscando = false) => { if (!encerrado) estado({ aviso, buscando }); };
  const cancelar = () => {
    ++pedido; busca?.abort(); clearTimeout(timer); clearTimeout(timerTocar); clearTimeout(retentativa);
    pendente = false; recuperando = false;
  };
  function falha(id, transitorio, mensagem = 'A prévia está indisponível no momento.') {
    if (id !== pedido || encerrado || recuperando) return;
    clearTimeout(timerTocar);
    cache.delete(selecionada?.id); carregada = null;
    if (transitorio && repeticoes < atrasos.length && selecionada) {
      recuperando = true; pendente = true;
      const faixa = selecionada, tentativa = repeticoes + 1;
      audio.pause(); audio.removeAttribute('src'); audio.load();
      avisar('Reconectando a prévia…', true);
      retentativa = setTimeout(() => {
        if (id === pedido && !encerrado) carregar(faixa, tentativa);
      }, atrasos[repeticoes]);
    } else {
      pendente = false;
      avisar(`${mensagem} Clique em Tocar para tentar novamente ou importe uma música.`);
    }
  }
  async function tocar(id = pedido) {
    if (!audio.src || id !== pedido || encerrado) return;
    clearTimeout(timerTocar);
    // Também recupera uma conexão que nunca chega a resolver o play().
    timerTocar = setTimeout(() => falha(id, true), 15000);
    try {
      const pronto = preparar();
      await Promise.all([pronto, audio.play()]);
      if (id === pedido && !recuperando) { clearTimeout(timerTocar); avisar(); }
    } catch (erro) {
      if (id !== pedido || encerrado || recuperando) return;
      clearTimeout(timerTocar);
      // Troca/pausa já invalida o pedido acima. Um abort da seleção atual pode ser recuperado.
      if (erro.name === 'NotAllowedError') avisar('Clique em Tocar para permitir o áudio.');
      else falha(id, true);
    }
  }
  async function carregar(faixa, tentativa = 0) {
    cancelar();
    const id = pedido;
    repeticoes = tentativa;
    selecionada = faixa; carregada = null; audio.pause();
    // Nunca deixar a faixa anterior tocar com o nome da nova seleção.
    audio.removeAttribute('src'); audio.load();
    try { Promise.resolve(preparar()).catch(() => {}); } catch { /* tocar() informa a falha persistente. */ }
    avisar(tentativa ? 'Reconectando a prévia…' : '', faixa.origem === 'catalogo');
    pendente = true;
    let url = faixa.url;
    if (faixa.origem === 'catalogo') {
      busca = new AbortController();
      const controller = busca;
      timer = setTimeout(() => controller.abort(), 12000);
      try {
        const item = cache.get(faixa.id);
        url = item && Date.now() - item.data < 15 * 60 * 1000 ? item.url : await resolver(faixa, controller.signal);
        if (id !== pedido || encerrado) return;
        cache.set(faixa.id, { url, data: Date.now() });
      } catch (erro) {
        falha(id, erro.transitorio || erro.name === 'TypeError' || erro.name === 'AbortError', erro.name === 'AbortError' ? 'A busca demorou.' : erro.message);
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
    carregar: faixa => carregar(faixa),
    alternar(faixa) {
      if (pendente) { cancelar(); audio.pause(); avisar(); return; }
      if (carregada !== faixa.id || audio.error || !audio.src) return carregar(faixa);
      if (audio.paused) { repeticoes = 0; return tocar(); }
      cancelar(); audio.pause();
    },
    parar() { cancelar(); audio.pause(); if (audio.src) audio.currentTime = 0; avisar(); },
    erro() {
      if (!audio.src || !audio.error || encerrado) return;
      falha(pedido, true);
    },
    fechar() { encerrado = true; cancelar(); audio.pause(); },
  };
}
