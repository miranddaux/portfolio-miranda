import { useEffect } from "react";
import { createPortal } from "react-dom";
import JanelaXP from "./JanelaXP.jsx";

// Protótipo do Figma aberto na própria página, dentro de uma janela do Windows XP.
// Só links figma.com/proto viram embed; qualquer outro link continua abrindo em nova aba.
export function prototypeEmbedUrl(url) {
  // A prévia hospedada bloqueia quadros de outros sites; nela o botão abre o Figma em nova aba.
  if (import.meta.env.VITE_PREVIA) return null;
  try {
    const u = new URL(url);
    if (!/(^|\.)figma\.com$/.test(u.hostname) || !u.pathname.startsWith("/proto/")) return null;
    const fileKey = u.pathname.split("/")[2];
    if (!fileKey) return null;
    const e = new URL(`https://embed.figma.com/proto/${fileKey}`);
    for (const key of ["node-id", "starting-point-node-id"]) {
      if (u.searchParams.has(key)) e.searchParams.set(key, u.searchParams.get(key));
    }
    e.searchParams.set("scaling", "scale-down");
    e.searchParams.set("content-scaling", "fixed");
    e.searchParams.set("embed-host", "portfolio-miranda");
    return e.toString();
  } catch {
    return null;
  }
}

export default function PrototypeModal({ title, url, embedUrl, onClose }) {
  useEffect(() => {
    const previous = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => document.querySelector(".proto-overlay .janela-xp-fechar")?.focus(), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);
  return createPortal(
    <div className="proto-overlay" role="dialog" aria-modal="true" aria-label={`Protótipo de ${title}`} onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <JanelaXP
        id="prototipo"
        titulo={`Protótipo · ${title}`}
        icone="/assets/xp/figma/pasta.png"
        onFechar={onClose}
        largura={1056}
        altura={880}
        reserva={32}
        centroVertical
        minLargura={320}
        minAltura={480}
        topo={32}
        statusEsquerda="Celular · 390 px · protótipo navegável do Figma"
        statusDireita={<a className="proto-status-link" href={url} target="_blank" rel="noopener noreferrer">Abrir no Figma<span className="sr-only"> (abre em nova aba)</span></a>}
      >
        <div className="proto-stage">
          <div className="proto-phone">
            <iframe title={`Protótipo navegável de ${title}`} src={embedUrl} allow="fullscreen" allowFullScreen loading="lazy" />
          </div>
        </div>
      </JanelaXP>
    </div>,
    document.body,
  );
}
