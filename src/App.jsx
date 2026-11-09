import { useEffect, useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import XPDesktop from "./pages/XPDesktop";
import CasePage from "./pages/CasePage";
import XPWelcome from "./pages/XPWelcome";
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
function initialWelcome() {
  if (location.pathname !== "/" || location.hash) return false;
  if (new URLSearchParams(location.search).get("entrada") === "1") return true;
  try {
    return sessionStorage.getItem("miranda-entered") !== "true";
  } catch {
    return true;
  }
}
export default function App() {
  const [mode, setMode] = useState(initialMode);
  const [showWelcome, setShowWelcome] = useState(initialWelcome);
  const path = location.pathname.replace(/\/$/, "") || "/";
  const project = CASES.find((c) => path === `/cases/${c.id}`);
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.dataset.screen = showWelcome
      ? "welcome"
      : "portfolio";
    document.querySelector('meta[name="theme-color"]').content = showWelcome
      ? "#002697"
      : mode === "xp"
        ? "#002697"
        : mode === "noite"
          ? "#191817"
          : "#f5f0ea";
    try {
      localStorage.setItem("miranda-mode", mode);
    } catch {}
  }, [mode, showWelcome]);

  function enterPortfolio() {
    try {
      sessionStorage.setItem("miranda-entered", "true");
    } catch {}
    setMode("xp");
    setShowWelcome(false);
    requestAnimationFrame(() => {
      const main = document.getElementById("conteudo");
      main?.setAttribute("tabindex", "-1");
      main?.focus({ preventScroll: true });
    });
  }

  function showEntry() {
    if (path !== "/") {
      location.assign("/?entrada=1");
      return;
    }
    setShowWelcome(true);
    window.scrollTo({ top: 0 });
  }

  if (showWelcome) return <XPWelcome onEnter={enterPortfolio} />;
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="site-shell">
        <Header mode={mode} setMode={setMode} onShowWelcome={showEntry} />
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
