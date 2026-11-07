import { useEffect, useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import XPDesktop from "./pages/XPDesktop";
import CasePage from "./pages/CasePage";
import { CASES } from "./data/cases";
const modes = ["rapido", "noite", "xp"];
function initialMode() {
  try {
    const saved = localStorage.getItem("miranda-mode");
    return modes.includes(saved) ? saved : "xp";
  } catch {
    return "xp";
  }
}
export default function App() {
  const [mode, setMode] = useState(initialMode);
  const path = location.pathname.replace(/\/$/, "") || "/";
  const project = CASES.find((c) => path === `/cases/${c.id}`);
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.querySelector('meta[name="theme-color"]').content =
      mode === "xp" ? "#245edb" : mode === "noite" ? "#191817" : "#f5f0ea";
    try {
      localStorage.setItem("miranda-mode", mode);
    } catch {}
  }, [mode]);
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="site-shell">
        <Header mode={mode} setMode={setMode} />
        {project ? (
          <CasePage project={project} />
        ) : path === "/" ? (
          mode === "xp" ? (
            <XPDesktop />
          ) : (
            <Home />
          )
        ) : (
          <main className="case-page section-width" id="conteudo">
            <h1>Página não encontrada</h1>
            <a className="btn btn-outline" href="/">
              Voltar ao portfólio
            </a>
          </main>
        )}
        {mode !== "xp" && (
          <footer className="footer section-width">
            <span>© 2026 Thiago Miranda</span>
            <span>Feito no Figma e no código, com apoio de IA.</span>
            <a href="#conteudo">Voltar ao topo ↑</a>
          </footer>
        )}
      </div>
    </>
  );
}
