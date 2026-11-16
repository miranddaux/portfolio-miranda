import { useEffect, useRef, useState } from "react";
import { CASES } from "../data/cases";
import RetroIcon from "../components/RetroIcon";
import DesktopAlerts from "../components/DesktopAlerts";
import BarraDeTarefas from "../components/BarraDeTarefas";
import MenuIniciar from "../components/MenuIniciar";
import AvisoTelaCheia from "../components/AvisoTelaCheia";
import JanelaXP from "../components/JanelaXP";
import PainelSobre from "../components/PainelSobre";
import JanelaCurriculo, { CURRICULOS } from "../components/JanelaCurriculo";
import { MsnAviso, MsnContatos, MsnConversa } from "../components/Msn";
import JanelaEmail from "../components/JanelaEmail";
const APPS = [
  {
    id: "sobre",
    name: "Sobre mim",
    title: "Sobre mim — Miranda.txt",
    icon: "profile",
  },
  {
    id: "cases",
    name: "Meus projetos",
    title: "Meus projetos",
    icon: "folder",
  },
  { id: "contato", name: "Entre em contato", title: "Entre em contato comigo", icon: "mail" },
  {
    id: "playground",
    name: "Playground",
    title: "Playground",
    icon: "computer",
  },
  { id: "curriculo", name: "Meu currículo", title: "Meu currículo", icon: "document" },
  { id: "msn", name: "Messenger", title: "Messenger", icon: "mail" },
  { id: "msnchat", name: "ThiagoBot", title: "Conversa com ThiagoBot", icon: "mail" },
];
const APPS_JANELAS = [
  { ...APPS[0], janelaIcone: "/assets/xp/painel/painel-icone.png", largura: 1000, altura: 704, cascata: 0 },
  { ...APPS[1], janelaIcone: "/assets/xp/area/projetos.png", largura: 960, altura: 600, cascata: 1 },
  { ...APPS[2], janelaIcone: "/assets/xp/area/contato.png", largura: 560, altura: 464, cascata: 2, minLargura: 400, semStatus: true },
  { ...APPS[3], janelaIcone: "/assets/xp/painel/programas.png", largura: 640, altura: 440, cascata: 3 },
  { ...APPS[4], janelaIcone: "/assets/xp/area/curriculo.png", largura: 600, altura: 768, cascata: 1 },
  { ...APPS[5], janelaIcone: "/assets/xp/msn/logo-32.png", largura: 336, altura: 656, alinhar: "direita", topo: 16, minLargura: 288, minAltura: 400, semStatus: true },
  { ...APPS[6], janelaIcone: "/assets/xp/msn/logo-32.png", largura: 576, altura: 560, alinhar: "esquerda", topo: 16, minLargura: 400, minAltura: 400, semStatus: true },
];
export default function XPDesktop({ setMode, onShowWelcome }) {
  const [windows, setWindows] = useState({ sobre: "open" }),
    [active, setActive] = useState("sobre"),
    [start, setStart] = useState(false),
    [filter, setFilter] = useState("Destaques");
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
        document.getElementById(`${id}-title`)?.focus(),
      );
  };
  const hide = (id, state) => {
    setWindows((w) => ({ ...w, [id]: state }));
    requestAnimationFrame(() => {
      const target =
        state === "closed"
          ? document.getElementById(`shortcut-${id}`)
          : document.getElementById(`task-${id}`);
      target?.focus();
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
    menuRef.current?.querySelector("button")?.focus();
    const close = (e) => {
      if (e.type === "keydown" && e.key === "Escape") {
        setStart(false);
        startRef.current?.focus();
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
  const projects =
    filter === "Destaques"
      ? CASES.slice(0, 3)
      : filter === "Mais trabalhos"
        ? CASES.slice(3)
        : CASES.filter((c) => c.group === filter);
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
        {APPS_JANELAS.map((app) =>
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
              onFechar={() => hide(app.id, "closed")}
              onMinimizar={() => hide(app.id, "minimized")}
              statusEsquerda={
                app.id === "curriculo"
                  ? "Clique para ampliar e arraste para visualizar outras áreas."
                  : undefined
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
              {app.id === "sobre" && <PainelSobre aoAbrir={open} />}
              {app.id === "cases" && (
                <>
                  <div className="xp-menubar">
                <span>Arquivo</span>
                <span>Editar</span>
                <span>Exibir</span>
                <span>Favoritos</span>
              </div>
              <div className="xp-address">
                <span>Endereço</span>
                <div>
                  <RetroIcon name="folder" size={16} /> C:\Miranda\Portfólio\
                  {filter}
                </div>
                <button
                  onClick={() => setFilter("Destaques")}
                  aria-label="Ir para destaques"
                >
                  ➜
                </button>
              </div>
              <div className="xp-explorer">
                <aside className="xp-explorer-sidebar">
                  <div className="xp-sidebar-group">
                    <h3>Trabalhos selecionados</h3>
                    <div role="group" aria-label="Filtrar projetos">
                      {[
                        "Destaques",
                        "Apps",
                        "E-commerce",
                        "Mais trabalhos",
                      ].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFilter(f)}
                          aria-pressed={filter === f}
                        >
                          <RetroIcon name="folder" size={16} />
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="xp-sidebar-group">
                    <h3>Sobre esta pasta</h3>
                    <p>
                      Escolhas, contexto e processo. Cada case abre em uma
                      página própria.
                    </p>
                  </div>
                </aside>
                <div className="xp-project-list">
                  <div className="xp-projects-heading">
                    <h3>
                      {filter === "Destaques" ? "3 cases em destaque" : filter}
                    </h3>
                    <span>Selecione um projeto para conhecer o processo.</span>
                  </div>
                  {projects.map((c) => (
                    <article className="xp-project" key={c.id}>
                      <RetroIcon
                        name={
                          c.id === "animae"
                            ? "community"
                            : c.id === "navaja"
                              ? "research"
                              : "shop"
                        }
                        size={48}
                      />
                      <div>
                        <span className="xp-project-kind">{c.type}</span>
                        <h4>
                          <a href={`/cases/${c.id}`}>{c.title}</a>
                        </h4>
                        <p>{c.summary}</p>
                        <a className="xp-read-case" href={`/cases/${c.id}`}>
                          Ler o case →
                        </a>
                      </div>
                    </article>
                  ))}
                  <p className="xp-media-note">
                    Imagens dos projetos em curadoria.
                  </p>
                </div>
              </div>
              
                </>
              )}
              {app.id === "contato" && <JanelaEmail />}
              {app.id === "playground" && (
                <div className="janela-xp-rolagem">
                  <div className="xp-utility-content">
                    {(
                      <>
                        <RetroIcon name="computer" size={56} />
                        <h3>Playground em construção</h3>
                        <p>
                          Um espaço para protótipos e experiências entre design
                          e código.
                        </p>
                        <p>Enquanto isso, conheça meu trabalho no ANIMAE.</p>
                        <a className="xp-button" href="/cases/animae">
                          Conhecer ANIMAE
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )}
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
        apps={APPS}
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
