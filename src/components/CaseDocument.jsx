import { useEffect, useRef } from "react";
import { nextCaseStudy, projectLinkAction } from "../data/caseStudies.js";

export function CaseLinks({ links }) {
  const actions = [
    ["site", links.siteLabel || "Visitar site"], ["prototype", "Ver protótipo"],
    ["design", "Ver no Figma"], ["behance", links.behanceLabel || "Ver no Behance"],
  ].filter(([key]) => links[key] && (key !== "behance" || !links.behanceLabel));
  return <div className="case-document-actions">
    {actions.map(([key, label]) => <a key={key} className={`xp-button ${key === "site" && links.siteLabel ? "xp-button--success" : ""}`} href={links[key]} target="_blank" rel="noopener noreferrer">{label}<span className="sr-only"> (abre em nova aba)</span></a>)}
    {!actions.length && <span className="case-links-pending">Links públicos em curadoria.</span>}
  </div>;
}

export function CaseJourney({ journeys }) {
  return <div className="case-journeys">{journeys.map((j) => <div key={j.label} className="case-journey">
    <h3>{j.label}</h3>
    <ol>{j.steps.map((s, i) => <li key={s}><span className="case-journey-step" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span>{s}</span></li>)}</ol>
  </div>)}</div>;
}

function CaseMedia({ media, cover = false, phone = false }) {
  if (!media?.src) return null;
  return <figure className={`case-media ${cover ? "is-cover" : ""} ${phone ? "is-phone" : ""}`}>
    <a className={phone ? "case-device" : undefined} href={media.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar imagem: ${media.alt} (abre em nova aba)`}>
      <span className={phone ? "case-device-screen" : "case-image"}><img src={media.src} alt={media.alt} width={media.width} height={media.height} loading={cover ? "eager" : "lazy"} decoding="async" /></span>
    </a>
    <figcaption>{media.caption}{phone && <span className="case-image-hint">Ampliar tela completa</span>}</figcaption>
  </figure>;
}

export default function CaseDocument({ project, onNavigate }) {
  const title = useRef(null);
  const root = useRef(null);
  const next = nextCaseStudy(project.id);
  const id = (section) => `case-${project.id}-${section}`;
  useEffect(() => {
    document.title = `${project.title} · Case de Product Design · Thiago Miranda`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = project.summary;
    root.current?.closest(".case-document-scroll")?.scrollTo?.({ top: 0 });
    title.current?.focus({ preventScroll: true });
  }, [project.id, project.title, project.summary]);
  return <article ref={root} className={`case-document theme-${project.accent}`}>
    <header className="case-document-header">
      <div className="case-categories"><span className="case-metadata-label">Categorias</span><ul aria-label="Categorias do projeto">{project.categories.map(category => <li key={category}>{category}</li>)}</ul></div>
      <h1 ref={title} tabIndex={-1}>{project.title}</h1>
      <p className="case-document-question">{project.question}</p>
      <dl className="case-document-facts">
        {[["Função", `${project.roleShort} · ${project.team}`], ["Ferramentas", project.tools.join(", ")], ["Ano", project.period]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <CaseLinks links={project.links} />
    </header>
    {project.cover.type === "phone" ? <section className="case-overview-visual" aria-label="Visão geral da interface ANIMAE">
      <div className="case-module-intro"><span className="case-section-label">O produto em telas</span><h2>{project.cover.title}</h2><p>{project.cover.text}</p></div>
      <div className="case-visual-grid is-phones is-triptych">
        {[project.modules[0].images[0], project.modules[1].images[0], project.modules[2].images[0]].map(media => <CaseMedia key={media.src} media={media} phone cover />)}
      </div>
    </section> : <CaseMedia media={project.cover} cover />}
    <section className="case-quick-summary" id={id("resumo")} aria-labelledby={id("resumo-title")}>
      <div className="case-section-label">Leitura rápida</div>
      <h2 id={id("resumo-title")}>O case em 60 segundos</h2>
      <dl>{project.quick.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>
    <section className="case-story-section" id={id("problema")}>
      <div className="case-section-heading"><span className="case-section-label">De onde eu parti</span><h2>{project.problem}</h2></div>
      <p>{project.context}</p>
    </section>
    <div className="case-product-modules" aria-label="Interface e detalhes do produto">
      {project.modules.map((module, index) => <section className="case-product-module" key={module.title} aria-labelledby={id(`module-${index}`)}>
        <div className="case-module-intro"><span className="case-section-label">{String(index + 1).padStart(2, "0")} · Interface e experiência</span><h2 id={id(`module-${index}`)}>{module.title}</h2><p>{module.text}</p></div>
        {module.images.length > 0 && <div className={`case-visual-grid ${module.layout === "phones" ? "is-phones" : ""}`}>
          {module.images.map(media => <CaseMedia key={media.src} media={media} phone={module.layout === "phones"} />)}
        </div>}
      </section>)}
    </div>
    <section className="case-story-section" id={id("pesquisa")}>
      <div className="case-section-heading"><span className="case-section-label">Pesquisa e contexto</span><h2>O que orientou a direção</h2></div>
      <div><p>{project.research.intro}</p><dl className="case-research-facts">{project.research.findings.map(([label, value]) => <div key={`${label}-${value}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
    </section>
    <section className="case-decisions-section" id={id("decisoes")}>
      <span className="case-section-label">Decisões de produto</span><h2>Escolhas que deram forma ao produto</h2>
      <div className="case-decisions">{project.decisions.map((d, i) => <section key={d.title} className="case-decision">
        <span className="case-decision-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
        <div><h3>{d.title}</h3><p>{d.choice}</p><p className="case-tradeoff"><strong>A troca:</strong> {d.tradeoff}</p></div>
      </section>)}</div>
    </section>
    <section className="case-solution-section" id={id("solucao")}>
      <span className="case-section-label">Fluxo da experiência</span><h2>Da hipótese à experiência</h2><p>{project.solution}</p>
      <CaseJourney journeys={project.journeys} />
    </section>
    <section className="case-results-section" id={id("resultados")}>
      <span className="case-section-label">Estado do projeto</span><h2>O que existe e o que medir</h2><p>{project.outcome}</p>
      <div className="case-measurement"><h3>Plano de medição</h3><p>Indicadores propostos. Ainda sem resultados publicados.</p>
        <dl>{project.kpis.map(([label, definition]) => <div key={label}><dt>{label}</dt><dd>{definition}</dd><span>A medir</span></div>)}</dl>
      </div>
    </section>
    <section className="case-learning-section" id={id("aprendizados")}>
      <span className="case-section-label">Aprendizados</span><h2>O que levo para o próximo projeto</h2><p>{project.learning}</p>
    </section>
    {project.id === "animae" && <section className="case-website-section" aria-labelledby={id("website-title")}>
      <span className="case-section-label">Website</span><h2 id={id("website-title")}>A porta de entrada para o ANIMAE</h2>
      <p>Na landing page, apresento a proposta do produto e o universo visual que construí para ele. É o primeiro contato antes de explorar o aplicativo.</p>
      <div className="case-website-preview" role="img" aria-label="Espaço reservado para a captura real da landing page do ANIMAE">
        <span className="case-website-address">animaeapp.com.br</span><strong>Landing page do ANIMAE</strong><span>Captura em preparação</span>
      </div>
    </section>}
    <footer className="case-document-footer">
      <CaseLinks links={project.links} />
      {project.links.behanceLabel && <p className="case-archive-link"><a href={project.links.behance} target="_blank" rel="noopener noreferrer">{project.links.behanceLabel}<span className="sr-only"> (abre em nova aba)</span></a><span>Arquivo da proposta inicial de streaming.</span></p>}
      <div className="case-document-pagination">
        <a className="xp-button" href="/#cases" onClick={(e) => projectLinkAction(e, onNavigate, "/#cases")}>Meus Projetos</a>
        <a className="xp-button" href={`/cases/${next.id}`} onClick={(e) => projectLinkAction(e, onNavigate, `/cases/${next.id}`)}>Próximo: {next.title}</a>
      </div>
    </footer>
  </article>;
}
