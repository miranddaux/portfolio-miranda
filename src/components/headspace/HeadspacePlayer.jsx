import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BANDAS, ROTULO_BANDAS, criarFaixaDemo, criarMotor, formatarTempo } from "../../lib/headspaceAudio.js";
import { MODOS, criarVisualizador } from "../../lib/headspaceViz.js";
import "../../styles/headspace.css";

// Headspace (skin do Windows Media Player 7). Imagens reconstruídas a partir de capturas de tela (não são os arquivos originais da Microsoft).
// Camadas: painéis laterais (atrás) -> visualizador em canvas -> moldura PNG -> botões HTML (acessíveis) por cima.
// Coordenadas em unidades de 1254 px (tamanho da referência); o CSS converte tudo para a largura real.
const A = "/assets/headspace";
const REF = 1254;
const area = (cx, cy, w, h = w) => ({ left: `${((cx - w / 2) / REF) * 100}%`, top: `${((cy - h / 2) / REF) * 100}%`, width: `${(w / REF) * 100}%`, height: `${(h / REF) * 100}%` });

const CATALOGO = [
  ["ABC", "The Jackson 5"],
  ["Billie Jean", "Michael Jackson"],
  ["Thriller", "Michael Jackson"],
  ["I Want You Back", "The Jackson 5"],
  ["I'll Be There", "The Jackson 5"],
  ["Beat It", "Michael Jackson"],
  ["Smooth Criminal", "Michael Jackson"],
  ["Poker Face", "Lady Gaga"],
  ["Bad Romance", "Lady Gaga"],
  ["Umbrella", "Rihanna"],
  ["Only Girl (In the World)", "Rihanna"],
  ["In the End", "Linkin Park"],
  ["Sk8er Boi", "Avril Lavigne"],
  ["Bring Me to Life", "Evanescence"],
  ["Feel Good Inc.", "Gorillaz"],
  ["Mr. Brightside", "The Killers"],
  ["Everytime We Touch", "Cascada"],
].map(([titulo, artista]) => ({ id: `cat-${artista}-${titulo}`, titulo, artista, url: "", duracao: 30, origem: "catalogo" }));

// Prévias oficiais de 30 s pela API pública de busca do iTunes (Apple). Nada é hospedado no site.
const normaliza = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
async function buscarPrevia(f) {
  const r = await fetch(`https://itunes.apple.com/search?${new URLSearchParams({ term: `${f.artista} ${f.titulo}`, media: "music", entity: "song", limit: "10" })}`);
  if (!r.ok) throw new Error("busca");
  const { results = [] } = await r.json();
  const t = normaliza(f.titulo), a = normaliza(f.artista).replace(/^the /, "");
  const ok = results.filter((x) => x.previewUrl);
  const achou = ok.find((x) => normaliza(x.trackName).startsWith(t.split(" ")[0]) && normaliza(x.artistName).includes(a)) || ok.find((x) => normaliza(x.artistName).includes(a));
  if (!achou) throw new Error("sem previa");
  return achou.previewUrl;
}

const PlayVidro = () => (
  <svg className="hs-play-glifo" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <defs><radialGradient id="hs-roxo" cx="40%" cy="30%" r="75%"><stop offset="0" stopColor="#e58bff" /><stop offset="0.55" stopColor="#b02be0" /><stop offset="1" stopColor="#74109e" /></radialGradient></defs>
    <circle cx="50" cy="50" r="48" fill="url(#hs-roxo)" />
    <path d="M38 27v46l38-23z" fill="#150818" />
  </svg>
);

export default function HeadspacePlayer({ onClose, onMinimize, onDragStart }) {
  const audio = useRef(null);
  const motor = useRef(null);
  const canvas = useRef(null);
  const visor = useRef(null);
  const modoRef = useRef(0);
  const tocandoRef = useRef(false);
  const arrastando = useRef(false);
  const idDemo = useRef(0);
  const [faixas, setFaixas] = useState([]);
  const [atual, setAtual] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [tempo, setTempo] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [mudo, setMudo] = useState(false);
  const [balance, setBalance] = useState(0);
  const [bandas, setBandas] = useState(() => BANDAS.map(() => 0));
  const [modo, setModo] = useState(0);
  const [rotuloModo, setRotuloModo] = useState("");
  const [eqAberto, setEqAberto] = useState(false);
  const [listaAberta, setListaAberta] = useState(false);
  const [repetir, setRepetir] = useState(true);
  const [aleatorio, setAleatorio] = useState(false);
  const [aviso, setAviso] = useState("");
  const [buscando, setBuscando] = useState(false);
  const cacheUrl = useRef({});

  const faixa = faixas[atual];
  tocandoRef.current = tocando;
  modoRef.current = modo;

  // Faixas iniciais: a demonstração gerada no navegador. As demais vêm da importação de arquivos do visitante.
  useEffect(() => {
    const url = criarFaixaDemo();
    setFaixas([{ id: "demo", titulo: "Demonstração Headspace", artista: "Gerada no navegador", url, duracao: 32, origem: "demo" }, ...CATALOGO]);
    return () => URL.revokeObjectURL(url);
  }, []);

  const garantirMotor = useCallback(() => {
    if (!motor.current && audio.current) {
      try { motor.current = criarMotor(audio.current); } catch { motor.current = null; }
      if (motor.current) {
        motor.current.volume(mudo ? 0 : volume);
        motor.current.balance(balance);
        bandas.forEach((db, i) => motor.current.banda(i, db));
      }
    }
    return motor.current;
  }, [mudo, volume, balance, bandas]);

  const tocar = useCallback(async () => {
    const el = audio.current;
    if (!el || !el.src) return;
    garantirMotor();
    try {
      await motor.current?.retomar();
      await el.play();
      setAviso("");
    } catch {
      setTocando(false);
      setAviso("Não foi possível reproduzir. Clique em play de novo.");
    }
  }, [garantirMotor]);

  const pedido = useRef(0);
  const carregar = useCallback(async (i, tocarLogo = true) => {
    const f = faixas[i];
    const el = audio.current;
    if (!f || !el) return;
    const meu = ++pedido.current;
    setAtual(i); setTempo(0); setDuracao(f.duracao || 0); setAviso("");
    let url = f.url;
    if (f.origem === "catalogo") {
      el.pause(); setBuscando(true);
      try {
        url = cacheUrl.current[f.id] || (cacheUrl.current[f.id] = await buscarPrevia(f));
      } catch {
        if (meu === pedido.current) { setBuscando(false); setAviso("Não encontrei a prévia desta música agora. Tente outra."); }
        return;
      }
      if (meu !== pedido.current) return;
      setBuscando(false);
    }
    el.src = url;
    el.load();
    if (tocarLogo) tocar();
  }, [faixas, tocar]);

  const proxima = useCallback((auto = false) => {
    if (!faixas.length) return;
    let i;
    if (aleatorio && faixas.length > 1) { do { i = Math.floor(Math.random() * faixas.length); } while (i === atual); }
    else i = atual + 1;
    if (i >= faixas.length) {
      if (!repetir && auto) { audio.current.pause(); audio.current.currentTime = 0; setTempo(0); return; }
      i = 0;
    }
    carregar(i, true);
  }, [faixas, atual, aleatorio, repetir, carregar]);

  const anterior = () => {
    if (audio.current && audio.current.currentTime > 3) { audio.current.currentTime = 0; return; }
    if (faixas.length) carregar((atual - 1 + faixas.length) % faixas.length, true);
  };
  const alternarTocar = () => {
    const el = audio.current;
    if (!el) return;
    if (!el.src || buscando) { carregar(atual, true); return; }
    if (el.paused) tocar(); else el.pause();
  };
  const parar = () => { const el = audio.current; if (!el) return; el.pause(); el.currentTime = 0; setTempo(0); };

  // Elemento de áudio e eventos
  useEffect(() => {
    const el = new Audio();
    el.crossOrigin = "anonymous"; // necessário para o analisador ler o áudio das prévias
    el.preload = "metadata";
    audio.current = el;
    const aoTempo = () => { if (!arrastando.current) setTempo(el.currentTime); };
    const aoMeta = () => setDuracao(Number.isFinite(el.duration) ? el.duration : 0);
    const aoPlay = () => setTocando(true);
    const aoPausa = () => setTocando(false);
    const aoErro = () => { setTocando(false); setAviso("Não foi possível carregar esta faixa."); };
    el.addEventListener("timeupdate", aoTempo);
    el.addEventListener("loadedmetadata", aoMeta);
    el.addEventListener("durationchange", aoMeta);
    el.addEventListener("play", aoPlay);
    el.addEventListener("pause", aoPausa);
    el.addEventListener("error", aoErro);
    return () => {
      el.pause(); el.removeAttribute("src"); el.load();
      el.removeEventListener("timeupdate", aoTempo); el.removeEventListener("loadedmetadata", aoMeta); el.removeEventListener("durationchange", aoMeta);
      el.removeEventListener("play", aoPlay); el.removeEventListener("pause", aoPausa); el.removeEventListener("error", aoErro);
      motor.current?.fechar(); motor.current = null;
    };
  }, []);

  // "ended" precisa da versão atual de proxima()
  useEffect(() => {
    const el = audio.current;
    const fim = () => proxima(true);
    el.addEventListener("ended", fim);
    return () => el.removeEventListener("ended", fim);
  }, [proxima]);

  // Volume, balance e equalizador agem de verdade no áudio
  useEffect(() => { motor.current?.volume(mudo ? 0 : volume); }, [volume, mudo]);
  useEffect(() => { motor.current?.balance(balance); }, [balance]);
  useEffect(() => { bandas.forEach((db, i) => motor.current?.banda(i, db)); }, [bandas]);

  // Visualizador: lê o analisador a cada quadro; só desenha com a janela visível
  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return undefined;
    const ctx = cv.getContext("2d");
    const desenhar = criarVisualizador();
    let freq = new Uint8Array(1024), onda = new Uint8Array(2048), raf = 0, modoAnterior = -1;
    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), r = cv.getBoundingClientRect();
      if (r.width > 0) { cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, r.width, r.height); }
    };
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(cv);
    const quadro = () => {
      raf = requestAnimationFrame(quadro);
      const r = cv.getBoundingClientRect();
      if (r.width === 0) return;
      const an = motor.current?.analisador;
      if (an && tocandoRef.current) { an.getByteFrequencyData(freq); an.getByteTimeDomainData(onda); }
      else { freq.fill(0); onda.fill(128); }
      if (modoAnterior !== modoRef.current) { ctx.fillStyle = "#000"; ctx.fillRect(0, 0, r.width, r.height); modoAnterior = modoRef.current; }
      desenhar(modoRef.current, ctx, r.width, r.height, freq, onda);
    };
    raf = requestAnimationFrame(quadro);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const alternarVisual = () => {
    const n = (modo + 1) % MODOS.length;
    setModo(n); setRotuloModo(MODOS[n]);
  };
  useEffect(() => {
    if (!rotuloModo) return undefined;
    const t = setTimeout(() => setRotuloModo(""), 1600);
    return () => clearTimeout(t);
  }, [rotuloModo]);

  const importar = (ev) => {
    const arquivos = [...(ev.target.files || [])].filter((f) => f.type.startsWith("audio/") || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(f.name));
    if (!arquivos.length) { setAviso("Escolha arquivos de áudio (MP3, WAV, OGG...)."); return; }
    const novas = arquivos.map((f) => ({
      id: `arq-${Date.now()}-${idDemo.current++}`,
      titulo: f.name.replace(/\.[^.]+$/, ""),
      artista: "Meu computador",
      url: URL.createObjectURL(f),
      duracao: 0,
      origem: "arquivo",
    }));
    setFaixas((l) => [...l, ...novas]);
    novas.forEach((n) => {
      const t = new Audio(); t.preload = "metadata"; t.src = n.url;
      t.addEventListener("loadedmetadata", () => setFaixas((l) => l.map((x) => (x.id === n.id ? { ...x, duracao: t.duration } : x))));
    });
    ev.target.value = "";
  };
  useEffect(() => () => faixas.forEach((f) => f.origem === "arquivo" && URL.revokeObjectURL(f.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const arrastarJanela = (e) => {
    if (e.target.closest("button, input, a, label, .hs-gaveta")) return;
    onDragStart?.(e);
  };
  const buscar = (e) => {
    const t = Number(e.target.value);
    setTempo(t);
    if (audio.current) audio.current.currentTime = t;
  };
  const setBanda = (i, db) => setBandas((b) => b.map((x, k) => (k === i ? db : x)));
  const resetar = () => { setBandas(BANDAS.map(() => 0)); setBalance(0); };
  const vol = Math.round((mudo ? 0 : volume) * 100);
  const lista = useMemo(() => faixas, [faixas]);

  return (
    <div className="hs" onPointerDown={arrastarJanela}>
      <div className="hs-quadro">
        {/* Painel esquerdo: equalizador */}
        <section className={`hs-gaveta hs-gaveta-esq ${eqAberto ? "is-aberta" : ""}`} aria-label="Equalizador" aria-hidden={!eqAberto} inert={!eqAberto ? "" : undefined}>
          <div className="hs-poco">
            <div className="hs-linha-ctrl">
              <label>Balance<input type="range" min="-1" max="1" step="0.05" value={balance} onChange={(e) => setBalance(Number(e.target.value))} aria-label="Balance" /></label>
              <label>Volume<input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { setVolume(Number(e.target.value)); setMudo(false); }} aria-label="Volume" /></label>
            </div>
            <div className="hs-eq" role="group" aria-label="Equalizador de 10 bandas">
              {BANDAS.map((f, i) => (
                <div className="hs-fader" key={f}>
                  <input type="range" min="-12" max="12" step="1" value={bandas[i]} onChange={(e) => setBanda(i, Number(e.target.value))} aria-label={`Banda ${ROTULO_BANDAS[i]} Hz, ganho em decibéis`} aria-orientation="vertical" />
                  <span>{ROTULO_BANDAS[i]}</span>
                </div>
              ))}
            </div>
            <div className="hs-linha-botoes">
              <span className="hs-leitura">Vol {vol}%</span>
              <button type="button" className="hs-mini" aria-pressed={mudo} onClick={() => setMudo((m) => !m)}>Mudo</button>
              <button type="button" className="hs-mini" onClick={resetar}>Resetar</button>
            </div>
          </div>
        </section>

        {/* Painel direito: playlist */}
        <section className={`hs-gaveta hs-gaveta-dir ${listaAberta ? "is-aberta" : ""}`} aria-label="Playlist" aria-hidden={!listaAberta} inert={!listaAberta ? "" : undefined}>
          <div className="hs-poco">
            <div className="hs-linha-botoes hs-topo-lista">
              <span className="hs-leitura">Playlist</span>
              <button type="button" className="hs-mini" aria-pressed={repetir} onClick={() => setRepetir((r) => !r)}>Repetir</button>
              <button type="button" className="hs-mini" aria-pressed={aleatorio} onClick={() => setAleatorio((a) => !a)}>Aleatório</button>
            </div>
            <ul className="hs-lista" aria-label="Faixas">
              {lista.map((f, i) => (
                <li key={f.id}>
                  <button type="button" className={`hs-faixa ${i === atual ? "is-atual" : ""}`} aria-current={i === atual ? "true" : undefined} onClick={() => carregar(i, true)}>
                    <span className="hs-faixa-nome">{i === atual && (tocando || buscando) ? (buscando ? "… " : "▶ ") : ""}{f.titulo} - {f.artista}</span>
                    <span className="hs-faixa-dur">{f.origem === "catalogo" ? "prévia" : formatarTempo(f.duracao)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="hs-nota">Músicas do catálogo tocam a prévia oficial de 30 s (iTunes). Importe seus arquivos para ouvir inteiras.</p>
            <label className="hs-mini hs-importar">
              Importar arquivos…
              <input type="file" accept="audio/*" multiple onChange={importar} />
            </label>
          </div>
        </section>

        {/* Visualizador (atrás da moldura) */}
        <div className="hs-visor" ref={visor} style={area(622, 455.500, 652, 443)}>
          <canvas ref={canvas} aria-label={`Visualização: ${MODOS[modo]}`} role="img" />
          {rotuloModo && <div className="hs-info" aria-hidden="true"><span>{rotuloModo}</span></div>}
        </div>

        <img className="hs-moldura" src={`${A}/frame.webp`} alt="" width="1254" height="1254" draggable="false" />

        {!tocando && <div className="hs-play-sobre" style={area(531, 165, 76)} aria-hidden="true"><PlayVidro /></div>}

        <button type="button" className="hs-bt" style={area(441, 164, 90)} onClick={anterior} aria-label="Faixa anterior" />
        <button type="button" className="hs-bt" style={area(531, 165, 88)} onClick={alternarTocar} aria-label={tocando ? "Pausar" : "Tocar"} />
        <button type="button" className="hs-bt" style={area(621, 165, 88)} onClick={parar} aria-label="Parar" />
        <button type="button" className="hs-bt" style={area(711, 165, 88)} onClick={() => proxima(false)} aria-label="Próxima faixa" />
        <button type="button" className="hs-bt" style={area(819, 166, 94)} onClick={alternarVisual} aria-label={`Trocar visualização. Atual: ${MODOS[modo]}`} />
        <button type="button" className="hs-bt hs-bt-q" style={area(589, 65, 55, 59)} onClick={onMinimize} aria-label="Minimizar" />
        <button type="button" className="hs-bt hs-bt-q" style={area(658, 65, 56, 59)} onClick={onClose} aria-label="Fechar" />
        <button type="button" className="hs-bt hs-bt-q" style={area(124, 565, 65, 111)} onClick={() => setEqAberto((a) => !a)} aria-expanded={eqAberto} aria-label="Equalizador" />
        <button type="button" className="hs-bt hs-bt-q" style={area(1125, 565, 65, 111)} onClick={() => setListaAberta((a) => !a)} aria-expanded={listaAberta} aria-label="Playlist" />

        <div className="hs-seek" style={area(630.500, 720.500, 505, 46)}>
          <input type="range" min="0" max={duracao || 1} step="0.1" value={Math.min(tempo, duracao || 1)} onChange={buscar} onPointerDown={() => { arrastando.current = true; }} onPointerUp={() => { arrastando.current = false; }} onBlur={() => { arrastando.current = false; }} aria-label="Posição da faixa" disabled={!duracao} />
        </div>
        {aviso && <p className="hs-aviso" role="status">{aviso}</p>}
      </div>
    </div>
  );
}
