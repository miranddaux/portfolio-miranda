import { useEffect, useRef } from "react";
import { nextCaseStudy, projectLinkAction } from "../data/caseStudies.js";

// Todos os botões do case usam o mesmo .xp-button (azul com ▸). Ordem: site, protótipo, Figma, Behance.
export function CaseLinks({ links }) {
  const actions = [
    ["site", links.siteLabel || "Visitar site"],
    ["prototype", "Ver protótipo"],
    ["design", "Ver no Figma"],
    ["behance", links.behanceLabel || "Ver no Behance"],
  ].filter(([key]) => links[key]);
  return <div className="case-document-actions">
    {actions.map(([key, label]) => <a key={key} className="xp-button" href={links[key]} target="_blank" rel="noopener noreferrer">{label}<span className="sr-only"> (abre em nova aba)</span></a>)}
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

// Grid editorial modular: uma imagem grande em destaque e, embaixo, até três menores lado a lado.
function ModularGrid({ figures, phone = false, label }) {
  const [lead, ...rest] = figures;
  if (!lead) return null;
  const rows = [];
  for (let i = 0; i < rest.length; i += 3) rows.push(rest.slice(i, i + 3));
  return <div className={`case-modular ${phone ? "is-phones" : ""}`} role="group" aria-label={label}>
    <div className="case-modular-lead"><CaseMedia media={lead} phone={phone} /></div>
    {rows.map((row, i) => <div key={i} className="case-modular-row" style={{ "--colunas": row.length }}>
      {row.map((media) => <CaseMedia key={media.src} media={media} phone={phone} />)}
    </div>)}
  </div>;
}

function CaseVideo({ video }) {
  if (!video?.src) return null;
  return <figure className="case-video">
    <video controls preload="metadata" poster={video.poster} src={video.src}>Seu navegador não reproduz este vídeo.</video>
    <figcaption>{video.caption}</figcaption>
  </figure>;
}

function Stage({ number, label, title, id, children }) {
  return <section className="case-stage" id={id} aria-labelledby={`${id}-title`}>
    <header className="case-stage-head">
      <span className="case-stage-number" aria-hidden="true">{number}</span>
      <span className="case-section-label">{label}</span>
      <h2 id={`${id}-title`}>{title}</h2>
    </header>
    <div className="case-stage-body">{children}</div>
  </section>;
}

export default function CaseDocument({ project, onNavigate }) {
  const title = useRef(null);
  const root = useRef(null);
  const next = nextCaseStudy(project.id);
  const id = (section) => `case-${project.id}-${section}`;
  const phones = project.cover.type === "phone";
  const allImages = project.modules.flatMap((m) => m.images);
  const bySlug = (slug) => allImages.find((m) => m.src.includes(slug));
  const showcase = project.showcase ? project.showcase.map(bySlug).filter(Boolean) : allImages;
  useEffect(() => {
    document.title = `${project.title} · Case de Product Design · Thiago Miranda`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = project.summary;
    root.current?.closest(".case-document-scroll")?.scrollTo?.({ top: 0 });
    title.current?.focus({ preventScroll: true });
  }, [project.id, project.title, project.summary]);
  return <article ref={root} className={`case-document theme-${project.accent}`}>
    <header className="case-document-header">
      <ul className="case-tags" aria-label="Categorias do projeto">{project.categories.map((category) => <li key={category}>{category}</li>)}</ul>
      <h1 ref={title} tabIndex={-1}>{project.title}</h1>
      <p className="case-document-question">{project.question}</p>
    </header>

    <div className="case-hero-frame" aria-label={phones ? "Visão geral da interface" : undefined}>
      {phones
        ? <div className="case-visual-grid is-phones is-triptych">
            {[project.modules[0].images[0], project.modules[1].images[0], project.modules[2].images[0]].map((media) => <CaseMedia key={media.src} media={media} phone cover />)}
          </div>
        : <CaseMedia media={project.cover} cover />}
    </div>

    <section className="case-overview" aria-label="Visão geral do projeto">
      <span className="case-section-label">Overview</span>
      <dl className="case-document-facts">
        {[["Função", `${project.roleShort} · ${project.team}`], ["Ferramentas", project.tools.join(", ")], ["Ano", project.period]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <CaseLinks links={project.links} />
    </section>

    <Stage id={id("problema")} number="01" label="Problema" title={project.problem}>
      <p>{project.context}</p>
      <div className="case-research">
        <p>{project.research.intro}</p>
        <dl className="case-research-facts">{project.research.findings.map(([label, value]) => <div key={`${label}-${value}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </div>
    </Stage>

    <Stage id={id("ideacao")} number="02" label="Ideação" title="Escolhas que deram forma ao produto">
      <div className="case-decisions">{project.decisions.map((d, i) => <section key={d.title} className="case-decision">
        <span className="case-decision-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
        <div><h3>{d.title}</h3><p>{d.choice}</p><p className="case-tradeoff"><strong>A troca:</strong> {d.tradeoff}</p></div>
      </section>)}</div>
    </Stage>

    <Stage id={id("projetacao")} number="03" label="Projetação" title="Da hipótese à experiência">
      <p>{project.solution}</p>
      <CaseJourney journeys={project.journeys} />
    </Stage>

    <Stage id={id("solucao")} number="04" label="Solução" title="O produto, tela por tela">
      <ModularGrid figures={showcase} phone={phones} label="Telas do produto" />
      <CaseVideo video={project.video} />
      <div className="case-modules">
        {project.modules.map((module, index) => <section className="case-module" key={module.title}>
          <span className="case-module-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h3>{module.title}</h3><p>{module.text}</p>
        </section>)}
      </div>
      {project.landing && <div className="case-landing">
        <h3>Landing page</h3>
        <p>A landing page apresenta a proposta do produto e o universo visual que construí para ele. É o primeiro contato antes de explorar o aplicativo.</p>
        {project.landing.images.map((media) => <figure className="case-browser" key={media.src}>
          <div className="case-browser-bar"><span>{project.landing.address}</span></div>
          <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" />
          <figcaption>{media.caption}</figcaption>
        </figure>)}
      </div>}
    </Stage>

    <Stage id={id("aprendizado")} number="05" label="Aprendizado" title="O que levo para o próximo projeto">
      <p>{project.learning}</p>
      <div className="case-state">
        <h3>Estado do projeto</h3>
        <p>{project.outcome}</p>
        <dl>{project.kpis.map(([label, definition]) => <div key={label}><dt>{label}</dt><dd>{definition}</dd><span>A medir</span></div>)}</dl>
      </div>
    </Stage>

    <footer className="case-document-footer">
      <CaseLinks links={project.links} />
      <div className="case-document-pagination">
        <a className="xp-button" href="/#cases" onClick={(e) => projectLinkAction(e, onNavigate, "/#cases")}>Meus Projetos</a>
        <a className="xp-button" href={`/cases/${next.id}`} onClick={(e) => projectLinkAction(e, onNavigate, `/cases/${next.id}`)}>Próximo: {next.title}</a>
      </div>
    </footer>
  </article>;
}
