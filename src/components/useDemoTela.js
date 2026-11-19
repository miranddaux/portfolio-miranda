import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Base das demos do ANIMAE: escala a tela de 430 px para a largura do container,
// avisa quando está visível e respeita prefers-reduced-motion.
export const DESIGN = { width: 430, height: 932 };

export function useDemoTela(varEscala = "--ad-scale") {
  const root = useRef(null);
  const screen = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    const fit = () => {
      const largura = el.clientWidth || el.getBoundingClientRect().width;
      if (largura > 0) screen.current?.style.setProperty(varEscala, String(largura / DESIGN.width));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("load", fit);
    return () => { ro.disconnect(); window.removeEventListener("load", fit); };
  }, [varEscala]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.4 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  const animar = visivel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return { root, screen, animar };
}
