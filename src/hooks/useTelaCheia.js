import { useEffect, useState } from "react";

// F11 alterna tela cheia do site inteiro (o navegador não deixa JS ler o F11 em alguns casos,
// então o atalho usa a API de tela cheia no lugar do comportamento nativo).
export function alternarTelaCheia() {
  if (document.fullscreenElement) return document.exitFullscreen?.();
  return document.documentElement.requestFullscreen?.().catch(() => {});
}

// Atalho F11 (registrar uma vez, no App).
export function useAtalhoTelaCheia() {
  useEffect(() => {
    const aoTecla = (e) => {
      if (e.key !== "F11") return;
      e.preventDefault();
      alternarTelaCheia();
    };
    window.addEventListener("keydown", aoTecla);
    return () => window.removeEventListener("keydown", aoTecla);
  }, []);
}

// Estado atual (para esconder o aviso quando já está em tela cheia).
export default function useTelaCheia() {
  const [cheia, setCheia] = useState(false);
  useEffect(() => {
    const aoMudar = () => setCheia(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", aoMudar);
    return () => document.removeEventListener("fullscreenchange", aoMudar);
  }, []);
  return cheia;
}
