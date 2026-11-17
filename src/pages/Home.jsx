import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { CASES } from "../data/cases";
import CaseCard from "../components/CaseCard";
import HomeSections from "../components/HomeSections";
export default function Home() {
  const root = useRef(null),
    [expanded, setExpanded] = useState(false),
    [filter, setFilter] = useState("Todos");
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(
      () =>
        gsap.from(".hero-appear", {
          y: 14,
          opacity: 0,
          stagger: 0.07,
          duration: 0.5,
        }),
      root,
    );
    return () => ctx.revert();
  }, []);
  return (
    <main id="conteudo" ref={root}>
      <section className="hero section-width" id="inicio">
        <div className="hero-copy">
          <div className="availability hero-appear">
            <span className="status-dot" />
            Aberto a vagas remotas · Product Designer pleno
          </div>
          <h1 className="hero-appear">
            Oi, eu sou o<br />
            Thiago Miranda.
          </h1>
          <p className="hero-lead hero-appear">
            Eu desenho apps, SaaS e e-commerce.
            <br />
            Do Figma ao código.
          </p>
          <p className="hero-description hero-appear">
            Hoje desenho experiências de compra na Agência Disco e construo o
            ANIMAE, meu app de comunidade para quem acompanha anime, do Figma ao
            código, com apoio de IA.
          </p>
          <p className="hero-description hero-appear">
            Gosto de UI com craft, design system e de decisões que se explicam.
            Fora das telas: filmes, cinema, anime e leitura.
          </p>
          <div className="hero-buttons hero-appear">
            <a className="btn btn-dark" href="#cases">
              Ver cases
            </a>
            <a className="btn btn-outline" href="#contato">
              Contato
            </a>
            <span className="cv-unavailable">CV em breve</span>
          </div>
        </div>
        <aside
          className="quick-panel hero-appear"
          aria-labelledby="quick-title"
        >
          <span className="eyebrow">MODO RÁPIDO</span>
          <h2 id="quick-title">Resumo de 60 segundos</h2>
          <dl>
            {[
              ["Papel", "Product Designer pleno, remoto"],
              ["Foco", "UI craft e design system para SaaS, B2B e apps"],
              [
                "Prova",
                "Designer e mentor do squad vencedor do hackathon SouJunior, entre 30 equipes",
              ],
              ["Agora", "Agência Disco + ANIMAE"],
              ["Local", "São José do Rio Preto, SP"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>
      <section className="cases-section" id="cases">
        <div className="section-width">
          <div className="section-header">
            <div>
              <span className="eyebrow">3 CASES EM DESTAQUE</span>
              <h2>Prova de processo, não só de tela.</h2>
            </div>
          </div>
          <div className="case-grid">
            {CASES.slice(0, 3).map((c) => (
              <CaseCard key={c.id} data={c} />
            ))}
          </div>
          <div className="all-work-cta">
            <button
              className="text-button"
              aria-expanded={expanded}
              aria-controls="more-work"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Ocultar trabalhos" : "Mais trabalhos"}{" "}
              <ArrowRight size={16} />
            </button>
          </div>
          {expanded && (
            <div id="more-work" className="more-work">
              <div
                className="filters"
                role="group"
                aria-label="Filtrar trabalhos"
              >
                {["Todos", "Apps", "E-commerce"].map((f) => (
                  <button
                    key={f}
                    className={`filter ${filter === f ? "active" : ""}`}
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="compact-projects">
                {CASES.filter((c) => filter === "Todos" || c.group === filter)
                  .sort(
                    (a, b) => (b.id === "ultragrip") - (a.id === "ultragrip"),
                  )
                  .map((c) => (
                    <a
                      className="compact-project"
                      key={c.id}
                      href={`/cases/${c.id}`}
                    >
                      <span>{c.number}</span>
                      <strong>{c.title}</strong>
                      <span>{c.type}</span>
                      <ArrowRight size={16} />
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <HomeSections />
    </main>
  );
}
