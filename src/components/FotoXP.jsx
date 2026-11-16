import { useEffect, useState } from "react";

/**
 * Foto com efeito de carregamento do Windows XP: a imagem aparece em faixas,
 * de cima para baixo, com uma linha de varredura na frente.
 * O efeito roda só na primeira vez da visita (sessionStorage); depois a foto já aparece carregada.
 */
const CHAVE = "miranda-foto-carregada";
const jaViu = () => {
  try {
    return sessionStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
};

export default function FotoXP({ src, alt = "", largura, altura, aoErro, atraso = 0 }) {
  const [vista] = useState(jaViu);
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAVE, "1");
    } catch {}
  }, []);
  return (
    <span className={`foto-xp${vista ? " is-vista" : ""}`} style={{ "--foto-atraso": `${atraso}ms` }}>
      <img src={src} alt={alt} width={largura} height={altura} onError={aoErro} draggable="false" />
    </span>
  );
}
