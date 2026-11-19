import { useEffect, useRef, useState } from "react";
import { REDES_PRINCIPAIS, REDES_SOCIAIS } from "../data/social.js";
import { SetaVerde } from "./IconesMenu.jsx";
import { logoDe } from "../data/logos.js";

const XP = "/assets/xp";
const MI = "/assets/xp/menu-icons";
const img = (src, t = 32, classe) => <img className={classe} src={src} alt="" width={t} height={t} />;
const imgRede = (r, t = 32) => img(`${MI}/${r.nome.toLowerCase()}.png`, t, `mi-rede mi-rede-${r.nome.toLowerCase()}`);

// Programas usados recentemente: só os que têm logo enviado pelo Thiago.
const RECENTES = ["Adobe Photoshop", "Adobe Illustrator", "Claude Code", "Cursor", "VS Code", "Figma", "Shopify", "Framer AI"];
const LOGO_RECENTE = { "Adobe Illustrator": "illustrator", "Adobe Photoshop": "photoshop", "Claude Code": "claude" };
const logoRecente = (nome) => logoDe(LOGO_RECENTE[nome] || nome);

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
export default function MenuIniciar({ menuRef, usuario = "Thiago Miranda", aoAbrir, aoFazerLogoff, aoSair }) {
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
  return (
    <nav className="menu-iniciar mi" ref={menuRef} id="menu-iniciar" aria-label="Menu Iniciar">
      <div className="mi-cabecalho">
        <img className="mi-avatar" src="/assets/xp/msn/fotos/thiago-retro.webp" alt="" width="48" height="48" />
        <strong>{usuario}</strong>
      </div>
      <div className="mi-colunas">
        <div className="mi-coluna mi-esquerda" role="menu" aria-label="Programas">
          <Linha icone={img(`${MI}/projetos.png`)} rotulo="Meus Projetos" sub="Veja meu trabalho" aoClicar={() => aoAbrir("cases")} />
          <Linha icone={img(`${MI}/contato.png`)} rotulo="Fale comigo" sub="Envie-me uma mensagem" aoClicar={() => aoAbrir("contato")} />
          <Linha icone={img(`${MI}/sobre.png`)} rotulo="Sobre mim" aoClicar={() => aoAbrir("sobre")} />
          <Linha icone={img(`${MI}/curriculo.png`)} rotulo="Meu Currículo" aoClicar={() => aoAbrir("curriculo")} />
          <Linha icone={img(`${MI}/msn.png`)} rotulo="Messenger" aoClicar={() => aoAbrir("msn")} />
          <Divisor />
          <Linha icone={img(`${MI}/campo-minado.png`)} rotulo="Campo Minado" aoClicar={() => aoAbrir("minas")} />
          <Linha icone={img(`${MI}/paint.png`)} rotulo="Paint" aoClicar={() => aoAbrir("paint")} />
          <Linha icone={img(`${MI}/pinball.png`)} rotulo="Pinball" aoClicar={() => aoAbrir("pinball")} />
          <div className="mi-todos-area" onMouseEnter={() => abrir("todos")} onMouseLeave={fechar}>
            <Divisor />
            <button type="button" className={`mi-todos ${sub === "todos" ? "is-aberto" : ""}`} onClick={() => alternar("todos")} onKeyDown={teclaSub("todos")} aria-haspopup="menu" aria-expanded={sub === "todos"}>
              <span>Todos os programas</span>
              <SetaVerde />
            </button>
            {sub === "todos" && (
              <div className="mi-flyout mi-flyout-todos" role="menu" aria-label="Todos os programas">
                <Mini icone={img(`${MI}/sobre.png`, 16)} rotulo="Sobre mim" aoClicar={() => aoAbrir("sobre")} />
                <Mini icone={img(`${MI}/contato.png`, 16)} rotulo="Fale comigo" aoClicar={() => aoAbrir("contato")} />
                <Mini icone={img(`${MI}/projetos.png`, 16)} rotulo="Meus Projetos" aoClicar={() => aoAbrir("cases")} />
                <Mini icone={img(`${MI}/curriculo.png`, 16)} rotulo="Meu Currículo" aoClicar={() => aoAbrir("curriculo")} />
                <Divisor mini />
                {redes.map((r) => <Mini key={r.nome} icone={imgRede(r, 16)} rotulo={r.nome} href={r.href} />)}
                <Divisor mini />
                <Mini icone={img(`${MI}/msn.png`, 16)} rotulo="Messenger" aoClicar={() => aoAbrir("msn")} />
                <Mini icone={img(`${MI}/player.png`, 16)} rotulo="Reprodutor de mídia" aoClicar={() => aoAbrir("player")} />
                <Mini icone={img(`${MI}/headspace.png`, 16)} rotulo="Headspace" aoClicar={() => aoAbrir("headspace")} />
                <Divisor mini />
                <Mini icone={img(`${MI}/prompt.png`, 16)} rotulo="Prompt de Comando" aoClicar={() => aoAbrir("prompt")} />
                <Mini icone={img(`${MI}/campo-minado.png`, 16)} rotulo="Campo minado" aoClicar={() => aoAbrir("minas")} />
                <Mini icone={img(`${MI}/paint.png`, 16)} rotulo="Paint" aoClicar={() => aoAbrir("paint")} />
                <Mini icone={img(`${MI}/pinball.png`, 16)} rotulo="Pinball" aoClicar={() => aoAbrir("pinball")} />
                <Mini icone={img(`${MI}/doom.png`, 16)} rotulo="DOOM" aoClicar={() => aoAbrir("doom")} />
                <Divisor mini />
              </div>
            )}
          </div>
        </div>
        <div className="mi-coluna mi-direita" role="menu" aria-label="Redes e aplicativos">
          {redes.map((r) => <Linha key={r.nome} icone={imgRede(r)} rotulo={r.nome} href={r.href} />)}
          <Divisor />
          <div className="mi-sub" onMouseEnter={() => abrir("recente")} onMouseLeave={fechar}>
            <button type="button" className={`mi-linha mi-recente ${sub === "recente" ? "is-aberto" : ""}`} onClick={() => alternar("recente")} onKeyDown={teclaSub("recente")} aria-haspopup="menu" aria-expanded={sub === "recente"}>
              <span className="mi-icone">{img(`${MI}/recentes.png`)}</span>
              <span className="mi-texto"><strong>Usado recentemente</strong></span>
              <i aria-hidden="true">▸</i>
            </button>
            {sub === "recente" && (
              <div className="mi-flyout mi-flyout-recente" role="menu" aria-label="Usado recentemente">
                {RECENTES.map((nome) => <Mini key={nome} icone={img(logoRecente(nome), 16)} rotulo={nome} breve />)}
              </div>
            )}
          </div>
          <Linha icone={img(`${MI}/player.png`)} rotulo="Reprodutor de mídia" aoClicar={() => aoAbrir("player")} />
          <Linha icone={img(`${MI}/headspace.png`)} rotulo="Headspace" aoClicar={() => aoAbrir("headspace")} />
          <Linha icone={img(`${MI}/prompt.png`)} rotulo="Prompt de Comando" aoClicar={() => aoAbrir("prompt")} />
          <Linha icone={img(`${MI}/doom.png`)} rotulo="DOOM" aoClicar={() => aoAbrir("doom")} />
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
