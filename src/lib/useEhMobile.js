import { useEffect, useState } from "react";

// Um único ponto de verdade para "estamos em tela pequena".
// 760 px é o mesmo limite em que a JanelaXP passa a ocupar a tela inteira.
export const LIMITE_MOBILE = 760;

export function useMediaQuery(consulta) {
  const [bate, setBate] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(consulta).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(consulta);
    const ouvir = (e) => setBate(e.matches);
    setBate(mq.matches);
    mq.addEventListener("change", ouvir);
    return () => mq.removeEventListener("change", ouvir);
  }, [consulta]);
  return bate;
}

export function useEhMobile() {
  return useMediaQuery(`(max-width: ${LIMITE_MOBILE}px)`);
}

// Aparelho sem mouse: usado para trocar jogos de teclado por um recado.
export function useSemTeclado() {
  return useMediaQuery("(pointer: coarse)");
}
