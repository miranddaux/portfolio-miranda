import { useLayoutEffect, useRef, useState } from "react";
import HeadspacePlayer from "./headspace/HeadspacePlayer.jsx";

const BARRA = 30;
const limitar = (v, min, max) => Math.max(min, Math.min(max, v));

// Janela flutuante da Headspace: o player não tem barra azul; a moldura verde é a janela.
// Aqui há só posição, arrastar pela moldura, foco e os estados de minimizar e fechar do desktop.
export default function JanelaHeadspace({ ativa, oculta, onFocar, onFechar, onMinimizar }) {
  const raiz = useRef(null);
  const [caixa, setCaixa] = useState(null);

  useLayoutEffect(() => {
    const pai = raiz.current?.offsetParent || document.body;
    const w = limitar(pai.clientWidth - 32, 280, 480);
    setCaixa({ x: Math.max(0, Math.round((pai.clientWidth - w) / 2)), y: 16, w });
  }, []);

  const arrastar = (e) => {
    if (e.button !== 0 || !caixa) return;
    onFocar?.();
    const alvo = e.currentTarget;
    alvo.setPointerCapture?.(e.pointerId);
    const ini = { px: e.clientX, py: e.clientY, ...caixa };
    const mover = (ev) => {
      const pai = raiz.current?.offsetParent || document.body;
      setCaixa((c) => ({
        ...c,
        x: limitar(ini.x + ev.clientX - ini.px, -(c.w * 0.5), pai.clientWidth - c.w * 0.5),
        y: limitar(ini.y + ev.clientY - ini.py, -c.w * 0.05, window.innerHeight - BARRA - 96),
      }));
    };
    const soltar = () => {
      alvo.removeEventListener("pointermove", mover);
      alvo.removeEventListener("pointerup", soltar);
      alvo.removeEventListener("pointercancel", soltar);
    };
    alvo.addEventListener("pointermove", mover);
    alvo.addEventListener("pointerup", soltar);
    alvo.addEventListener("pointercancel", soltar);
  };

  const estilo = caixa ? { left: caixa.x, top: caixa.y, width: caixa.w, height: caixa.w } : { visibility: "hidden" };
  if (oculta) estilo.display = "none";

  return (
    <div ref={raiz} id="headspace-title" tabIndex={-1} className={`janela-headspace ${ativa ? "is-ativa" : ""}`} style={estilo} onPointerDown={onFocar} role="group" aria-label="Headspace, reprodutor de música">
      <HeadspacePlayer onClose={onFechar} onMinimize={onMinimizar} onDragStart={arrastar} />
    </div>
  );
}
