import { useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { nextCaseStudy, projectLinkAction } from "../data/caseStudies.js";

// Botões do topo: protótipo e case completo. Mesmo .xp-button (azul com ▸) em todo o case.
export function CaseLinks({ links, prototypePending = false }) {
  const actions = [
    ["prototype", "Ver protótipo"],
    ["design", "Ver no Figma"],
    ["behance", links.behanceLabel || "Ver no Behance"],
    ...(links.siteInTop ? [["site", links.siteLabel || "Visitar site"]] : []),
  ].filter(([key]) => links[key]);
  return <div className="case-document-actions">
    {actions.map(([key, label]) => <a key={key} className="xp-button" href={links[key]} target="_blank" rel="noopener noreferrer">{label}<span className="sr-only"> (abre em nova aba)</span></a>)}
    {prototypePending && !links.prototype && <span className="xp-button is-disabled" aria-disabled="true" role="link">Ver protótipo<span className="sr-only"> (link em breve)</span></span>}
    {!actions.length && !prototypePending && <span className="case-links-pending">Links públicos em curadoria.</span>}
  </div>;
}

export function CaseJourney({ journeys }) {
  return <div className="case-journeys">{journeys.map((j) => <div key={j.label} className="case-journey">
    <h3>{j.label}</h3>
    <ol>{j.steps.map((s, i) => <li key={s}><span className="case-journey-step" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span>{s}</span></li>)}</ol>
  </div>)}</div>;
}

// Só a tela, sem legenda. O alt descreve a imagem; clicar amplia em nova aba.
function Shot({ media, phone }) {
  return <figure className={`case-media ${phone ? "is-phone" : "is-wide"}`}>
    <a className={phone ? "case-device" : "case-shot"} href={media.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar imagem: ${media.alt} (abre em nova aba)`}>
      <span className={phone ? "case-device-screen" : "case-image"}><img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" /></span>
    </a>
  </figure>;
}

// Containers de imagem: wide (1), pair (2), trio (3) e mosaic (1 grande + linhas de até 3).
function Frame({ layout, items, phone, label }) {
  if (!items.length) return null;
  if (layout === "mosaic") {
    const [lead, ...rest] = items;
    const rows = [];
    for (let i = 0; i < rest.length; i += 3) rows.push(rest.slice(i, i + 3));
    return <div className="case-frame is-mosaic" role="group" aria-label={label}>
      <div className="case-frame-lead"><Shot media={lead} phone={phone} /></div>
      {rows.map((row, i) => <div key={i} className="case-frame-row" style={{ "--colunas": row.length }}>{row.map((m) => <Shot key={m.src} media={m} phone={phone} />)}</div>)}
    </div>;
  }
  return <div className={`case-frame is-${layout}`} style={{ "--colunas": items.length }} role="group" aria-label={label}>
    {items.map((m) => <Shot key={m.src} media={m} phone={phone} />)}
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
      <p className="case-stage-kicker"><span className="case-stage-number" aria-hidden="true">{number}</span><span className="case-section-label">{label}</span></p>
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
  const pool = [...project.modules.flatMap((m) => m.images), ...(project.gallery || []), project.cover];
  const find = (slug) => pool.find((m) => m.src.includes(slug));
  const stage = (key) => {
    const cfg = project.stageImages?.[key];
    return cfg ? { layout: cfg.layout, items: cfg.images.map(find).filter(Boolean) } : null;
  };
  const roles = project.roles || [project.roleShort];
  const [year, yearNote] = project.period.split(" · ");
  const heroShot = find(project.heroShot) || project.modules[0].images[0];
  const hero = phones ? [project.modules[0].images[0], project.modules[1].images[0], project.modules[2].images[0]] : [project.cover];
  const problem = stage("problema"), ideation = stage("ideacao"), solution = stage("solucao");
  const fallback = project.modules.flatMap((m) => m.images);
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

    <div className="case-hero-shot" role="group" aria-label="Tela do aplicativo em destaque">
      {phones ? <Shot media={heroShot} phone /> : <Shot media={project.cover} phone={false} />}
    </div>

    <section className="case-overview" aria-label="Visão geral do projeto">
      <dl className="case-overview-card">
        <div><dt>Função</dt><dd><ul className="case-chips">{roles.map((r) => <li key={r}>{r}</li>)}</ul></dd></div>
        <div><dt>Ferramentas</dt><dd><ul className="case-chips">{project.tools.map((t) => <li key={t}>{t}</li>)}</ul></dd></div>
        <div><dt>Ano</dt><dd className="case-year"><span>{year}</span>{yearNote && <small>{yearNote}</small>}</dd></div>
      </dl>
      <CaseLinks links={project.links} prototypePending={project.prototypePending} />
    </section>

    <section className="case-hero" aria-label="O produto em telas">
      <span className="case-section-label">O produto</span>
      <h2>{project.cover.title}</h2>
      <p>{project.cover.text}</p>
      <Frame layout={phones ? "trio" : "wide"} items={hero} phone={phones} label="Visão geral da interface" />
    </section>

    <Stage id={id("problema")} number="01" label="Problema" title={project.problem}>
      <p>{project.context}</p>
      <p>{project.research.intro}</p>
      <dl className="case-research-facts">{project.research.findings.map(([label, value]) => <div key={`${label}-${value}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {problem && <Frame layout={problem.layout} items={problem.items} phone={false} label="Versão inicial do produto" />}
    </Stage>

    <Stage id={id("ideacao")} number="02" label="Ideação" title="Escolhas que deram forma ao produto">
      <div className="case-decisions">{project.decisions.map((d, i) => <section key={d.title} className="case-decision">
        <span className="case-decision-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
        <div><h3>{d.title}</h3><p>{d.choice}</p><p className="case-tradeoff"><strong>A troca:</strong> {d.tradeoff}</p></div>
      </section>)}</div>
      {ideation && <Frame layout={ideation.layout} items={ideation.items} phone={phones} label="Telas das escolhas de produto" />}
    </Stage>

    <Stage id={id("projetacao")} number="03" label="Projetação" title="Da hipótese à experiência">
      <p>{project.solution}</p>
      <CaseJourney journeys={project.journeys} />
    </Stage>

    <Stage id={id("solucao")} number="04" label="Solução" title="O produto, tela por tela">
      <Frame layout={solution?.layout || "mosaic"} items={solution?.items || fallback} phone={phones} label="Telas do produto" />
      <CaseVideo video={project.video} />
      <div className="case-modules">
        {project.modules.map((module, index) => <section className="case-module" key={module.title}>
          <span className="case-module-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h3>{module.title}</h3><p>{module.text}</p>
        </section>)}
      </div>
    </Stage>

    <Stage id={id("aprendizado")} number="05" label="Aprendizado" title="O que levo para o próximo projeto">
      <p>{project.learning}</p>
      <div className="case-state">
        <p className="case-state-lead">{project.outcome}</p>
        <ul className="case-kpis" aria-label="Indicadores propostos, ainda sem resultados publicados">{project.kpis.map(([label, definition]) => <li key={label}>
          <span className="case-kpi-status">A medir</span><strong>{label}</strong><span>{definition}</span>
        </li>)}</ul>
      </div>
    </Stage>

    {project.landing && <section className="case-landing" aria-labelledby={id("lp-title")}>
      <header className="case-stage-head">
        <p className="case-stage-kicker"><span className="case-section-label">Landing page</span></p>
        <h2 id={id("lp-title")}>A porta de entrada para o produto</h2>
      </header>
      <p>Role a página inteira abaixo: é a landing page que apresenta a proposta e convida para a versão Android. {project.landing.note}</p>
      {project.links.site && <div className="case-document-actions"><a className="xp-button" href={project.links.site} target="_blank" rel="noopener noreferrer">Ver landing page<span className="sr-only"> (abre em nova aba)</span></a></div>}
      <figure className="case-browser">
        <div className="case-browser-bar"><span>{project.landing.address}</span></div>
        <div className="case-browser-scroll" tabIndex={0} role="region" aria-label="Landing page completa, role para ver tudo">
          <img src={project.landing.image.src} alt={project.landing.image.alt} width={project.landing.image.width} height={project.landing.image.height} loading="lazy" decoding="async" />
        </div>
      </figure>
    </section>}

    <footer className="case-document-footer">
      <a className="xp-button xp-button--back" href="/#cases" onClick={(e) => projectLinkAction(e, onNavigate, "/#cases")}><ChevronLeft size={16} aria-hidden="true" />Meus projetos</a>
      <a className="xp-button" href={`/cases/${next.id}`} onClick={(e) => projectLinkAction(e, onNavigate, `/cases/${next.id}`)}>Próximo: {next.title}</a>
    </footer>
  </article>;
}
