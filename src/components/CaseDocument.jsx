import { Component, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import AnimaeListaDemo from "./AnimaeListaDemo.jsx";
import AnimaeHomeDemo from "./AnimaeHomeDemo.jsx";
import AnimaeFeedDemo from "./AnimaeFeedDemo.jsx";
import PrototypeModal, { prototypeEmbedUrl } from "./PrototypeModal.jsx";
import { nextCaseStudy, projectLinkAction } from "../data/caseStudies.js";
import { useMediaQuery } from "../lib/useEhMobile.js";
import { applySeo, pageFor } from "../data/seo.js";

// Botões do topo: protótipo e case completo. Mesmo .xp-button (azul com ▸) em todo o case.
export function CaseLinks({ links, projectTitle = "projeto", prototypePending = false, screens = [] }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const embed = links.prototype ? prototypeEmbedUrl(links.prototype) : null;
  const canOpen = Boolean(links.prototype) && (Boolean(embed) || screens.length > 0);
  // Aquece o protótipo em segundo plano: quando a pessoa clica, o Figma já tem o arquivo em cache.
  useEffect(() => {
    if (!embed) return undefined;
    const host = document.createElement("div");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:fixed;left:-9999px;top:0;width:430px;height:932px;overflow:hidden;pointer-events:none;opacity:0";
    const warm = () => {
      const frame = document.createElement("iframe");
      frame.src = embed;
      frame.tabIndex = -1;
      frame.title = "";
      host.appendChild(frame);
      document.body.appendChild(host);
    };
    const idle = window.requestIdleCallback ? window.requestIdleCallback(warm, { timeout: 4000 }) : window.setTimeout(warm, 2500);
    return () => {
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(idle); else window.clearTimeout(idle);
      host.remove();
    };
  }, [embed]);
  const actions = [
    ["web", links.webLabel || "Explorar versão web"],
    ["prototype", links.prototypeLabel || "Ver protótipo"],
    ["design", "Ver no Figma"],
    ["behance", links.behanceLabel || "Ver no Behance"],
    ...(links.siteInTop ? [["site", links.siteLabel || "Visitar site"]] : []),
  ].filter(([key]) => links[key]);
  const openPrototype = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(true);
  };
  return <div className="case-document-actions">
    {actions.map(([key, label]) => <a key={key} className="xp-button" href={links[key]} target="_blank" rel="noopener noreferrer" onClick={key === "prototype" && canOpen ? openPrototype : undefined} aria-haspopup={key === "prototype" && canOpen ? "dialog" : undefined}>{label}<span className="sr-only"> (abre em nova aba)</span></a>)}
    {prototypePending && !links.prototype && <span className="xp-button is-disabled" aria-disabled="true" role="link">Ver protótipo<span className="sr-only"> (link em breve)</span></span>}
    {!actions.length && !prototypePending && <span className="case-links-pending">Links públicos em curadoria.</span>}
    {open && canOpen && <PrototypeModal title={projectTitle} url={links.prototype} embedUrl={embed} screens={screens} onClose={close} />}
  </div>;
}

export function CaseJourney({ journeys }) {
  return <div className="case-journeys">{journeys.map((j) => <div key={j.label} className="case-journey">
    <h3>{j.label}</h3>
    <ol>{j.steps.map((s, i) => <li key={s}><span className="case-journey-step" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span>{s}</span></li>)}</ol>
  </div>)}</div>;
}

// Só a tela, sem legenda. O alt descreve a imagem; clicar amplia em nova aba.
// Se a demonstração em código falhar, a captura da tela continua visível por baixo (nunca fica um celular vazio).
class DemoSegura extends Component {
  state = { falhou: false };
  static getDerivedStateFromError() { return { falhou: true }; }
  render() { return this.state.falhou ? null : this.props.children; }
}

const DEMOS = { lista: AnimaeListaDemo, home: AnimaeHomeDemo, feed: AnimaeFeedDemo };

export function Shot({ media, phone }) {
  const mobile = useMediaQuery("(max-width:760px), (max-width:1024px) and (pointer:coarse)");
  const Demo = mobile ? null : DEMOS[media.demo];
  if (Demo) return <figure className="case-media is-phone">
    <div className="case-device"><span className="case-device-screen">
      <img className="case-demo-poster" src={media.src} alt="" width={media.width} height={media.height} decoding="async" aria-hidden="true" />
      <DemoSegura><Demo /></DemoSegura>
    </span></div>
  </figure>;
  return <figure className={`case-media ${phone ? "is-phone" : "is-wide"}`}>
    <a className={phone ? "case-device" : "case-shot"} href={media.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar: ${media.alt}`}>
      <span className={phone ? "case-device-screen" : "case-image"}><img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" /></span>
    </a>
  </figure>;
}

// Containers de imagem: wide (1), pair (2), trio (3) e mosaic (1 grande + linhas de até 3).
export function Frame({ layout, items, phone, label }) {
  if (!items.length) return null;
  if (layout === "mosaic") {
    const [lead, ...rest] = items;
    const rows = [];
    for (let i = 0; i < rest.length; i += 3) rows.push(rest.slice(i, i + 3));
    return <div className="case-frame is-mosaic" role="group" aria-label={label}>
      <div className="case-frame-lead"><Shot media={lead} phone={phone} /></div>
      {rows.map((row, i) => <div key={i} className="case-frame-row">{row.map((m) => <Shot key={m.src} media={m} phone={phone} />)}</div>)}
    </div>;
  }
  const shot = layout === "story" ? "264px" : undefined;
  const stagger = layout === "story" && items.length === 2 ? " is-stagger" : "";
  return <div className={`case-frame is-${layout}${stagger}`} style={shot ? { "--shot": shot } : undefined} role="group" aria-label={label}>
    {items.map((m) => <Shot key={m.src} media={m} phone={phone} />)}
  </div>;
}

// Um módulo do produto: texto de um lado, tela(s) do outro. Alterna o lado para guiar o olhar.
function Story({ index, module, phone }) {
  return <article className={`case-story ${index % 2 ? "is-reverse" : ""}`}>
    <div className="case-story-text">
      <span className="case-story-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <h3>{module.title}</h3>
      <p>{module.text}</p>
    </div>
    <Frame layout="story" items={module.images} phone={phone} label={module.title} />
  </article>;
}

// Fluxo de telas em fileiras (ex.: onboarding e cadastro), todas do mesmo tamanho.
function FlowStory({ index, module }) {
  return <article className="case-flow">
    <div className="case-flow-text">
      <span className="case-story-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <h3>{module.title}</h3>
      <p>{module.text}</p>
    </div>
    {module.flow.map((row) => <section key={row.label} className="case-flow-group" aria-label={row.label}>
      <h4>{row.label}</h4>
      <ol className="case-flow-row" style={{ "--passos": row.items.length }}>
        {row.items.map((m) => <li key={m.src}>
          <a className="case-flow-shot" href={m.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar: ${m.alt}`}>
            <img src={m.src} alt={m.alt} width={m.width} height={m.height} loading="lazy" decoding="async" />
          </a>
        </li>)}
      </ol>
    </section>)}
  </article>;
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


function Rich({ text }) {
  return text.split("**").map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case "h3": return <h3 key={i}>{b.text}</h3>;
      case "p": return <p key={i}><Rich text={b.text} /></p>;
      case "ul": return <ul key={i} className="case-copy-list">{b.items.map((t) => <li key={t}>{t}</li>)}</ul>;
      case "trio": return <div key={i}>
        <Frame layout="trio" items={b.images} phone label={b.label} />
        <p className="case-frame-dica" aria-hidden="true">Toque em uma tela para ampliar</p>
      </div>;
      case "journey": return <div key={i} className="case-journeys"><div className="case-journey"><ol>{b.items.map((t, n) => <li key={t}><span className="case-journey-step" aria-hidden="true">{String(n + 1).padStart(2, "0")}</span><span>{t}</span></li>)}</ol></div></div>;
      case "ol": return <ol key={i} className="case-copy-list is-ordered">{b.items.map((t) => <li key={t}>{t}</li>)}</ol>;
      case "facts": return <dl key={i} className="case-research-facts">{b.items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
      case "kpis": return <ul key={i} className="case-kpis" aria-label="Métricas propostas, ainda sem resultados publicados">{b.items.map(([k, v]) => <li key={k}><span className="case-kpi-status">A medir</span><strong>{k}</strong><span>{v}</span></li>)}</ul>;
      default: return null;
    }
  });
}

function EditorialSection({ index, section }) {
  const decisions = section.blocks.filter((b) => b.type === "decision");
  const items = section.blocks.filter((b) => b.type === "item" || b.type === "flow");
  const rest = section.blocks.filter((b) => !["decision", "item", "flow"].includes(b.type));
  let solutionIndex = 0;
  return <section className="case-stage" id={`case-animae-${section.id}`} aria-labelledby={`case-animae-${section.id}-title`}>
    <header className="case-stage-head">
      <p className="case-stage-kicker"><span className="case-stage-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></p>
      <h2 id={`case-animae-${section.id}-title`}>{section.title}</h2>
    </header>
    <div className="case-stage-body">
      <Blocks blocks={rest} />
      {decisions.length > 0 && <div className="case-decisions">{decisions.map((d) => <section key={d.n} className={`case-decision${d.images ? " has-shot" : ""}`}>
        <span className="case-decision-number" aria-hidden="true">{d.n}</span>
        <div><h3>{d.h3}</h3><Blocks blocks={d.blocks} /></div>
        {d.images && <Frame layout="story" items={d.images} phone label={d.h3} />}
      </section>)}</div>}
      {items.length > 0 && <div className="case-stories">{items.map((it) => it.type === "flow"
        ? <article key={it.h3} className="case-flow-edit">
            <div className="case-flow-text"><h3>{it.h3}</h3><Blocks blocks={it.blocks} /></div>
            <section className="case-flow-frame" aria-label={it.label}>
              <ol className="case-flow-row" style={{ "--passos": it.images.length }}>
                {it.images.map((m) => <li key={m.src}><a className="case-flow-shot" href={m.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar: ${m.alt}`}><img src={m.src} alt={m.alt} width={m.width} height={m.height} loading="lazy" decoding="async" /></a></li>)}
              </ol>
            </section>
          </article>
        : <article key={it.h3} className={`case-story ${solutionIndex++ % 2 ? "is-reverse" : ""}`}>
            <div className="case-story-text"><h3>{it.h3}</h3><Blocks blocks={it.blocks} /></div>
            <Frame layout="story" items={it.images} phone label={it.h3} />
          </article>)}</div>}
    </div>
  </section>;
}

function EditorialCase({ project, onNavigate }) {
  const c = project.editorial;
  const title = useRef(null);
  const root = useRef(null);
  const next = nextCaseStudy(project.id);
  const tourScreens = project.modules.flatMap((m) => (m.images || []).map((img) => ({ ...img, label: m.title }))).filter((m, i, all) => all.findIndex((x) => x.src === m.src) === i);
  useEffect(() => {
    applySeo(pageFor(`/cases/${project.id}`));
    root.current?.closest(".case-document-scroll")?.scrollTo?.({ top: 0 });
    title.current?.focus({ preventScroll: true });
  }, [project.id]);
  return <article ref={root} className={`case-document theme-${project.accent}`}>
    <header className="case-document-header">
      <ul className="case-tags" aria-label="Categorias do projeto">{c.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      <h1 ref={title} tabIndex={-1}>{c.h1}</h1>
      <p className="case-document-question">{c.tagline}</p>
      <p className="case-document-intro">{c.intro}</p>
      <CaseLinks links={project.links} projectTitle={project.title} screens={tourScreens} />
    </header>

    <div className="case-draco-banner">
      <img src="/assets/cases/animae-draco-mao.webp" alt="Mão laranja do Draco, o mascote do ANIMAE, segurando um celular com a tela inicial do aplicativo" width="1200" height="1353" decoding="async" fetchPriority="high" />
    </div>

    <dl className="case-overview-card" aria-label="Visão geral do projeto">
      {c.overview.map(([label, list]) => <div key={label}><dt>{label}</dt><dd><ul className="case-chips">{list.map((r) => <li key={r}>{r}</li>)}</ul></dd></div>)}
      <div><dt>Período</dt><dd className="case-year"><span>{c.period}</span></dd></div>
    </dl>

    {c.sections.map((section, i) => <EditorialSection key={section.id} index={i} section={section} />)}

    <footer className="case-document-footer">
      <a className="xp-button xp-button--back" href="/#cases" onClick={(e) => projectLinkAction(e, onNavigate, "/#cases")}><ChevronLeft size={16} aria-hidden="true" />Meus projetos</a>
      {next && <a className="xp-button" href={`/cases/${next.id}`} onClick={(e) => projectLinkAction(e, onNavigate, `/cases/${next.id}`)}>Próximo: {next.title}</a>}
    </footer>
  </article>;
}

function LegacyCase({ project, onNavigate }) {
  const title = useRef(null);
  const root = useRef(null);
  const next = nextCaseStudy(project.id);
  const id = (section) => `case-${project.id}-${section}`;
  const phones = project.cover.type === "phone";
  const pool = [...project.modules.flatMap((m) => [...m.images, ...(m.flow || []).flatMap((r) => r.items)]), ...(project.gallery || []), project.cover];
  const find = (slug) => pool.find((m) => m.src.includes(slug));
  const stage = (key) => {
    const cfg = project.stageImages?.[key];
    return cfg ? { layout: cfg.layout, items: cfg.images.map(find).filter(Boolean) } : null;
  };
  const roles = project.roles || [project.roleShort];
  const [year, yearNote] = project.period.split(" · ");
  const heroShot = find(project.heroShot) || project.modules[0].images[0];
  const hero = phones ? [project.modules[0].images[0], project.modules[1].images[0], project.modules[2].images[0]] : [project.cover];
  const problem = stage("problema"), ideation = stage("ideacao");
  useEffect(() => {
    document.title = `${project.title} · Case de Product Design · Thiago Miranda`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = project.summary;
    root.current?.closest(".case-document-scroll")?.scrollTo?.({ top: 0 });
    title.current?.focus({ preventScroll: true });
  }, [project.id, project.title, project.summary]);
  const tourScreens = project.modules.flatMap((m) => (m.images || []).map((img) => ({ ...img, label: m.title }))).filter((m, i, all) => all.findIndex((x) => x.src === m.src) === i);
  const withImages = project.modules.filter((m) => m.images?.length || m.flow?.length);
  const textOnly = project.modules.filter((m) => !m.images?.length && !m.flow?.length);
  return <article ref={root} className={`case-document theme-${project.accent}`}>
    <header className="case-document-header">
      <ul className="case-tags" aria-label="Categorias do projeto">{project.categories.map((category) => <li key={category}>{category}</li>)}</ul>
      <h1 ref={title} tabIndex={-1}>{project.title}</h1>
      <p className="case-document-question">{project.question}</p>
      <CaseLinks links={project.links} projectTitle={project.title} prototypePending={project.prototypePending} screens={tourScreens} />
    </header>

    <div className="case-hero-shot" role="group" aria-label="Tela do aplicativo em destaque">
      {phones && project.heroTrio
        ? project.heroTrio.map((m) => <div key={m.src} className="case-hero-phone"><img src={m.src} alt={m.alt} width={m.width} height={m.height} decoding="async" /></div>)
        : phones ? <Shot media={heroShot} phone /> : <Shot media={project.cover} phone={false} />}
    </div>

    <dl className="case-overview-card" aria-label="Visão geral do projeto">
      <div><dt>Função</dt><dd><ul className="case-chips">{roles.map((r) => <li key={r}>{r}</li>)}</ul></dd></div>
      <div><dt>Ferramentas</dt><dd><ul className="case-chips">{project.tools.map((t) => <li key={t}>{t}</li>)}</ul></dd></div>
      <div><dt>Ano</dt><dd className="case-year"><span>{year}</span>{yearNote && <small>{yearNote}</small>}</dd></div>
    </dl>

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

    <Stage id={id("prototipacao")} number="03" label="Prototipação" title="Da hipótese à experiência">
      <p>{project.solution}</p>
      <CaseJourney journeys={project.journeys} />
      {textOnly.map((m) => <div key={m.title} className="case-note"><h3>{m.title}</h3><p>{m.text}</p></div>)}
    </Stage>

    <Stage id={id("solucao")} number="04" label="Solução" title="Como a solução funciona">
      <div className="case-stories">
        {withImages.map((module, index) => module.flow ? <FlowStory key={module.title} index={index} module={module} /> : <Story key={module.title} index={index} module={module} phone={phones} />)}
      </div>
      <CaseVideo video={project.video} />
    </Stage>

    <Stage id={id("aprendizado")} number="05" label="Aprendizado" title="O que levo para o próximo projeto">
      <p>{project.learning}</p>
      <p>{project.outcome}</p>
      <ul className="case-kpis" aria-label="Indicadores propostos, ainda sem resultados publicados">{project.kpis.map(([label, definition]) => <li key={label}>
        <span className="case-kpi-status">A medir</span><strong>{label}</strong><span>{definition}</span>
      </li>)}</ul>
    </Stage>

    <footer className="case-document-footer">
      <a className="xp-button xp-button--back" href="/#cases" onClick={(e) => projectLinkAction(e, onNavigate, "/#cases")}><ChevronLeft size={16} aria-hidden="true" />Meus projetos</a>
      {next && <a className="xp-button" href={`/cases/${next.id}`} onClick={(e) => projectLinkAction(e, onNavigate, `/cases/${next.id}`)}>Próximo: {next.title}</a>}
    </footer>
  </article>;
}

export default function CaseDocument({ project, onNavigate }) {
  return project.editorial ? <EditorialCase project={project} onNavigate={onNavigate} /> : <LegacyCase project={project} onNavigate={onNavigate} />;
}
