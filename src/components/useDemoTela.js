import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMediaQuery } from "../lib/useEhMobile.js";

// Base das demos do ANIMAE: escala a tela de 430 px para a largura do container,
// inicia os loops ao abrir o case e respeita a preferência de movimento reduzido.
export const DESIGN = { width: 430, height: 932 };

export function useDemoTela(varEscala = "--ad-scale") {
  const root = useRef(null);
  const screen = useRef(null);
  const [paginaVisivel, setPaginaVisivel] = useState(() => document.visibilityState !== "hidden");
  const reduzirMovimento = useMediaQuery("(prefers-reduced-motion: reduce)");

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
    const atualizar = () => setPaginaVisivel(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", atualizar);
    return () => document.removeEventListener("visibilitychange", atualizar);
  }, []);

  const animar = paginaVisivel && !reduzirMovimento;
  return { root, screen, animar };
}
