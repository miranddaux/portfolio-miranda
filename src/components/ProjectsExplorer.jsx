import { useId, useRef, useState } from "react";
import { CASE_STUDIES, PENDING_PROJECTS, projectLinkAction } from "../data/caseStudies.js";

const FOLDER = "/assets/xp/figma/pasta.png";
const normalize = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function ProjectsToolbar({ title = "Projetos", onBack, onSearch, searchOpen, searchId = "projects" }) {
  return (
    <div className="projects-chrome">
      <div className="projects-menubar" aria-hidden="true">
        <span>Arquivo</span><span>Editar</span><span>Exibir</span><span>Favoritos</span><span>Ferramentas</span><span>Ajuda</span>
        <img src="/assets/xp/figma/bandeira.png" alt="" width="24" height="24" />
      </div>
      <div className="projects-toolbar" role="toolbar" aria-label="Navegação dos projetos">
        <button type="button" onClick={onBack} disabled={!onBack} aria-label="Voltar às pastas">
          <img src="/assets/xp/painel/voltar.png" alt="" width="24" height="24" /> Voltar
        </button>
        {onSearch && <button id={`${searchId}-toggle`} type="button" onClick={onSearch} aria-expanded={searchOpen} aria-controls={searchOpen ? `${searchId}-form` : undefined}>
          <img src="/assets/xp/painel/busca.png" alt="" width="24" height="24" /> Buscar
        </button>}
        <span className="projects-toolbar-label">Portfólio Miranda</span>
      </div>
      <div className="projects-address">
        <span>Endereço</span>
        <div><img src={FOLDER} alt="" width="16" height="16" /><span>C:\Miranda\Projetos\{title === "Projetos" ? "" : title}</span></div>
      </div>
    </div>
  );
}

export default function ProjectsExplorer({ onNavigate, embedded = false }) {
  const searchId = useId();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const searchRef = useRef(null);
  const items = [...CASE_STUDIES.map((c) => ({ ...c, category: c.type, available: true })), ...PENDING_PROJECTS];
  const visible = items.filter((p) => normalize(`${p.title} ${p.category} ${(p.categories || []).join(" ")}`).includes(normalize(query.trim())));
  function toggleSearch() {
    setSearchOpen(!searchOpen);
    setQuery("");
    if (!searchOpen) requestAnimationFrame(() => searchRef.current?.focus({ preventScroll: true }));
    else requestAnimationFrame(() => document.getElementById(`${searchId}-toggle`)?.focus({ preventScroll: true }));
  }
  return (
    <div className={`projects-explorer ${embedded ? "is-embedded" : ""}`}>
      {!embedded ? <ProjectsToolbar onSearch={toggleSearch} searchOpen={searchOpen} searchId={searchId} /> : <div className="projects-embedded-heading"><h3>Meus Projetos</h3></div>}
      {searchOpen && <form id={`${searchId}-form`} className="projects-search" role="search" aria-label="Buscar projetos" onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => {
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); toggleSearch(); }
      }}>
        <label htmlFor={`${searchId}-input`}>Nome ou categoria</label>
        <input ref={searchRef} id={`${searchId}-input`} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ANIMAE, Navaja, e-commerce…" />
        <button type="button" className="xp-button" onClick={toggleSearch}>Fechar busca</button>
      </form>}
      <div className="projects-folders-scroll">
        <h2 className="sr-only">Projetos selecionados</h2>
        <ul className="projects-folders" aria-label="Pastas de projetos">
          {visible.map((p) => {
            const content = <>
              <span className="project-folder-icon">
                <img src={FOLDER} alt="" width="64" height="64" draggable="false" />
                {p.available && <span className={`project-folder-mark is-${p.id}`} aria-hidden="true">{"A"}</span>}
              </span>
              <span className="project-folder-caption">
                <span className="project-folder-name">{p.title === "ANIMAE" ? "Animae" : p.title}</span>
                {!p.available && <span className="project-folder-pending" aria-hidden="true">Em construção</span>}
              </span>
              {p.available && <span className="project-folder-category">Web app • Comunidade • Anime</span>}
            </>;
            return <li key={p.id}>
              {p.available ? <a className="project-folder" href={`/cases/${p.id}`} onClick={(e) => projectLinkAction(e, onNavigate, `/cases/${p.id}`)}>{content}</a>
                : <button type="button" className="project-folder is-pending" aria-disabled="true" aria-label={`${p.title} — Em construção`} onClick={() => setNotice(`${p.title}: case em construção.`)}>{content}</button>}
            </li>;
          })}
        </ul>
        {!visible.length && <p className="projects-empty" role="status">Nenhum projeto encontrado. Tente outro nome ou categoria.</p>}
      </div>
      <p className="projects-notice sr-only" role="status">{query ? `${visible.length} pastas encontradas.` : notice}</p>
    </div>
  );
}
