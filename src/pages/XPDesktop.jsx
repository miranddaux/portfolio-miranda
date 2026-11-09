import { useEffect, useRef, useState } from "react";
import { CASES } from "../data/cases";
import Window from "../components/Window";
import RetroIcon from "../components/RetroIcon";
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
  { id: "contato", name: "Contato", title: "Contato — Miranda", icon: "mail" },
  {
    id: "playground",
    name: "Playground",
    title: "Playground",
    icon: "computer",
  },
];
function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  return (
    <time dateTime={now.toISOString()} title="Horário em São Paulo">
      {now.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </time>
  );
}
export default function XPDesktop() {
  const [windows, setWindows] = useState({ sobre: "open", cases: "open" }),
    [active, setActive] = useState("cases"),
    [start, setStart] = useState(false),
    [filter, setFilter] = useState("Destaques");
  const menuRef = useRef(null),
    startRef = useRef(null);
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
      <div className="desktop-watermark" aria-hidden="true">
        Miranda<span>XP</span>
        <small>PRODUCT DESIGNER · PORTFOLIO EDITION</small>
      </div>
      <nav className="desktop-shortcuts" aria-label="Atalhos do portfólio">
        {APPS.map((a) => (
          <button key={a.id} id={`shortcut-${a.id}`} onClick={() => open(a.id)}>
            <RetroIcon name={a.icon} size={40} />
            <span>{a.name}</span>
          </button>
        ))}
        <a
          className="desktop-shortcut cv-shortcut"
          href="/#contato"
          onClick={() => open("contato")}
        >
          <RetroIcon name="document" size={40} />
          <span>
            Currículo<small>em breve</small>
          </span>
        </a>
      </nav>
      <div className="desktop-workspace">
        {windows.sobre === "open" && (
          <div
            className={`desktop-app profile-app ${active === "sobre" ? "is-active" : ""}`}
            onPointerDown={() => setActive("sobre")}
          >
            <Window
              id="sobre"
              icon="profile"
              title={APPS[0].title}
              onClose={() => hide("sobre", "closed")}
              onMinimize={() => hide("sobre", "minimized")}
            >
              <div className="xp-menubar">
                <span>Arquivo</span>
                <span>Editar</span>
                <span>Exibir</span>
              </div>
              <div className="xp-profile-content">
                <div className="xp-profile-heading">
                  <div className="xp-avatar">TM</div>
                  <div>
                    <strong>Thiago Miranda</strong>
                    <span>Product Designer pleno</span>
                  </div>
                </div>
                <div className="xp-status">
                  <span className="status-dot" />
                  Aberto a vagas remotas
                </div>
                <h3>Do Figma ao código.</h3>
                <p>
                  Eu desenho apps, SaaS e e-commerce, com foco em UI craft e
                  design systems.
                </p>
                <p>
                  Hoje desenho experiências de compra na{" "}
                  <strong>Agência Disco</strong> e construo o{" "}
                  <strong>ANIMAE</strong>, meu app de comunidade para quem
                  acompanha anime, com apoio de IA.
                </p>
                <div className="xp-fact">
                  <RetroIcon name="medal" size={32} />
                  <p>
                    Designer e mentor do squad vencedor do hackathon SouJunior,
                    entre 30 equipes.
                  </p>
                </div>
                <div className="xp-location">
                  São José do Rio Preto, SP · Remoto
                </div>
                <div className="xp-profile-actions">
                  <button className="xp-button" onClick={() => open("cases")}>
                    Ver meus projetos →
                  </button>
                  <button className="xp-button" onClick={() => open("contato")}>
                    Contato
                  </button>
                </div>
              </div>
              <div className="xp-statusbar">UI Craft · Design Systems · UX</div>
            </Window>
          </div>
        )}
        {windows.cases === "open" && (
          <div
            className={`desktop-app projects-app ${active === "cases" ? "is-active" : ""}`}
            onPointerDown={() => setActive("cases")}
          >
            <Window
              id="cases"
              title="Meus projetos"
              onClose={() => hide("cases", "closed")}
              onMinimize={() => hide("cases", "minimized")}
            >
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
              <div className="xp-statusbar">
                <span>{projects.length} projetos</span>
                <span>Portfólio Miranda · 2026</span>
              </div>
            </Window>
          </div>
        )}
        {["contato", "playground"].map(
          (id) =>
            windows[id] === "open" && (
              <div
                key={id}
                className={`desktop-app utility-app ${active === id ? "is-active" : ""}`}
                onPointerDown={() => setActive(id)}
              >
                <Window
                  id={id}
                  title={APPS.find((a) => a.id === id).title}
                  icon={id === "contato" ? "mail" : "computer"}
                  onClose={() => hide(id, "closed")}
                  onMinimize={() => hide(id, "minimized")}
                >
                  <div className="xp-utility-content">
                    {id === "contato" ? (
                      <>
                        <RetroIcon name="mail" size={56} />
                        <h3>Vamos conversar?</h3>
                        <p>
                          Estou aberto a vagas remotas de Product Designer pleno
                          em empresas de produto.
                        </p>
                        <p className="xp-notice">
                          E-mail público, LinkedIn e currículo revisado ainda
                          serão adicionados.
                        </p>
                      </>
                    ) : (
                      <>
                        <RetroIcon name="computer" size={56} />
                        <h3>Playground em construção</h3>
                        <p>
                          Um espaço para protótipos e experiências entre design
                          e código.
                        </p>
                        <p>Enquanto isso, conheça meu trabalho no ANIMAE.</p>
                        <a className="xp-button" href="/cases/animae">
                          Conhecer ANIMAE →
                        </a>
                      </>
                    )}
                  </div>
                </Window>
              </div>
            ),
        )}
        {!Object.values(windows).includes("open") && (
          <div className="desktop-empty">
            <strong>Seu próximo clique pode ser um bom começo.</strong>
            <button className="xp-button" onClick={() => open("cases")}>
              Abrir meus projetos
            </button>
          </div>
        )}
      </div>
      <footer className="xp-taskbar">
        <button
          className="xp-start"
          ref={startRef}
          onClick={() => setStart(!start)}
          aria-expanded={start}
          aria-controls="start-menu"
        >
          <span className="start-symbol" aria-hidden="true">
            ✳
          </span>{" "}
          iniciar
        </button>
        <div className="xp-tasks" aria-label="Janelas abertas">
          {APPS.filter((a) => windows[a.id] && windows[a.id] !== "closed").map(
            (a) => (
              <button
                key={a.id}
                id={`task-${a.id}`}
                aria-label={`${a.name} — ${windows[a.id] === "open" ? "minimizar ou ativar" : "restaurar"}`}
                className={
                  active === a.id && windows[a.id] === "open" ? "active" : ""
                }
                onClick={() =>
                  windows[a.id] === "open" && active === a.id
                    ? hide(a.id, "minimized")
                    : open(a.id)
                }
                aria-pressed={windows[a.id] === "open"}
              >
                <RetroIcon name={a.icon} size={16} />
                <span>{a.name}</span>
              </button>
            ),
          )}
        </div>
        <div className="xp-tray">
          <span
            className="tray-status"
            title="Aberto a vagas remotas"
            aria-label="Aberto a vagas remotas"
          >
            ●
          </span>
          <Clock />
          <span className="tray-zone">BRT</span>
        </div>
      </footer>
      {start && (
        <nav
          className="xp-start-menu"
          ref={menuRef}
          id="start-menu"
          aria-label="Menu Iniciar"
        >
          <div className="xp-start-profile">
            <div className="xp-avatar">TM</div>
            <strong>Thiago Miranda</strong>
          </div>
          <div className="xp-start-links">
            {APPS.map((a) => (
              <button key={a.id} onClick={() => open(a.id)}>
                <RetroIcon name={a.icon} size={32} />
                <span>{a.name}</span>
              </button>
            ))}
          </div>
          <div className="xp-start-footer">
            Portfólio Miranda · Inspirado no Windows XP
          </div>
        </nav>
      )}
    </main>
  );
}
