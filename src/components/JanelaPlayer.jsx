import { useLayoutEffect, useRef, useState } from "react";
import WindowsMediaPlayer from "./WindowsMediaPlayer";
import { VIDEOS_PLAYER } from "../data/player.js";

const BARRA = 30;
const limitar = (v, min, max) => Math.max(min, Math.min(max, v));

// Janela do Reprodutor de mídia: o player já traz a própria moldura (barra de título, fechar e minimizar),
// então aqui só há posição, arrastar pela barra azul e foco. Não usa a JanelaXP para não duplicar a barra.
export default function JanelaPlayer({ ativa, oculta, onFocar, onFechar, onMinimizar, src, poster, title }) {
  const raiz = useRef(null);
  const [caixa, setCaixa] = useState(null);

  useLayoutEffect(() => {
    const ajustar = () => {
      const pai = raiz.current?.offsetParent || document.body;
      const w = limitar(Math.min(720, pai.clientWidth - 32), 288, 720);
      setCaixa(c => ({ x: c ? limitar(c.x, 0, Math.max(0,pai.clientWidth-w)) : Math.max(0, Math.round((pai.clientWidth - w) / 2)), y: c ? limitar(c.y,0,Math.max(0,window.innerHeight-96)) : 48, w }));
    };
    ajustar();
    window.addEventListener('resize', ajustar);
    return () => window.removeEventListener('resize', ajustar);
  }, []);

  const arrastar = (e) => {
    if (e.button !== 0 || !caixa) return;
    onFocar?.();
    const alvo = e.currentTarget;
    alvo.setPointerCapture(e.pointerId);
    const ini = { px: e.clientX, py: e.clientY, ...caixa };
    const mover = (ev) => {
      const pai = raiz.current?.offsetParent || document.body;
      setCaixa((c) => ({
        ...c,
        x: limitar(ini.x + ev.clientX - ini.px, -(c.w - 120), pai.clientWidth - 120),
        y: limitar(ini.y + ev.clientY - ini.py, 0, window.innerHeight - BARRA - 64),
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

  const estilo = caixa ? { left: caixa.x, top: caixa.y, width: caixa.w } : { visibility: "hidden" };
  if (oculta) estilo.display = "none";

  return (
    <div ref={raiz} id="player-title" tabIndex={-1} className={`janela-player ${ativa ? "is-ativa" : ""}`} style={estilo} onPointerDown={onFocar}>
      <WindowsMediaPlayer src={src} playlist={src ? undefined : VIDEOS_PLAYER} poster={poster} title={title} autoPlay loop onClose={onFechar} onMinimize={onMinimizar} onDragStart={arrastar} />
    </div>
  );
}
