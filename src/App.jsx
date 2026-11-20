import { useEffect, useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import XPDesktop from "./pages/XPDesktop";
import { useAtalhoTelaCheia } from "./hooks/useTelaCheia";
import CasePage from "./pages/CasePage";
import XPWelcome from "./pages/XPWelcome";
import XPGreeting from "./pages/XPGreeting";
import useXPLogin from "./hooks/useXPLogin";
import { CASES } from "./data/cases";
import { getCaseStudy } from "./data/caseStudies.js";
import { applySeo, pageFor } from "./data/seo.js";
import { irParaEntrada, rota } from "./lib/rota.js";
function initialMode() {
  return "xp";
}
function initialWelcome() {
  if (rota() !== "/" || location.hash) return false;
  if (new URLSearchParams(location.search).get("entrada") === "1") return true;
  try {
    return sessionStorage.getItem("miranda-entered") !== "true";
  } catch {
    return true;
  }
}
export default function App() {
  useAtalhoTelaCheia();
  const [mode, setMode] = useState(initialMode);
  const login = useXPLogin(initialWelcome);
  const showWelcome = login.phase !== "portfolio";
  const [path, setPath] = useState(rota);
  useEffect(() => {
    const sync = () => setPath(rota());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  function navigate(href) {
    if (location.pathname + location.hash !== href) history.pushState(null, "", href);
    setPath(rota());
  }
  const project = CASES.find((c) => path === `/cases/${c.id}`);
  const study = getCaseStudy(project?.id);
  const xpHome = mode === "xp" && (path === "/" || Boolean(study));
  useEffect(() => {
    if (path === "/") {
      applySeo(pageFor("/"));
    }
  }, [path]);
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.dataset.layout = xpHome && !showWelcome ? "desktop" : "document";
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
  }, [mode, showWelcome, xpHome]);

  function enterPortfolio() {
    setMode("xp");
    login.start();
  }

  function showEntry() {
    if (path !== "/") {
      irParaEntrada();
      return;
    }
    login.reset();
    window.scrollTo({ top: 0 });
  }

  if (login.phase === "welcome")
    return <XPGreeting />;
  if (login.phase === "profile")
    return (
      <XPWelcome onEnter={enterPortfolio} />
    );
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className={`site-shell ${xpHome ? "is-xp-desktop" : ""}`}>
        {!xpHome && (
          <Header mode={mode} setMode={setMode} onShowWelcome={showEntry} />
        )}
        {xpHome ? (
          <XPDesktop setMode={setMode} onShowWelcome={showEntry} project={study} onNavigate={navigate} />
        ) : project ? (
          <CasePage project={project} />
        ) : path === "/" ? (
          <Home />
        ) : (
          <main className="case-page section-width" id="conteudo">
            <h1>Página não encontrada</h1>
            <a className="btn btn-outline" href="/">Voltar ao portfólio</a>
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
