import { useEffect, useState } from "react";
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
    // O quadro do ANIMAE (430 × 932) preenche a moldura do celular: sem barra do Figma e sem faixas pretas.
    e.searchParams.set("scaling", "contain");
    e.searchParams.set("content-scaling", "fixed");
    e.searchParams.set("hide-ui", "1");
    e.searchParams.set("hotspot-hints", "0");
    e.searchParams.set("embed-host", "portfolio-miranda");
    return e.toString();
  } catch {
    return null;
  }
}

// Quando o navegador não deixa embutir o Figma (ex.: prévia hospedada), a janela navega pelas telas reais.
function ScreenTour({ screens }) {
  const [i, setI] = useState(0);
  const go = (d) => setI((v) => (v + d + screens.length) % screens.length);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [screens.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const cur = screens[i];
  return (
    <div className="proto-tour">
      <div className="proto-phone">
        <img src={cur.src} alt={cur.alt} width={cur.width} height={cur.height} draggable="false" />
      </div>
      <p className="proto-tour-label" aria-live="polite">{cur.label}</p>
      <div className="proto-tour-controls">
        <button type="button" className="xp-button xp-button--back" onClick={() => go(-1)} aria-label="Tela anterior">‹ Anterior</button>
        <span className="proto-tour-dots" role="group" aria-label="Telas">{screens.map((s, n) => <button key={s.src} type="button" className={n === i ? "is-on" : ""} onClick={() => setI(n)} aria-label={`Tela ${n + 1} de ${screens.length}`} aria-current={n === i} />)}</span>
        <button type="button" className="xp-button" onClick={() => go(1)} aria-label="Próxima tela">Próxima</button>
      </div>
    </div>
  );
}

export default function PrototypeModal({ title, url, embedUrl, screens = [], frame = { width: 430, height: 932 }, onClose }) {
  const [run, setRun] = useState(0);
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
        statusEsquerda={embedUrl ? `Celular · ${frame.width} px · protótipo navegável do Figma` : "Celular · telas do Figma · use as setas do teclado"}
        statusDireita={<>
          {embedUrl && <button type="button" className="proto-status-link" onClick={() => setRun((n) => n + 1)}>Reiniciar</button>}
          <a className="proto-status-link" href={url} target="_blank" rel="noopener noreferrer">Abrir no Figma<span className="sr-only"> (abre em nova aba)</span></a>
        </>}
      >
        <div className="proto-stage">
          {embedUrl
            ? <div className="proto-phone" style={{ aspectRatio: `${frame.width} / ${frame.height}` }}><iframe key={run} title={`Protótipo navegável de ${title}`} src={embedUrl} allow="fullscreen" allowFullScreen loading="lazy" /></div>
            : <ScreenTour screens={screens} />}
        </div>
      </JanelaXP>
    </div>,
    document.body,
  );
}
