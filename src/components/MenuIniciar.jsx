const A = "/assets/xp/figma";

// Item da lista do menu. `acelerador` sublinha a letra de atalho, como no Figma.
function Item({ icone, rotulo, aoClicar, desativado, nota }) {
  return (
    <button
      className="menu-item"
      onClick={aoClicar}
      disabled={desativado}
      type="button"
    >
      <img src={`${A}/${icone}.png`} alt="" width="25" height="25" />
      <span>{rotulo}</span>
      {nota && <small>{nota}</small>}
    </button>
  );
}
const Divisor = () => <div className="menu-divisor" aria-hidden="true" />;

// Menu Iniciar — réplica do Figma (Home 125:36 › Start).
export default function MenuIniciar({
  menuRef,
  usuario = "Thiago Miranda",
  aoAbrir,
  aoTrocarModo,
  aoFazerLogoff,
  aoDesligar,
}) {
  return (
    <nav
      className="menu-iniciar"
      ref={menuRef}
      id="menu-iniciar"
      aria-label="Menu Iniciar"
    >
      <div className="menu-cabecalho">
        <img
          className="menu-avatar"
          src="/assets/xp/msn/fotos/thiago-retro.webp"
          alt=""
          width="54"
          height="54"
        />
        <strong>{usuario}</strong>
      </div>
      <div className="menu-colunas">
        <div className="menu-coluna menu-coluna-programas">
          <h2>Programas</h2>
          <div className="menu-lista">
            <div className="menu-rotulo">Mais usados</div>
            <Divisor />
            <Item icone="msn" rotulo="Sobre mim" aoClicar={() => aoAbrir("sobre")} />
            <Item icone="explorador" rotulo="Meus projetos" aoClicar={() => aoAbrir("cases")} />
            <Item icone="email" rotulo="Contato" aoClicar={() => aoAbrir("contato")} />
            <Item icone="msn" rotulo="Messenger" aoClicar={() => aoAbrir("msn")} />
            <Item icone="edge" rotulo="ANIMAE" aoClicar={() => aoAbrir("cases")} />
            <Item icone="movie-maker" rotulo="Navaja" aoClicar={() => aoAbrir("cases")} />
            <Item icone="transferencia" rotulo="Oficina do Tenista" aoClicar={() => aoAbrir("cases")} />
            <Item icone="paint" rotulo="Ultragrip" aoClicar={() => aoAbrir("cases")} />
            <Divisor />
            <button
              className="menu-todos"
              type="button"
              onClick={() => aoAbrir("cases")}
            >
              <span>Todos os projetos</span>
              <img src={`${A}/todos-os-programas.png`} alt="" width="25" height="25" />
            </button>
          </div>
        </div>
        <div className="menu-coluna menu-coluna-sistema">
          <h2>Sistema</h2>
          <div className="menu-lista">
            <div className="menu-rotulo">Mais usados</div>
            <Divisor />
            <Item icone="documentos-recentes" rotulo="Meu currículo" aoClicar={() => aoAbrir("curriculo")} />
            <Item icone="meu-computador" rotulo="Modo Rápido" aoClicar={() => aoTrocarModo("rapido")} />
            <Item icone="painel-de-controle" rotulo="Modo Noite" aoClicar={() => aoTrocarModo("noite")} />
            <Item icone="minhas-imagens" rotulo="Tela inicial" aoClicar={aoFazerLogoff} />
            <Divisor />
            <Item icone="ajuda" rotulo="Ajuda e contato" aoClicar={() => aoAbrir("contato")} />
          </div>
        </div>
      </div>
      <div className="menu-rodape">
        <button className="menu-acao" onClick={aoFazerLogoff} type="button">
          <img src={`${A}/rodape-adicionar.png`} alt="" width="16" height="16" />
          <span>
            <u>F</u>azer logoff
          </span>
        </button>
        <button className="menu-acao" onClick={aoDesligar} type="button">
          <img src={`${A}/rodape-desligar.png`} alt="" width="20" height="20" />
          <span>
            <u>D</u>esligar
          </span>
        </button>
      </div>
    </nav>
  );
}
