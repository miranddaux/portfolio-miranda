import { useState } from "react";
import { REDES_PRINCIPAIS, REDES_SOCIAIS } from "../data/social.js";
import { IconeBloco, IconeDesligar, IconeGaleria3D, IconeGameBoy, IconeJogo, IconePrompt, IconeSair, SetaVerde } from "./IconesMenu.jsx";

const XP = "/assets/xp";
const img = (src) => <img src={src} alt="" width="32" height="32" />;

// Linha do menu. `sub` cria o estilo de item fixado (título em negrito + descrição).
function Linha({ icone, rotulo, sub, aoClicar, href, breve }) {
  const conteudo = (
    <>
      <span className="mi-icone">{icone}</span>
      <span className="mi-texto">
        <strong>{rotulo}</strong>
        {sub && <small>{sub}</small>}
      </span>
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
const Divisor = () => <div className="mi-divisor" aria-hidden="true" />;

// Menu Iniciar: coluna branca (atalhos do portfólio) e coluna azul (redes e aplicativos).
export default function MenuIniciar({ menuRef, usuario = "Thiago Miranda", aoAbrir, aoTrocarModo, aoFazerLogoff, aoDesligar }) {
  const [todos, setTodos] = useState(false);
  const redes = REDES_PRINCIPAIS.map((id) => REDES_SOCIAIS[id]).filter((r) => r?.href);
  return (
    <nav className="menu-iniciar mi" ref={menuRef} id="menu-iniciar" aria-label="Menu Iniciar">
      <div className="mi-cabecalho">
        <img className="mi-avatar" src="/assets/xp/msn/fotos/thiago-retro.webp" alt="" width="48" height="48" />
        <strong>{usuario}</strong>
      </div>
      <div className="mi-colunas">
        <div className="mi-coluna mi-esquerda" role="menu" aria-label="Programas">
          {!todos ? (
            <>
              <Linha icone={img(`${XP}/area/projetos.png`)} rotulo="Meus Projetos" sub="Veja meu trabalho" aoClicar={() => aoAbrir("cases")} />
              <Linha icone={img(`${XP}/area/contato.png`)} rotulo="Fale comigo" sub="Envie-me uma mensagem" aoClicar={() => aoAbrir("contato")} />
              <Divisor />
              <Linha icone={img(`${XP}/area/sobre.png`)} rotulo="Sobre mim" aoClicar={() => aoAbrir("sobre")} />
              <Linha icone={img(`${XP}/area/curriculo.png`)} rotulo="Meu Currículo" aoClicar={() => aoAbrir("curriculo")} />
              <Linha icone={<IconeGameBoy />} rotulo="Game Boy Color" breve />
              <Linha icone={img(`${XP}/figma/msn.png`)} rotulo="Messenger" aoClicar={() => aoAbrir("msn")} />
            </>
          ) : (
            <>
              <Linha icone={img(`${XP}/figma/edge.png`)} rotulo="ANIMAE" aoClicar={() => aoAbrir("cases")} />
              <Linha icone={img(`${XP}/figma/movie-maker.png`)} rotulo="Navaja" aoClicar={() => aoAbrir("cases")} />
              <Linha icone={img(`${XP}/figma/transferencia.png`)} rotulo="Oficina do Tenista" aoClicar={() => aoAbrir("cases")} />
              <Linha icone={img(`${XP}/figma/paint.png`)} rotulo="Ultragrip" aoClicar={() => aoAbrir("cases")} />
              <Divisor />
              <Linha icone={img(`${XP}/figma/meu-computador.png`)} rotulo="Modo Rápido" aoClicar={() => aoTrocarModo("rapido")} />
              <Linha icone={img(`${XP}/figma/painel-de-controle.png`)} rotulo="Modo Noite" aoClicar={() => aoTrocarModo("noite")} />
              <Linha icone={img(`${XP}/figma/minhas-imagens.png`)} rotulo="Tela inicial" aoClicar={aoFazerLogoff} />
            </>
          )}
          <div className="mi-todos-area">
            <Divisor />
            <button type="button" className="mi-todos" onClick={() => setTodos((v) => !v)} aria-expanded={todos}>
              <span>{todos ? "Voltar" : "Todos os programas"}</span>
              <span className={todos ? "mi-seta is-volta" : "mi-seta"}><SetaVerde /></span>
            </button>
          </div>
        </div>
        <div className="mi-coluna mi-direita" role="menu" aria-label="Redes e aplicativos">
          {redes.map((r) => (
            <Linha key={r.nome} icone={img(r.icone)} rotulo={r.nome} href={r.href} />
          ))}
          <Divisor />
          <div className="mi-recente" aria-hidden="true">
            <span>Usado recentemente</span>
            <i>▸</i>
          </div>
          <Linha icone={img(`${XP}/figma/media-player.png`)} rotulo="Reprodutor de mídia" breve />
          <Linha icone={img(`${XP}/figma/minhas-imagens.png`)} rotulo="Visualizador de imagens" breve />
          <Linha icone={<IconeGaleria3D />} rotulo="Galeria 3D" breve />
          <Linha icone={<IconeJogo />} rotulo="World of Warcraft" breve />
          <Linha icone={<IconeBloco />} rotulo="Bloco de notas" breve />
          <Linha icone={<IconePrompt />} rotulo="Prompt de Comando" breve />
        </div>
      </div>
      <div className="mi-rodape">
        <button type="button" className="mi-acao" onClick={aoFazerLogoff}>
          <IconeSair />
          <span>Sair</span>
        </button>
        <button type="button" className="mi-acao" onClick={aoDesligar}>
          <IconeDesligar />
          <span>Desligar</span>
        </button>
      </div>
    </nav>
  );
}
