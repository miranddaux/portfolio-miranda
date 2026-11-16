import { useEffect, useRef } from "react";
import { nextCaseStudy, projectLinkAction } from "../data/caseStudies.js";

export function CaseLinks({ links }) {
  const actions = [
    ["prototype", "Testar protótipo"], ["site", "Visitar site publicado"],
    ["behance", links.behanceLabel || "Case completo no Behance"], ["design", "Ver arquivo no Figma"],
  ].filter(([key]) => links[key]);
  return <div className="case-document-actions">
    {actions.map(([key, label]) => <a key={key} className="xp-button" href={links[key]} target="_blank" rel="noopener noreferrer">{label}<span aria-hidden="true">↗</span><span className="sr-only"> (abre em nova aba)</span></a>)}
    {!actions.length && <span className="case-links-pending">Links públicos em curadoria.</span>}
  </div>;
}

export function CaseJourney({ journeys }) {
  return <div className="case-journeys">{journeys.map((j) => <div key={j.label} className="case-journey">
    <h3>{j.label}</h3>
    <ol>{j.steps.map((s, i) => <li key={s}><span className="case-journey-step" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span>{s}</span></li>)}</ol>
  </div>)}</div>;
}

function CaseMedia({ media, cover = false }) {
  if (!media?.src) return null;
  return <figure className={`case-media ${cover ? "is-cover" : ""}`}>
    <a href={media.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar imagem: ${media.alt} (abre em nova aba)`}>
      <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading={cover ? "eager" : "lazy"} decoding="async" />
    </a>
    <figcaption>{media.caption}</figcaption>
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
  const sections = [["resumo", "Resumo"], ["problema", "Problema"], ["pesquisa", "Pesquisa"], ["decisoes", "Decisões"], ["solucao", "Solução"], ["resultados", "Resultados"], ["aprendizados", "Aprendizados"]];
  return <article ref={root} className={`case-document theme-${project.accent}`}>
    <header className="case-document-header">
      <p className="case-document-eyebrow">{project.type}</p>
      <h1 ref={title} tabIndex={-1}>{project.title}</h1>
      <p className="case-document-question">{project.question}</p>
      <p className="case-document-status"><span aria-hidden="true" />{project.status}</p>
      <dl className="case-document-facts">
        {[["Meu papel", project.roleShort], ["Time", project.team], ["Período", project.period]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <CaseLinks links={project.links} />
    </header>
    <nav className="case-document-index" aria-label={`Índice do case ${project.title}`}>
      {sections.map(([key, label]) => <a key={key} href={`#${id(key)}`}>{label}</a>)}
    </nav>
    <section className="case-quick-summary" id={id("resumo")} aria-labelledby={id("resumo-title")}>
      <div className="case-section-label">Leitura rápida</div>
      <h2 id={id("resumo-title")}>O case em 60 segundos</h2>
      <dl>{project.quick.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>
    {project.cover.type === "phone" ? <figure className="case-phone-cover">
      <div><span className="case-section-label">A experiência</span><h2>{project.cover.title}</h2><p>{project.cover.text}</p><span className="case-phone-tag">MVP social · tela do Figma</span></div>
      <a href={project.cover.src} target="_blank" rel="noopener noreferrer" aria-label="Ampliar tela do ANIMAE (abre em nova aba)"><img src={project.cover.src} alt={project.cover.alt} width={project.cover.width} height={project.cover.height} /></a>
      <figcaption>{project.cover.caption}</figcaption>
    </figure> : project.cover.type === "journey" ? <div className="case-service-cover"><h2>{project.cover.title}</h2><p>{project.cover.text}</p><CaseJourney journeys={project.journeys} /></div> : <CaseMedia media={project.cover} cover />}
    <section className="case-story-section" id={id("problema")}>
      <div className="case-section-heading"><span className="case-section-label">01 · Contexto e problema</span><h2>{project.problem}</h2></div>
      <p>{project.context}</p>
    </section>
    <section className="case-story-section" id={id("pesquisa")}>
      <div className="case-section-heading"><span className="case-section-label">02 · Pesquisa</span><h2>O que orientou a direção</h2></div>
      <div><p>{project.research.intro}</p><dl className="case-research-facts">{project.research.findings.map(([label, value]) => <div key={`${label}-${value}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
    </section>
    <section className="case-decisions-section" id={id("decisoes")}>
      <span className="case-section-label">03 · Ideação e decisões</span><h2>Escolhas que deram forma ao produto</h2>
      <div className="case-decisions">{project.decisions.map((d, i) => <section key={d.title} className="case-decision">
        <span className="case-decision-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
        <div><h3>{d.title}</h3><p>{d.choice}</p><p className="case-tradeoff"><strong>A troca:</strong> {d.tradeoff}</p></div>
      </section>)}</div>
    </section>
    <section className="case-solution-section" id={id("solucao")}>
      <span className="case-section-label">04 · Jornada e solução</span><h2>Da hipótese à experiência</h2><p>{project.solution}</p>
      <CaseJourney journeys={project.journeys} />
      <ul className="case-tool-stack" aria-label="Ferramentas do projeto">{project.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
      {project.gallery.map((media) => <CaseMedia key={media.src} media={media} />)}
    </section>
    <section className="case-results-section" id={id("resultados")}>
      <span className="case-section-label">05 · Resultado e próximos passos</span><h2>O que existe e o que medir</h2><p>{project.outcome}</p>
      <div className="case-measurement"><h3>Plano de medição</h3><p>Indicadores propostos. Ainda sem resultados publicados.</p>
        <dl>{project.kpis.map(([label, definition]) => <div key={label}><dt>{label}</dt><dd>{definition}</dd><span>A medir</span></div>)}</dl>
      </div>
    </section>
    <section className="case-learning-section" id={id("aprendizados")}>
      <span className="case-section-label">06 · Aprendizados</span><h2>O que levo para o próximo projeto</h2><p>{project.learning}</p>
    </section>
    <footer className="case-document-footer">
      <CaseLinks links={project.links} />
      <div className="case-document-pagination">
        <a className="xp-button" href="/#cases" onClick={(e) => projectLinkAction(e, onNavigate, "/#cases")}>← Voltar às pastas</a>
        <a className="xp-button" href={`/cases/${next.id}`} onClick={(e) => projectLinkAction(e, onNavigate, `/cases/${next.id}`)}>Próximo: {next.title} →</a>
      </div>
    </footer>
  </article>;
}
