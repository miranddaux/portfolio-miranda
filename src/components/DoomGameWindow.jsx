import { useCallback, useEffect, useRef, useState } from "react";
import { iniciarDoom } from "../lib/doomEngine.js";

const URL_ONLINE = "https://silentspacemarine.com/";
const COMANDOS = [
  ["Setas", "andar e girar"], ["Ctrl", "atirar"], ["Espaço", "abrir portas e usar"], ["Shift", "correr"],
  ["Alt + setas", "andar de lado"], ["1 a 7", "trocar de arma"], ["Tab", "mapa"], ["Enter", "escolher no menu"], ["Esc", "menu do jogo"],
];

const Ajuda = ({ aoFechar }) => (
  <div className="doom-ajuda" role="dialog" aria-label="Controles do DOOM">
    <h3>Controles</h3>
    <dl>{COMANDOS.map(([t, d]) => (<div key={t}><dt>{t}</dt><dd>{d}</dd></div>))}</dl>
    <p>Na versão local só o teclado funciona e não há som. Mouse e som ficam na versão online.</p>
    <button type="button" className="xp-button" onClick={aoFechar}>Fechar</button>
  </div>
);

// Janela do DOOM (1993): launcher -> motor local em canvas (shareware) ou versão online em iframe.
export default function DoomGameWindow() {
  const [modo, setModo] = useState("launcher"); // launcher | local | online
  const [estado, setEstado] = useState("parado"); // parado | carregando | pronto | erro
  const [foco, setFoco] = useState(false);
  const [ajuda, setAjuda] = useState(false);
  const area = useRef(null);
  const canvas = useRef(null);
  const motor = useRef(null);

  const parar = useCallback(() => { motor.current?.parar(); motor.current = null; }, []);
  useEffect(() => parar, [parar]);

  useEffect(() => {
    if (modo !== "local") return undefined;
    let cancelado = false;
    setEstado("carregando");
    iniciarDoom({ canvas: canvas.current, alvo: area.current })
      .then((m) => { if (cancelado) m.parar(); else { motor.current = m; setEstado("pronto"); area.current?.focus(); } })
      .catch(() => { if (!cancelado) setEstado("erro"); });
    return () => { cancelado = true; parar(); };
  }, [modo, parar]);

  const tela = () => { const el = area.current; if (!el) return; if (document.fullscreenElement) document.exitFullscreen?.(); else el.requestFullscreen?.().then(() => el.focus()).catch(() => {}); };
  const sair = () => { setModo("launcher"); setEstado("parado"); setFoco(false); setAjuda(false); };

  if (modo === "launcher") {
    return (
      <div className="app-doom app-doom-launcher">
        <img className="doom-logo" src="/assets/doom/logo.webp" alt="DOOM" width="360" height="222" />
        <h2>DOOM (1993)</h2>
        <p>Use o teclado para jogar. Mouse e som: versão online.</p>
        <div className="doom-botoes">
          <button type="button" className="xp-button doom-jogar" onClick={() => setModo("local")}>Jogar DOOM</button>
          <button type="button" className="xp-button" onClick={() => setModo("online")}>Versão online (som e mouse)</button>
          <button type="button" className="xp-button" onClick={() => setAjuda((a) => !a)} aria-expanded={ajuda}>Instruções</button>
        </div>
        {ajuda && <Ajuda aoFechar={() => setAjuda(false)} />}
      </div>
    );
  }

  return (
    <div className="app-doom">
      <div className="doom-barra" role="toolbar" aria-label="Controles do jogo">
        <button type="button" className="xp-button" onClick={sair}>Sair do jogo</button>
        {modo === "local" && <button type="button" className="xp-button" onClick={tela}>Tela cheia</button>}
        <button type="button" className="xp-button" onClick={() => setAjuda((a) => !a)} aria-expanded={ajuda}>Ajuda</button>
      </div>
      {modo === "local" ? (
        <div className="doom-palco" ref={area} tabIndex={0} onFocus={() => setFoco(true)} onBlur={() => { setFoco(false); motor.current?.soltarTudo(); }} onPointerDown={() => area.current?.focus()} aria-label="Jogo DOOM. Clique para ativar o teclado.">
          <canvas ref={canvas} className="doom-canvas" aria-hidden="true" />
          {estado === "carregando" && <p className="doom-msg" role="status">Carregando DOOM…</p>}
          {estado === "erro" && <p className="doom-msg" role="alert">Não foi possível carregar o jogo. Tente de novo ou use a versão online.</p>}
          {estado === "pronto" && !foco && <p className="doom-msg" role="status">Clique aqui para jogar</p>}
          {ajuda && <Ajuda aoFechar={() => setAjuda(false)} />}
        </div>
      ) : (
        <div className="doom-palco doom-online">
          <iframe title="DOOM online (Silent Space Marine)" src={URL_ONLINE} allow="autoplay; fullscreen; gamepad; pointer-lock; keyboard-map" referrerPolicy="no-referrer-when-downgrade" />
          {ajuda && <Ajuda aoFechar={() => setAjuda(false)} />}
        </div>
      )}
      <div className="app-embed-status">
        {modo === "local"
          ? <span>DOOM shareware · teclado · {foco ? "teclado ativo" : "clique no jogo para ativar o teclado"}</span>
          : <><span>Site externo: Silent Space Marine.</span><a href={URL_ONLINE} target="_blank" rel="noopener noreferrer">Não carregou? Abrir em nova aba<span className="sr-only"> (abre em nova aba)</span></a></>}
      </div>
    </div>
  );
}
