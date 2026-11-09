import { useEffect, useRef } from "react";
import { CASES } from "../data/cases";
export default function CasePage({ project }) {
  const title = useRef(null);
  useEffect(() => {
    document.title = `${project.title} · Thiago Miranda`;
    document.querySelector('meta[name="description"]').content =
      project.summary;
    title.current?.focus();
  }, [project]);
  const next = CASES[(CASES.indexOf(project) + 1) % CASES.length];
  return (
    <main className="case-page section-width" id="conteudo">
      <a className="back-button" href="/#cases">
        ← Voltar aos cases
      </a>
      <span className="eyebrow">{project.type}</span>
      <h1 ref={title} tabIndex={-1}>
        {project.title}
      </h1>
      <p className="case-page-lead">{project.summary}</p>
      <dl className="case-facts">
        <div>
          <dt>Meu papel</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{project.status}</dd>
        </div>
      </dl>
      <nav className="case-index" aria-label="Índice do case">
        <a href="#desafio">Contexto e desafio</a>
        <a href="#decisoes">Decisões</a>
        <a href="#aprendizado">Aprendizados</a>
      </nav>
      <article>
        <section id="desafio">
          <h2>O desafio</h2>
          <p>{project.problem}</p>
        </section>
        <section id="decisoes">
          <h2>Decisões de design</h2>
          <ol>
            {project.decisions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
        </section>
        <section id="aprendizado">
          <h2>O que aprendi</h2>
          <p>{project.learning}</p>
        </section>
        <p className="case-disclaimer">
          Versão editorial inicial. Imagens, evidências e resultados verificados
          estão em curadoria. Os detalhes do processo serão refinados com a
          documentação de cada projeto.
        </p>
      </article>
      <a className="btn btn-outline" href={`/cases/${next.id}`}>
        Próximo trabalho: {next.title} →
      </a>
    </main>
  );
}
