import { useEffect, useRef, useState } from "react";
import { REDES_PRINCIPAIS, REDES_SOCIAIS } from "../data/social.js";
import { IconeBloco, IconeGaleria3D, IconeGameBoy, IconeJogo, IconePrompt, SetaVerde } from "./IconesMenu.jsx";

const XP = "/assets/xp";
const img = (src, t = 32, classe) => <img className={classe} src={src} alt="" width={t} height={t} />;
const imgRede = (r, t = 32) => img(r.icone, t, `mi-rede mi-rede-${r.nome.toLowerCase()}`);

// Selo de duas letras para os programas usados recentemente (provisório, sem logo de terceiros).
const Selo = ({ sigla, fundo, cor = "#fff" }) => (
  <span className="mi-selo" style={{ background: fundo, color: cor }} aria-hidden="true">{sigla}</span>
);

const RECENTES = [
  { nome: "Adobe Illustrator", sigla: "Ai", fundo: "#330000", cor: "#ff9a00" },
  { nome: "Adobe Photoshop", sigla: "Ps", fundo: "#001e36", cor: "#31a8ff" },
  { nome: "Claude Code", sigla: "CC", fundo: "#d97757" },
  { nome: "Codex", sigla: "Cx", fundo: "#10a37f" },
  { nome: "Cursor", sigla: "Cu", fundo: "#1a1a1a" },
  { nome: "GitHub Desktop", sigla: "GH", fundo: "#24292f" },
  { nome: "VS Code", sigla: "VS", fundo: "#0078d4" },
  { nome: "Figma", sigla: "Fg", fundo: "#1e1e1e", cor: "#f24e1e" },
  { nome: "Shopify", sigla: "Sh", fundo: "#95bf47" },
];

// Linha do menu principal (ícone de 32 px dentro de uma linha de 40 px).
function Linha({ icone, rotulo, sub, aoClicar, href, breve }) {
  const conteudo = (
    <>
      <span className="mi-icone">{icone}</span>
      <span className="mi-texto">
        <strong>{rotulo}</strong>
        {sub && <small>{sub}</small>}
      </span>
      {breve && <span className="sr-only"> (em breve)</span>}
    </>
  );
  if (href) {
    return (
      <a className={`mi-linha ${sub ? "is-fixo" : ""}`} href={href} target="_blank" rel="noopener noreferrer" role="menuitem">
        {conteudo}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  return (
    <button
      type="button"
      role="menuitem"
      className={`mi-linha ${sub ? "is-fixo" : ""} ${breve ? "is-breve" : ""}`}
      onClick={breve ? undefined : aoClicar}
      aria-disabled={breve || undefined}
      title={breve ? "Em breve" : undefined}
    >
      {conteudo}
    </button>
  );
}

// Linha do mini menu (ícone de 24 px dentro de uma linha de 32 px).
function Mini({ icone, rotulo, aoClicar, href, breve }) {
  const conteudo = (
    <>
      <span className="mi-mini-icone">{icone}</span>
      <span>{rotulo}</span>
      {breve && <span className="sr-only"> (em breve)</span>}
    </>
  );
  if (href) return <a className="mi-mini" href={href} target="_blank" rel="noopener noreferrer" role="menuitem">{conteudo}<span className="sr-only"> (abre em nova aba)</span></a>;
  return (
    <button type="button" role="menuitem" className={`mi-mini ${breve ? "is-breve" : ""}`} onClick={breve ? undefined : aoClicar} aria-disabled={breve || undefined}>
      {conteudo}
    </button>
  );
}
const Divisor = ({ mini }) => <div className={mini ? "mi-mini-divisor" : "mi-divisor"} aria-hidden="true" />;

// Menu Iniciar: atalhos à esquerda, redes e aplicativos à direita, Sair e Desligar no rodapé.
export default function MenuIniciar({ menuRef, usuario = "Thiago Miranda", aoAbrir, aoTrocarModo, aoFazerLogoff, aoSair }) {
  const [sub, setSub] = useState(null); // "todos" | "recente" | null
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const abrir = (id) => { clearTimeout(timer.current); setSub(id); };
  const fechar = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setSub(null), 160); };
  const alternar = (id) => setSub((atual) => (atual === id ? null : id));
  const teclaSub = (id) => (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); abrir(id); }
    if (e.key === "ArrowLeft" && sub === id) { e.preventDefault(); setSub(null); }
  };
  const redes = REDES_PRINCIPAIS.map((id) => REDES_SOCIAIS[id]).filter((r) => r?.href);
  const MSN = `${XP}/msn/logo-64.png`;
  return (
    <nav className="menu-iniciar mi" ref={menuRef} id="menu-iniciar" aria-label="Menu Iniciar">
      <div className="mi-cabecalho">
        <img className="mi-avatar" src="/assets/xp/msn/fotos/thiago-retro.webp" alt="" width="48" height="48" />
        <strong>{usuario}</strong>
      </div>
      <div className="mi-colunas">
        <div className="mi-coluna mi-esquerda" role="menu" aria-label="Programas">
          <Linha icone={img(`${XP}/area/projetos.png`)} rotulo="Meus Projetos" sub="Veja meu trabalho" aoClicar={() => aoAbrir("cases")} />
          <Linha icone={img(`${XP}/area/contato.png`)} rotulo="Fale comigo" sub="Envie-me uma mensagem" aoClicar={() => aoAbrir("contato")} />
          <Divisor />
          <Linha icone={img(`${XP}/area/sobre.png`)} rotulo="Sobre mim" aoClicar={() => aoAbrir("sobre")} />
          <Linha icone={img(`${XP}/area/curriculo.png`)} rotulo="Meu Currículo" aoClicar={() => aoAbrir("curriculo")} />
          <Linha icone={<IconeGameBoy />} rotulo="Game Boy Color" breve />
          <Linha icone={<Selo sigla="Dd" fundo="#2f9e6e" />} rotulo="DoodleDev" breve />
          <Linha icone={<Selo sigla="iP" fundo="#9aa3b2" />} rotulo="iPod Classic" breve />
          <Linha icone={img(MSN, 32, "mi-msn")} rotulo="Messenger" aoClicar={() => aoAbrir("msn")} />
          <div className="mi-todos-area" onMouseEnter={() => abrir("todos")} onMouseLeave={fechar}>
            <Divisor />
            <button type="button" className={`mi-todos ${sub === "todos" ? "is-aberto" : ""}`} onClick={() => alternar("todos")} onKeyDown={teclaSub("todos")} aria-haspopup="menu" aria-expanded={sub === "todos"}>
              <span>Todos os programas</span>
              <SetaVerde />
            </button>
            {sub === "todos" && (
              <div className="mi-flyout mi-flyout-todos" role="menu" aria-label="Todos os programas">
                <Mini icone={img(`${XP}/area/sobre.png`, 24)} rotulo="Sobre mim" aoClicar={() => aoAbrir("sobre")} />
                <Mini icone={img(`${XP}/area/contato.png`, 24)} rotulo="Fale comigo" aoClicar={() => aoAbrir("contato")} />
                <Mini icone={img(`${XP}/area/projetos.png`, 24)} rotulo="Meus Projetos" aoClicar={() => aoAbrir("cases")} />
                <Mini icone={img(`${XP}/area/curriculo.png`, 24)} rotulo="Meu Currículo" aoClicar={() => aoAbrir("curriculo")} />
                <Divisor mini />
                <Mini icone={img(`${XP}/figma/meu-computador.png`, 24)} rotulo="Modo Rápido" aoClicar={() => aoTrocarModo("rapido")} />
                <Mini icone={img(`${XP}/figma/painel-de-controle.png`, 24)} rotulo="Modo Noite" aoClicar={() => aoTrocarModo("noite")} />
                <Mini icone={img(`${XP}/figma/documentos-recentes.png`, 24)} rotulo="Tela inicial" aoClicar={aoFazerLogoff} />
                <Divisor mini />
                {redes.map((r) => <Mini key={r.nome} icone={imgRede(r, 24)} rotulo={r.nome} href={r.href} />)}
                <Divisor mini />
                <Mini icone={<IconeGaleria3D />} rotulo="Galeria 3D" breve />
                <Mini icone={<IconePrompt />} rotulo="Prompt de Comando" breve />
                <Mini icone={<Selo sigla="Dd" fundo="#2f9e6e" />} rotulo="DoodleDev" breve />
                <Mini icone={<IconeGameBoy />} rotulo="Game Boy Color" breve />
                <Mini icone={img(`${XP}/figma/minhas-imagens.png`, 24)} rotulo="Visualizador de imagens" breve />
                <Mini icone={<Selo sigla="iP" fundo="#9aa3b2" />} rotulo="iPod Classic" breve />
                <Mini icone={img(MSN, 24)} rotulo="Messenger" aoClicar={() => aoAbrir("msn")} />
                <Mini icone={img(`${XP}/menu/media-player-orb.png`, 24)} rotulo="Reprodutor de mídia" aoClicar={() => aoAbrir("player")} />
                <Mini icone={<Selo sigla="Cm" fundo="#6b7280" />} rotulo="Campo minado" breve />
                <Mini icone={<IconeBloco />} rotulo="Bloco de notas" breve />
                <Mini icone={img(`${XP}/figma/paint.png`, 24)} rotulo="Paint" breve />
                <Mini icone={<Selo sigla="Pb" fundo="#7c3aed" />} rotulo="Pinball" breve />
                <Mini icone={<IconeJogo />} rotulo="World of Warcraft" breve />
              </div>
            )}
          </div>
        </div>
        <div className="mi-coluna mi-direita" role="menu" aria-label="Redes e aplicativos">
          {redes.map((r) => <Linha key={r.nome} icone={imgRede(r)} rotulo={r.nome} href={r.href} />)}
          <Divisor />
          <div className="mi-sub" onMouseEnter={() => abrir("recente")} onMouseLeave={fechar}>
            <button type="button" className={`mi-linha mi-recente ${sub === "recente" ? "is-aberto" : ""}`} onClick={() => alternar("recente")} onKeyDown={teclaSub("recente")} aria-haspopup="menu" aria-expanded={sub === "recente"}>
              <span className="mi-icone">{img(`${XP}/figma/documentos-recentes.png`)}</span>
              <span className="mi-texto"><strong>Usado recentemente</strong></span>
              <i aria-hidden="true">▸</i>
            </button>
            {sub === "recente" && (
              <div className="mi-flyout mi-flyout-recente" role="menu" aria-label="Usado recentemente">
                {RECENTES.map((r) => <Mini key={r.nome} icone={<Selo sigla={r.sigla} fundo={r.fundo} cor={r.cor} />} rotulo={r.nome} breve />)}
              </div>
            )}
          </div>
          <Linha icone={img(`${XP}/menu/media-player-orb.png`)} rotulo="Reprodutor de mídia" aoClicar={() => aoAbrir("player")} />
          <Linha icone={img(`${XP}/figma/minhas-imagens.png`)} rotulo="Visualizador de imagens" breve />
          <Linha icone={<IconeGaleria3D />} rotulo="Galeria 3D" breve />
          <Linha icone={<IconeJogo />} rotulo="World of Warcraft" breve />
          <Linha icone={<IconeBloco />} rotulo="Bloco de notas" breve />
          <Linha icone={<IconePrompt />} rotulo="Prompt de Comando" breve />
        </div>
      </div>
      <div className="mi-rodape">
        <button type="button" className="mi-acao" onClick={aoSair}>
          <img src={`${XP}/menu/sair.png`} alt="" width="32" height="32" />
          <span>Sair</span>
        </button>
        <button type="button" className="mi-acao" onClick={aoSair}>
          <img src={`${XP}/menu/desligar.png`} alt="" width="32" height="32" />
          <span>Desligar</span>
        </button>
      </div>
    </nav>
  );
}
