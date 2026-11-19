import CaseDocument from "../components/CaseDocument.jsx";
import { getCaseStudy } from "../data/caseStudies.js";

export default function CasePage({ project }) {
  const study = getCaseStudy(project.id);
  return <main id="conteudo" className="editorial-case-shell">
    <a className="back-button" href="/#cases">← Voltar aos projetos</a>
    {study ? <CaseDocument project={study} /> : <section className="case-unavailable">
      <h1>{project.title}</h1><p>Este case está em construção.</p><a className="xp-button" href="/#cases">Ver os projetos</a>
    </section>}
  </main>;
}
