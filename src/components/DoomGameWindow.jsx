import { useCallback, useEffect, useRef, useState } from "react";
import { iniciarDoom } from "../lib/doomEngine.js";

const URL_ONLINE = "https://silentspacemarine.com/";

// Janela do DOOM (1993): abre direto no jogo (motor local em canvas, shareware) ou na versão online em iframe.
export default function DoomGameWindow() {
  const [modo, setModo] = useState("local"); // local | online
  const [estado, setEstado] = useState("carregando"); // carregando | pronto | erro
  const [foco, setFoco] = useState(false);
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

  return (
    <div className="app-doom">
      <div className="doom-barra" role="toolbar" aria-label="Controles do jogo">
        {modo === "local" ? (
          <>
            <button type="button" className="xp-button" onClick={tela}>Tela cheia</button>
            <button type="button" className="xp-button" onClick={() => setModo("online")}>Versão online (som e mouse)</button>
          </>
        ) : (
          <button type="button" className="xp-button" onClick={() => setModo("local")}>Voltar para a versão local</button>
        )}
      </div>
      {modo === "local" ? (
        <div className="doom-palco" ref={area} tabIndex={0} onFocus={() => setFoco(true)} onBlur={() => { setFoco(false); motor.current?.soltarTudo(); }} onPointerDown={() => area.current?.focus()} aria-label="Jogo DOOM. Clique para ativar o teclado.">
          <canvas ref={canvas} className="doom-canvas" aria-hidden="true" />
          {estado === "carregando" && <p className="doom-msg" role="status">Carregando DOOM…</p>}
          {estado === "erro" && <p className="doom-msg" role="alert">Não foi possível carregar o jogo. Tente a versão online.</p>}
          {estado === "pronto" && !foco && <p className="doom-msg" role="status">Clique aqui para jogar</p>}
        </div>
      ) : (
        <div className="doom-palco doom-online">
          <iframe title="DOOM online (Silent Space Marine)" src={URL_ONLINE} allow="autoplay; fullscreen; gamepad; pointer-lock; keyboard-map" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      )}
      <p className="doom-teclas">
        {modo === "local"
          ? "Setas: andar e girar · Ctrl: atirar · Espaço: abrir portas · Shift: correr · Alt + setas: andar de lado · 1 a 7: armas · Tab: mapa · Esc: menu"
          : <>Site externo: Silent Space Marine. <a href={URL_ONLINE} target="_blank" rel="noopener noreferrer">Não carregou? Abrir em nova aba<span className="sr-only"> (abre em nova aba)</span></a></>}
      </p>
    </div>
  );
}
