import { useEffect, useRef, useState } from "react";
import DesktopAlerts from "../components/DesktopAlerts";
import BarraDeTarefas from "../components/BarraDeTarefas";
import MenuIniciar from "../components/MenuIniciar";
import AvisoTelaCheia from "../components/AvisoTelaCheia";
import JanelaXP from "../components/JanelaXP";
import PainelSobre from "../components/PainelSobre";
import JanelaCurriculo, { CURRICULOS } from "../components/JanelaCurriculo";
import { MsnAviso, MsnContatos, MsnConversa } from "../components/Msn";
import JanelaEmail from "../components/JanelaEmail";
import ProjectsExplorer, { ProjectsToolbar } from "../components/ProjectsExplorer.jsx";
import CaseDocument from "../components/CaseDocument.jsx";
const APPS = [
  {
    id: "sobre",
    name: "Sobre mim",
    title: "Sobre Mim - Miranda",
    icon: "profile",
  },
  {
    id: "cases",
    name: "Meus Projetos",
    title: "Meus Projetos",
    icon: "folder",
  },
  { id: "contato", name: "Entre em contato", title: "Entre em contato comigo", icon: "mail" },
  { id: "curriculo", name: "Meu currículo", title: "Meu currículo", icon: "document" },
  { id: "msn", name: "Messenger", title: "Messenger", icon: "mail" },
  { id: "msnchat", name: "Thiago Bot", title: "Conversa com Thiago Bot", icon: "mail" },
  { id: "case", name: "Case", title: "Case", icon: "document" },
];
const APPS_JANELAS = [
  { ...APPS.find(a => a.id === "sobre"), janelaIcone: "/assets/xp/painel/painel-icone.png", largura: 1000, altura: 704, cascata: 0 },
  { ...APPS.find(a => a.id === "cases"), janelaIcone: "/assets/xp/area/projetos.png", largura: 960, altura: 600, cascata: 1 },
  { ...APPS.find(a => a.id === "contato"), janelaIcone: "/assets/xp/area/contato.png", largura: 560, altura: 464, cascata: 2, minLargura: 400, semStatus: true },
  { ...APPS.find(a => a.id === "curriculo"), janelaIcone: "/assets/xp/area/curriculo.png", largura: 600, altura: 768, cascata: 1 },
  { ...APPS.find(a => a.id === "msn"), janelaIcone: "/assets/xp/msn/logo-32.png", largura: 336, altura: 728, alinhar: "direita", topo: 16, minLargura: 288, minAltura: 400, semStatus: true },
  { ...APPS.find(a => a.id === "msnchat"), janelaIcone: "/assets/xp/msn/logo-32.png", largura: 640, altura: 608, alinhar: "esquerda", topo: 16, minLargura: 400, minAltura: 400, semStatus: true },
  { ...APPS.find(a => a.id === "case"), janelaIcone: "/assets/xp/figma/pasta.png", largura: 1120, altura: 800, cascata: 0, minLargura: 480 },
];
export default function XPDesktop({ setMode, onShowWelcome, project, onNavigate }) {
  const [windows, setWindows] = useState({ cases: "open" }),
    [active, setActive] = useState("cases"),
    [start, setStart] = useState(false);
  const previousProject = useRef(null);
  const apps = APPS.map((a) => a.id === "case" && project ? { ...a, name: project.title, title: `${project.title} — Case` } : a);
  const appWindows = APPS_JANELAS.map((a) => a.id === "case" && project ? { ...a, name: project.title, title: `${project.title} — Case` } : a);
  useEffect(() => {
    if (project) {
      setWindows((w) => ({ ...w, case: "open" }));
      setActive("case");
      previousProject.current = project.id;
    } else if (previousProject.current) {
      const lastProject = previousProject.current;
      setWindows((w) => ({ ...w, case: "closed", cases: "open" }));
      setActive("cases");
      previousProject.current = null;
      requestAnimationFrame(() => (document.querySelector(`[aria-labelledby="cases-title"] .project-folder[href="/cases/${lastProject}"]`) || document.getElementById("cases-title"))?.focus({ preventScroll: true }));
    }
  }, [project?.id]);
  const menuRef = useRef(null),
    startRef = useRef(null),
    infoRef = useRef(null);
  const [reabrir, setReabrir] = useState(0);
  const [linguaCv, setLinguaCv] = useState("pt");
  const [avisoMsn, setAvisoMsn] = useState(false);
  const [tremer, setTremer] = useState(0);
  const open = (id, focus = true) => {
    setWindows((w) => ({ ...w, [id]: "open" }));
    setActive(id);
    setStart(false);
    if (focus)
      requestAnimationFrame(() =>
        document.getElementById(`${id}-title`)?.focus({ preventScroll: true }),
      );
  };
  const hide = (id, state) => {
    setWindows((w) => ({ ...w, [id]: state }));
    requestAnimationFrame(() => {
      const target =
        state === "closed"
          ? document.getElementById(`shortcut-${id}`)
          : document.getElementById(`task-${id}`);
      target?.focus({ preventScroll: true });
    });
  };
  useEffect(() => {
    const sync = () => {
      const id = location.hash.slice(1);
      if (APPS.some((a) => a.id === id)) open(id);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (!start) return;
    menuRef.current?.querySelector("button")?.focus({ preventScroll: true });
    const close = (e) => {
      if (e.type === "keydown" && e.key === "Escape") {
        setStart(false);
        startRef.current?.focus({ preventScroll: true });
      } else if (
        e.type === "pointerdown" &&
        !menuRef.current?.contains(e.target) &&
        !startRef.current?.contains(e.target)
      )
        setStart(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, [start]);
  return (
    <main id="conteudo" className="xp-desktop">
      <h1 className="sr-only">
        Thiago Miranda · Product Designer pleno · Portfólio
      </h1>
      <nav className="desktop-shortcuts" aria-label="Atalhos do portfólio">
        {[
          { id: "sobre", nome: "Sobre mim", img: "sobre", src: "/assets/xp/area/sobre.png" },
          { id: "curriculo", nome: "Meu currículo", img: "curriculo", src: "/assets/xp/area/curriculo.png" },
          { id: "cases", nome: "Projetos", img: "projetos", src: "/assets/xp/area/projetos.png" },
          { id: "contato", nome: "Entre em contato", img: "contato", src: "/assets/xp/area/contato.png" },
        ].map((a) => (
          <button
            key={a.id}
            id={`shortcut-${a.id}`}
            className="desktop-shortcut"
            onClick={() => open(a.id)}
          >
            <img
              src={a.src}
              alt=""
              width="64"
              height="64"
              draggable="false"
            />
            <span>{a.nome}</span>
          </button>
        ))}
      </nav>
      <div className="desktop-workspace">
        {appWindows.map((app) =>
          windows[app.id] === "open" || windows[app.id] === "minimized" ? (
            <JanelaXP
              key={app.id}
              id={app.id}
              titulo={app.title}
              icone={app.janelaIcone}
              ativa={active === app.id}
              oculta={windows[app.id] === "minimized"}
              largura={app.largura}
              altura={app.altura}
              cascata={app.cascata}
              alinhar={app.alinhar}
              topo={app.topo}
              minLargura={app.minLargura}
              minAltura={app.minAltura}
              semStatus={app.semStatus}
              classe={app.id === "msnchat" && tremer % 2 === 1 ? "is-tremendo" : ""}
              onFocar={() => setActive(app.id)}
              onFechar={() => app.id === "case" ? onNavigate("/#cases") : hide(app.id, "closed")}
              onMinimizar={() => hide(app.id, "minimized")}
              statusEsquerda={
                app.id === "curriculo"
                  ? "Clique para ampliar e arraste para visualizar outras áreas."
                  : app.id === "cases" ? ""
                    : app.id === "case" ? "Case de Product Design · Thiago Miranda" : undefined
              }
              statusDireita={
                app.id === "curriculo" ? (
                  <span className="cv-linguas" role="group" aria-label="Idioma do currículo">
                    {Object.entries(CURRICULOS).map(([k, c]) => (
                      <button key={k} type="button" aria-pressed={linguaCv === k} onClick={() => setLinguaCv(k)}>
                        {c.rotulo}
                      </button>
                    ))}
                  </span>
                ) : (
                <span className="janela-xp-status-dir">
                  <img src={app.janelaIcone} alt="" width="16" height="16" />
                  {app.name}
                </span>
                )
              }
            >
              {app.id === "msn" && <MsnContatos aoConversar={() => open("msnchat")} />}
              {app.id === "msnchat" && (
                <MsnConversa
                  ativa={active === "msnchat"}
                  aoFechar={() => hide("msnchat", "closed")}
                  aoAbrir={open}
                  aoChamar={() => {
                    setTremer((n) => n + 1);
                    setTimeout(() => setTremer((n) => n + 1), 520);
                  }}
                />
              )}
              {app.id === "curriculo" && (
                <JanelaCurriculo lingua={linguaCv} aoContato={() => open("contato")} />
              )}
              {app.id === "sobre" && <PainelSobre aoAbrir={open} onNavigate={onNavigate} />}
              {app.id === "cases" && <ProjectsExplorer onNavigate={onNavigate} />}
              {app.id === "case" && project && <>
                <ProjectsToolbar title={project.title} onBack={() => onNavigate("/#cases")} />
                <div className="case-document-scroll"><CaseDocument project={project} onNavigate={onNavigate} /></div>
              </>}
              {app.id === "contato" && <JanelaEmail />}
            </JanelaXP>
          ) : null,
        )}
      </div>
      <AvisoTelaCheia />
      <div className="ruido-tv" aria-hidden="true">
        <span className="ruido-tv-grao" />
        <span className="ruido-tv-faixa" />
      </div>
      <BarraDeTarefas
        apps={apps}
        janelas={windows}
        ativo={active}
        menuAberto={start}
        iniciarRef={startRef}
        infoRef={infoRef}
        aoClicarInfo={() => setReabrir((n) => n + 1)}
        aoAlternarMenu={() => setStart(!start)}
        aoClicarMsn={() => open("msn")}
        aoClicarTarefa={(a) =>
          windows[a.id] === "open" && active === a.id
            ? hide(a.id, "minimized")
            : open(a.id)
        }
      />
      {start && (
        <MenuIniciar
          menuRef={menuRef}
          aoAbrir={(id) => open(id)}
          aoTrocarModo={(modo) => {
            setStart(false);
            setMode(modo);
          }}
          aoFazerLogoff={() => {
            setStart(false);
            onShowWelcome();
          }}
          aoDesligar={() => {
            setStart(false);
            setMode("rapido");
          }}
        />
      )}
      <DesktopAlerts
        ancoraRef={infoRef}
        reabrir={reabrir}
        onFim={() => {
          setAvisoMsn(true);
          setWindows((w) => (w.msnchat === "open" || w.msnchat === "minimized" ? w : { ...w, msnchat: "alerta" }));
        }}
      />
      {avisoMsn && (
        <MsnAviso
          aoAbrir={() => {
            setAvisoMsn(false);
            open("msnchat");
          }}
          aoFechar={() => setAvisoMsn(false)}
        />
      )}
    </main>
  );
}
