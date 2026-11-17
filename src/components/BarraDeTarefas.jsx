import Relogio from "./Relogio";

const A = "/assets/xp/figma";

// Barra de tarefas — réplica do Figma (Home 125:36 › Taskbar).
export default function BarraDeTarefas({
  apps,
  janelas,
  ativo,
  menuAberto,
  iniciarRef,
  infoRef,
  aoClicarInfo,
  aoAlternarMenu,
  aoClicarTarefa,
  aoClicarMsn,
}) {
  const abertas = apps.filter((a) => janelas[a.id] && janelas[a.id] !== "closed");
  return (
    <footer className="barra-tarefas">
      <button
        className="botao-iniciar"
        ref={iniciarRef}
        onClick={aoAlternarMenu}
        aria-expanded={menuAberto}
        aria-controls="menu-iniciar"
      >
        <img src={`${A}/bandeira.png`} alt="" width="22" height="18" />
        <span>start</span>
      </button>
      <div className="barra-tarefas-botoes" aria-label="Janelas abertas">
        {abertas.map((a) => {
          const pressionado = ativo === a.id && janelas[a.id] === "open";
          const piscando = janelas[a.id] === "alerta";
          return (
            <button
              key={a.id}
              id={`task-${a.id}`}
              className={`botao-barra ${pressionado ? "is-pressionado" : ""} ${piscando ? "is-piscando" : ""}`}
              aria-label={`${a.name} — ${janelas[a.id] === "open" ? "minimizar ou ativar" : "restaurar"}`}
              aria-pressed={janelas[a.id] === "open"}
              onClick={() => aoClicarTarefa(a)}
            >
              <img
                src={a.id.startsWith("msn") ? "/assets/xp/msn/logo-32.png" : `${A}/${a.id === "cases" ? "pasta" : "edge-barra"}.png`}
                alt=""
                width="18"
                height="16"
              />
              <span>{a.name}</span>
            </button>
          );
        })}
      </div>
      <span className="bandeja-idioma" title="Português (Brasil)">
        PT
      </span>
      <div className="bandeja">
        <button className="bandeja-msn" onClick={aoClicarMsn} aria-label="Abrir Messenger" title="Messenger">
          <img src="/assets/xp/msn/logo-32.png" alt="" width="16" height="16" />
        </button>
        <span className="bandeja-info-caixa">
        <button
          className="bandeja-info"
          ref={infoRef}
          onClick={aoClicarInfo}
          aria-label="Mostrar aviso de boas-vindas"
          title="Informação"
        >
          <img src={`${A}/informacao.png`} alt="" width="20" height="20" />
        </button>
        </span>
        <img src={`${A}/bandeja-rede.png`} alt="" width="20" height="20" />
        <Relogio />
      </div>
    </footer>
  );
}
