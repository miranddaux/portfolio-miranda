import { useRef, useState } from "react";

export const CURRICULOS = {
  pt: { rotulo: "Português", img: "/assets/cv/cv-pt.webp", pdf: "/assets/cv/thiago-miranda-curriculo-pt.pdf", arquivo: "Thiago-Miranda_Curriculo_PT.pdf" },
  en: { rotulo: "English", img: "/assets/cv/cv-en.webp", pdf: "/assets/cv/thiago-miranda-resume-en.pdf", arquivo: "Thiago-Miranda_Resume_EN.pdf" },
};

function Disquete() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#2f5fc4" stroke="#163a8a" />
      <rect x="6" y="2.5" width="11" height="7" fill="#e9eef8" />
      <rect x="13" y="3.5" width="2.5" height="5" fill="#2f5fc4" />
      <rect x="5" y="12.5" width="14" height="8.5" rx="1" fill="#fff" stroke="#9fb3d9" />
      <path d="M7 15h10M7 17.5h10" stroke="#9fb3d9" />
    </svg>
  );
}

// Conteúdo da janela "Meu currículo": visualizador de página com zoom e arrastar.
export default function JanelaCurriculo({ lingua, aoContato }) {
  const [zoom, setZoom] = useState(false);
  const area = useRef(null);
  const arrasto = useRef(null);
  const cv = CURRICULOS[lingua];

  const alternarZoom = (e) => {
    const el = area.current;
    const novo = !zoom;
    // Mantém o ponto clicado no lugar ao ampliar.
    let fx = 0.5, fy = 0.15;
    if (e && el && "clientX" in e) {
      const r = el.getBoundingClientRect();
      fx = (e.clientX - r.left + el.scrollLeft) / el.scrollWidth;
      fy = (e.clientY - r.top + el.scrollTop) / el.scrollHeight;
    }
    setZoom(novo);
    requestAnimationFrame(() => {
      if (!el) return;
      el.scrollLeft = fx * el.scrollWidth - el.clientWidth / 2;
      el.scrollTop = fy * el.scrollHeight - el.clientHeight / 2;
    });
  };

  const aoDescer = (e) => {
    arrasto.current = { x: e.clientX, y: e.clientY, l: area.current.scrollLeft, t: area.current.scrollTop, moveu: false };
  };
  const aoMover = (e) => {
    const a = arrasto.current;
    if (!a) return;
    const dx = e.clientX - a.x, dy = e.clientY - a.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) a.moveu = true;
    if (a.moveu) {
      area.current.scrollLeft = a.l - dx;
      area.current.scrollTop = a.t - dy;
    }
  };
  const aoSoltar = (e) => {
    const a = arrasto.current;
    arrasto.current = null;
    if (a && !a.moveu) alternarZoom(e);
  };

  return (
    <div className="cv-janela">
      <div className="painel-barras">
        <div className="painel-linha">
          <div className="painel-menu" role="menubar" aria-label="Menu">
            <span role="menuitem">Arquivo</span>
            <span role="menuitem">Visualizar</span>
            <span role="menuitem" aria-disabled="true" className="is-desativado">Ajuda</span>
          </div>
        </div>
        <div className="painel-linha painel-ferramentas" role="toolbar" aria-label="Currículo">
          <button type="button" className="painel-botao" onClick={() => alternarZoom()} aria-pressed={zoom}>
            <img src="/assets/xp/painel/busca.png" alt="" width="24" height="24" draggable="false" />
            <span>Zoom</span>
          </button>
          <a className="painel-botao" href={cv.pdf} download={cv.arquivo}>
            <Disquete />
            <span>Salvar</span>
          </a>
          <span className="painel-sep alto" aria-hidden="true" />
          <button type="button" className="painel-botao" disabled title="Indisponível">
            <img src="/assets/xp/painel/impressoras.png" alt="" width="24" height="24" draggable="false" />
            <span>Imprimir</span>
          </button>
          <span className="painel-sep alto" aria-hidden="true" />
          <button type="button" className="painel-botao" onClick={aoContato}>
            <img src="/assets/xp/area/contato.png" alt="" width="24" height="24" draggable="false" />
            <span>Entre em contato comigo</span>
          </button>
        </div>
      </div>
      <div
        ref={area}
        className={`cv-area ${zoom ? "is-zoom" : ""}`}
        onPointerDown={aoDescer}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerLeave={() => (arrasto.current = null)}
      >
        <img
          className="cv-pagina"
          src={cv.img}
          alt={lingua === "pt" ? "Currículo de Thiago Miranda, Product Designer" : "Resume of Thiago Miranda, Product Designer"}
          draggable="false"
        />
      </div>
    </div>
  );
}
