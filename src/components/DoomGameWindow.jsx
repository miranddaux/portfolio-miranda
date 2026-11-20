import { useCallback, useEffect, useRef, useState } from "react";
import { iniciarDoom } from "../lib/doomEngine.js";

// Janela do DOOM (1993): motor local em canvas (shareware). O botão de maximizar da janela entra em tela cheia.
export default function DoomGameWindow() {
  const [estado, setEstado] = useState("carregando"); // carregando | pronto | erro
  const [foco, setFoco] = useState(false);
  const area = useRef(null);
  const canvas = useRef(null);
  const motor = useRef(null);

  const parar = useCallback(() => { motor.current?.parar(); motor.current = null; }, []);
  useEffect(() => parar, [parar]);

  useEffect(() => {
    let cancelado = false;
    setEstado("carregando");
    iniciarDoom({ canvas: canvas.current, alvo: area.current })
      .then((m) => { if (cancelado) m.parar(); else { motor.current = m; setEstado("pronto"); area.current?.focus(); } })
      .catch(() => { if (!cancelado) setEstado("erro"); });
    return () => { cancelado = true; parar(); };
  }, [parar]);

  return (
    <div className="app-doom">
      <div className="doom-palco" ref={area} tabIndex={0} onFocus={() => setFoco(true)} onBlur={() => { setFoco(false); motor.current?.soltarTudo(); }} onPointerDown={() => area.current?.focus()} aria-label="Jogo DOOM. Clique para ativar o teclado.">
        <canvas ref={canvas} className="doom-canvas" aria-hidden="true" />
        {estado === "carregando" && <p className="doom-msg" role="status">Carregando DOOM…</p>}
        {estado === "erro" && <p className="doom-msg" role="alert">Não foi possível carregar o jogo. Recarregue a página.</p>}
        {estado === "pronto" && !foco && <p className="doom-msg" role="status">Clique aqui para jogar</p>}
      </div>
      <p className="doom-teclas">Setas: andar · Ctrl: atirar · Espaço: abrir portas · Shift: correr · Enter: confirmar · Esc: menu · Maximizar: tela cheia</p>
    </div>
  );
}
