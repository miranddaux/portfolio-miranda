import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { playChime } from "../lib/chime";
import { useEhMobile } from "../lib/useEhMobile.js";

const BALLOON_DELAY = 2500;
const BALLOON_DURATION = 10000;
const SESSION_KEY = "miranda-desktop-alerts";

function alreadyShown() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "done";
  } catch {
    return false;
  }
}

/** Balão de boas-vindas: abre depois de ~2,5 s com som e fecha sozinho em 10 s. */
export default function DesktopAlerts({ ancoraRef, reabrir = 0, onFim }) {
  const mobile = useEhMobile();
  const [balloon, setBalloon] = useState(false);
  const fimRef = useRef(false);
  const avisarFim = () => {
    if (mobile) return;
    if (fimRef.current) return;
    fimRef.current = true;
    setTimeout(() => onFim?.(), 800);
  };

  useEffect(() => {
    if (mobile) { setBalloon(false); return; } // No celular, só abre pelo ícone de informação.
    if (alreadyShown()) {
      const t = setTimeout(avisarFim, 2500);
      return () => clearTimeout(t);
    }
    try {
      sessionStorage.setItem(SESSION_KEY, "done");
    } catch {}
    const a = setTimeout(() => setBalloon(true), BALLOON_DELAY);
    return () => clearTimeout(a);
  }, [mobile]);

  useEffect(() => {
    if (reabrir > 0) setBalloon(true);
  }, [reabrir]);

  // Som ao abrir; fecha sozinho depois de 10 s; Esc também fecha.
  const jaAbriu = useRef(false);
  useEffect(() => {
    if (!balloon) {
      if (jaAbriu.current) avisarFim();
      return;
    }
    jaAbriu.current = true;
    playChime();
    const t = setTimeout(() => setBalloon(false), BALLOON_DURATION);
    const onKey = (e) => {
      if (e.key === "Escape") setBalloon(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [balloon]);

  const ancora = ancoraRef?.current;
  if (!balloon || !ancora) return null;
  return createPortal(<Balao aoFechar={() => setBalloon(false)} />, ancora.parentElement);
}

// Balão de boas-vindas ancorado no ícone de informação (Figma: Message 128:489).
function Balao({ aoFechar }) {
  const ehMobile = useEhMobile();
  return (
    <section className="balao" role="status" aria-label="Boas-vindas">
      <button className="balao-fechar" onClick={aoFechar} aria-label="Fechar aviso">
        <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
          <path d="M1 1 L8 8 M8 1 L1 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
      </button>
      <div className="balao-titulo">
        <img src="/assets/xp/figma/informacao.png" alt="" width="20" height="20" />
        <strong>Bem-vindo ao Portfólio Miranda</strong>
      </div>
      <p>Meu portfólio, montado como um desktop Windows XP.</p>
      <p>- {ehMobile ? "Toque em um ícone para começar" : "Dê dois cliques em um ícone para começar"}</p>
      <p>- Ou abra um programa pelo menu Iniciar</p>
      <svg className="balao-cauda" width="33" height="34" viewBox="0 0 33 34" aria-hidden="true">
        <path d="M0 0 L32 33 L32 0 Z" fill="#ffffe1" />
        <path d="M0 0.5 L32 33 L32 0" fill="none" stroke="#000" />
      </svg>
    </section>
  );
}
