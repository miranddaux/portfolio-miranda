import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Modal "Desconectar Thiago Miranda XP": fundo escurecido em preto e branco, Reiniciar, Log Off e Cancelar.
export default function DialogoDesligar({ aoReiniciar, aoLogoff, aoCancelar }) {
  const caixa = useRef(null);
  useEffect(() => {
    const anterior = document.activeElement;
    const botoes = () => [...caixa.current.querySelectorAll("button")];
    botoes()[0]?.focus();
    const tecla = (e) => {
      if (e.key === "Escape") aoCancelar();
      if (e.key !== "Tab") return;
      const lista = botoes();
      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    };
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("keydown", tecla);
      anterior?.focus?.();
    };
  }, [aoCancelar]);
  return createPortal(
    <div className="dd-fundo" onPointerDown={(e) => e.target === e.currentTarget && aoCancelar()}>
      <div ref={caixa} className="dd-caixa" role="dialog" aria-modal="true" aria-labelledby="dd-titulo">
        <div className="dd-topo">
          <h2 id="dd-titulo">Desconectar Thiago Miranda XP</h2>
          <img src="/assets/xp/figma/bandeira.png" alt="" width="32" height="32" />
        </div>
        <div className="dd-meio">
          <button type="button" className="dd-opcao" onClick={aoReiniciar}>
            <img src="/assets/xp/restart.webp" alt="" width="48" height="48" />
            <span>Reiniciar</span>
          </button>
          <button type="button" className="dd-opcao" onClick={aoLogoff}>
            <img src="/assets/xp/menu/sair.png" alt="" width="48" height="48" />
            <span>Log Off</span>
          </button>
        </div>
        <div className="dd-base">
          <button type="button" className="dd-cancelar" onClick={aoCancelar}>Cancelar</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Tela azul de "reiniciando", antes de voltar à escolha da conta.
export function TelaReiniciando() {
  return createPortal(
    <div className="dd-tela" role="status" aria-live="polite">
      <div className="dd-tela-banda" />
      <div className="dd-tela-centro">
        <img src="/assets/xp/thiago-miranda-xp.png" alt="Thiago Miranda XP, Product Designer" width="280" />
        <p>O portfólio está sendo reiniciado...</p>
      </div>
      <div className="dd-tela-banda" />
    </div>,
    document.body,
  );
}
