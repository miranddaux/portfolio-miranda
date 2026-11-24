import { useEffect, useRef, useState } from "react";
import { formatarTempo, useMediaPlayer } from "../hooks/useMediaPlayer";
import { idDoYouTube, useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { GlifoAnterior, GlifoPause, GlifoPlay, GlifoProximo, GlifoStop, GlifoVolume } from "./GlifosWMP";
import "../styles/windows-media-player.css";

// Reprodutor no estilo do Windows Media Player do XP.
// Camadas: 1) moldura (WebP transparente, só o que é estático)  2) <video> real no retângulo preto
// 3) controles HTML reais por cima. Tudo é posicionado em "unidades de projeto" (a moldura mede 1448 × 1033)
// e escala por porcentagem, então nada deforma quando a largura muda.
const W = 1448;
const H = 1033;
const A = "/assets/xp/wmp";
const R = (x, y, w, h) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, width: `${(w / W) * 100}%`, height: `${(h / H) * 100}%` });
const PASSO_TEMPO = 10;

// Slider horizontal reutilizável: arrasto por ponteiro + teclado (role="slider").
function Slider({ area, de, ate, valor, aoMudar, rotulo, texto, passo, children, className, disabled = false }) {
  // area = [x, y, w, h] em unidades de projeto; "de/ate" = faixa em x onde o centro do marcador se move.
  const ref = useRef(null);
  const arrastando = useRef(false);
  const calc = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = area[0] + ((e.clientX - r.left) / r.width) * area[2];
    return Math.min(1, Math.max(0, (x - de) / (ate - de)));
  };
  return (
    <div
      ref={ref}
      className={`wmp-slider ${className || ""}`}
      style={R(...area)}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(valor * 100)}
      aria-valuetext={texto}
      onPointerDown={(e) => { if (disabled) return; arrastando.current = true; e.currentTarget.setPointerCapture(e.pointerId); aoMudar(calc(e), "ponteiro"); }}
      onPointerMove={(e) => { if (arrastando.current) aoMudar(calc(e), "ponteiro"); }}
      onPointerUp={(e) => { arrastando.current = false; e.currentTarget.releasePointerCapture?.(e.pointerId); }}
      onPointerCancel={() => { arrastando.current = false; }}
      onKeyDown={(e) => {
        if (disabled) return;
        const mapa = { ArrowRight: passo, ArrowUp: passo, ArrowLeft: -passo, ArrowDown: -passo, PageUp: passo * 4, PageDown: -passo * 4 };
        if (e.key === "Home") { e.preventDefault(); aoMudar(0, "teclado"); }
        else if (e.key === "End") { e.preventDefault(); aoMudar(1, "teclado"); }
        else if (mapa[e.key]) { e.preventDefault(); aoMudar(Math.min(1, Math.max(0, valor + mapa[e.key])), "teclado"); }
      }}
    >
      {children({ x: (((de + valor * (ate - de)) - area[0]) / area[2]) * 100 })}
    </div>
  );
}

export default function WindowsMediaPlayer({ src, playlist, poster, title, autoPlay = false, loop = false, onClose, onMinimize, onDragStart, className = "", style }) {
  // Fonte: um `src` (MP4/WebM local ou link do YouTube) ou uma `playlist` [{ src, title }].
  const lista = playlist?.length ? playlist : src ? [{ src, title }] : [];
  const raiz = useRef(null);
  const [listaAberta, setListaAberta] = useState(false);
  const [telaCheiaIndisponivel, setTelaCheiaIndisponivel] = useState(false);
  const [indice, setIndice] = useState(0);
  const [iniciar, setIniciar] = useState(autoPlay);
  const atual = lista[indice] || {};
  const idYT = idDoYouTube(atual.src);
  const arquivo = idYT ? undefined : atual.src;
  const mp = useMediaPlayer({ src: arquivo, autoPlay: iniciar, loop: loop && lista.length <= 1 });
  const yt = useYouTubePlayer({ videoId: idYT, autoPlay: iniciar });
  const p = idYT ? yt : mp;
  const { acoes } = p;
  const temVideo = Boolean(atual.src);
  const varios = lista.length > 1;

  // Fim do vídeo: segue para o próximo da lista (e volta ao primeiro se `loop`).
  useEffect(() => {
    if (!p.terminou || !varios) return;
    if (indice < lista.length - 1) { setIniciar(true); setIndice(indice + 1); }
    else if (loop) { setIniciar(true); setIndice(0); }
  }, [p.terminou]); // eslint-disable-line react-hooks/exhaustive-deps
  const irParaFaixa = (i) => { setIniciar(true); setIndice((i + lista.length) % lista.length); };

  const frac = p.duracao > 0 ? Math.min(1, p.atual / p.duracao) : 0;
  const volumeEfetivo = p.mudo ? 0 : p.volume;
  const nome = atual.title || p.titulo || (temVideo && !idYT ? decodeURIComponent(atual.src.split("/").pop().split("?")[0]) : temVideo ? "YouTube" : "Nenhum arquivo");
  const volumeDoSistema = (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  const permiteTelaCheia = !telaCheiaIndisponivel && (document.fullscreenEnabled || (!idYT && Boolean(mp.videoRef.current?.webkitEnterFullscreen)));
  const telaCheia = () => {
    if (document.fullscreenEnabled && raiz.current?.requestFullscreen) raiz.current.requestFullscreen().catch(() => setTelaCheiaIndisponivel(true));
    else if (mp.videoRef.current?.webkitEnterFullscreen) {
      try { mp.videoRef.current.webkitEnterFullscreen(); } catch { setTelaCheiaIndisponivel(true); }
    }
  };
  const status = p.erro || (p.carregando && temVideo ? "Carregando…" : nome);

  return (
    <section
      ref={raiz}
      className={`wmp ${className}`}
      style={style}
      aria-label={`Windows Media Player: ${nome}`}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === " ") { e.preventDefault(); acoes.alternar(); }
      }}
    >
      <div className="wmp-escala" style={{ aspectRatio: `${W} / ${H}` }}>
        <div className="wmp-mobile-tools" role="toolbar" aria-label="Opções do vídeo">
          {temVideo && <a href={atual.src} target="_blank" rel="noopener noreferrer" className="wmp-tool" aria-label="Abrir vídeo na origem"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2" /></svg></a>}
          {varios && <button type="button" className="wmp-tool" onClick={() => setListaAberta(a=>!a)} aria-label="Lista de vídeos" aria-expanded={listaAberta}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1" /></svg></button>}
          {permiteTelaCheia && <button type="button" className="wmp-tool" onClick={telaCheia} disabled={!temVideo} aria-label="Tela cheia"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6" /></svg></button>}
        </div>
        {listaAberta && <ol className="wmp-mobile-list" aria-label="Lista de vídeos">{lista.map((v,i)=><li key={i}><button type="button" aria-current={i===indice?'true':undefined} onClick={()=>{irParaFaixa(i);setListaAberta(false);}}>{v.title || `Vídeo ${i+1}`}</button></li>)}</ol>}
        <img className="wmp-moldura" src={`${A}/moldura.webp`} alt="" width={W} height={H} draggable="false" />

        {/* Camada 2: vídeo real. Fica dentro do retângulo preto, sem tocar nas bordas. */}
        <div className="wmp-tela" style={R(48, 75, 1380, 732)}>
          {idYT ? <div ref={yt.caixa} className="wmp-yt" aria-hidden="true" /> :
          <video
            ref={mp.videoRef}
            key={arquivo || "vazio"}
            className="wmp-video"
            src={arquivo}
            poster={poster}
            autoPlay={iniciar}
            loop={loop && !varios}
            playsInline
            preload="metadata"
            controls={false}
            onClick={acoes.alternar}
            onDoubleClick={(e) => e.currentTarget.requestFullscreen?.()}
          />}
          {idYT && <button type="button" className="wmp-yt-clique" onClick={acoes.alternar} aria-label={p.tocando ? "Pausar" : "Reproduzir"} tabIndex={-1} />}
          {!temVideo && <p className="wmp-aviso">Nenhum vídeo selecionado</p>}
          {temVideo && p.carregando && !p.erro && <p className="wmp-aviso" role="status">Carregando…</p>}
          {p.erro && <p className="wmp-aviso is-erro" role="alert">{p.erro}</p>}
        </div>

        {/* Barra de informações */}
        <div className="wmp-info" style={R(48, 812, 1380, 40)}>
          <span className="wmp-info-glifo" aria-hidden="true">
            {p.tocando ? <svg viewBox="0 0 24 24"><rect x="3" y="2" width="7" height="20" /><rect x="14" y="2" width="7" height="20" /></svg> : <svg viewBox="0 0 24 24"><path d="M5 2 L21 12 L5 22 Z" /></svg>}
          </span>
          <span className="wmp-info-titulo" title={nome}>{status}</span>
          <span className="wmp-info-tempo" aria-live="off">{formatarTempo(p.atual)} / {formatarTempo(p.duracao)}</span>
        </div>

        {/* Linha do tempo */}
        <button type="button" className="wmp-pilula wmp-rewind" style={R(50, 870, 86, 32)} onClick={() => acoes.pular(-PASSO_TEMPO)} disabled={!temVideo} aria-label="Voltar 10 segundos" />
        <button type="button" className="wmp-pilula wmp-forward" style={R(1342, 870, 86, 32)} onClick={() => acoes.pular(PASSO_TEMPO)} disabled={!temVideo} aria-label="Avançar 10 segundos" />
        <Slider
          area={[136, 864, 1204, 42]} de={167} ate={1309} valor={frac} passo={PASSO_TEMPO / (p.duracao || 1)}
          rotulo="Posição do vídeo" texto={`${formatarTempo(p.atual)} de ${formatarTempo(p.duracao)}`}
          aoMudar={(v) => temVideo && p.duracao > 0 && acoes.irPara(v * p.duracao)}
          disabled={!temVideo || !p.duracao}
          className={`wmp-timeline ${temVideo && p.duracao ? "" : "is-desligado"}`}
        >
          {({ x }) => (
            <>
              <span className="wmp-preenchimento" style={{ width: `${x}%` }} />
              <img className="wmp-marcador" src={`${A}/thumb-progresso.png`} alt="" draggable="false" style={{ left: `${x}%`, width: `${(62 / 1204) * 100}%` }} />
            </>
          )}
        </Slider>

        {/* Botões redondos */}
        <button type="button" className="wmp-esfera is-grande wmp-play" style={R(52, 920, 82, 84)} onClick={acoes.alternar} disabled={!temVideo} aria-label={p.tocando ? "Pausar" : "Reproduzir"} aria-pressed={p.tocando}>
          {p.tocando ? <GlifoPause /> : <GlifoPlay />}
        </button>
        <button type="button" className="wmp-esfera wmp-stop" style={R(141, 933, 58, 58)} onClick={acoes.parar} disabled={!temVideo} aria-label="Parar"><GlifoStop /></button>
        <button type="button" className="wmp-esfera wmp-prev" style={R(209, 933, 58, 58)} onClick={() => (varios ? irParaFaixa(indice - 1) : acoes.pular(-PASSO_TEMPO))} disabled={!temVideo} aria-label={varios ? "Vídeo anterior" : "Anterior: voltar 10 segundos"}><GlifoAnterior /></button>
        <button type="button" className="wmp-esfera wmp-next" style={R(276, 933, 58, 58)} onClick={() => (varios ? irParaFaixa(indice + 1) : acoes.pular(PASSO_TEMPO))} disabled={!temVideo} aria-label={varios ? "Próximo vídeo" : "Próximo: avançar 10 segundos"}><GlifoProximo /></button>
        <button type="button" className="wmp-esfera wmp-mute" style={R(346, 933, 58, 58)} onClick={acoes.alternarMudo} disabled={!temVideo} aria-label={volumeEfetivo === 0 ? "Ativar som" : "Desativar som"} aria-pressed={volumeEfetivo === 0}><GlifoVolume mudo={volumeEfetivo === 0} /></button>

        {/* Volume: cunha desenhada em SVG + marcador do sprite */}
        <Slider
          area={[420, 936, 192, 52]} de={442} ate={592} valor={volumeEfetivo} passo={0.05}
          className={`wmp-volume ${volumeDoSistema ? "is-desligado" : ""}`} disabled={volumeDoSistema || !temVideo}
          rotulo="Volume" texto={`${Math.round(volumeEfetivo * 100)}%`}
          aoMudar={(v) => acoes.definirVolume(v)}

        >
          {({ x }) => (
            <>
              <svg className="wmp-cunha" viewBox="420 936 192 52" aria-hidden="true" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wmp-cunha-fundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#aebbd8" /><stop offset="0.6" stopColor="#e3e8f3" /><stop offset="1" stopColor="#ffffff" /></linearGradient>
                  <linearGradient id="wmp-cunha-verde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2c8a14" /><stop offset="1" stopColor="#6fd13a" /></linearGradient>
                  <clipPath id="wmp-cunha-corte"><rect x="420" y="936" width={Math.max(0, 442 + volumeEfetivo * 150 - 420)} height="52" /></clipPath>
                </defs>
                <path d="M428 964 L602 949 Q605 949 605 952 L604 955 L586 971 L430 970 Q427 969 428 964 Z" fill="url(#wmp-cunha-fundo)" stroke="#7d8db3" strokeWidth="0.8" />
                <path d="M428 964 L602 949 L604 955 L586 971 L430 970 Z" fill="url(#wmp-cunha-verde)" clipPath="url(#wmp-cunha-corte)" />
              </svg>
              <img className="wmp-marcador-vol" src={`${A}/thumb-volume.png`} alt="" draggable="false" style={{ left: `${x}%`, width: `${(28 / 192) * 100}%` }} />
            </>
          )}
        </Slider>

        {onDragStart && <div className="wmp-alca" style={R(0, 0, 1330, 70)} onPointerDown={onDragStart} aria-hidden="true" />}

        {/* Controles da janela da moldura (só quando a página que usa o player quiser ouvir) */}
        {onMinimize && <button type="button" className="wmp-janela wmp-minimize" style={R(1340, 18, 38, 38)} onClick={onMinimize} aria-label="Minimizar" />}
        {onClose && <button type="button" className="wmp-janela wmp-close" style={R(1388, 18, 38, 38)} onClick={onClose} aria-label="Fechar" />}
        <div className="wmp-mobile-brand"><img src="/assets/xp/figma/bandeira.png" width="40" height="32" alt="Windows" /></div>
        {volumeDoSistema && <p className="wmp-mobile-note" role="status">Use os botões de volume do celular para ajustar o som.</p>}
      </div>
    </section>
  );
}
