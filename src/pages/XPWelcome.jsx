import { useRef, useState } from "react";

/** A welcome screen only; entering never asks for credentials. */
export default function XPWelcome({ onEnter }) {
  const profileRef = useRef(null);
  const [resetVersion, setResetVersion] = useState(0);

  function restart() {
    setResetVersion((version) => version + 1);
    profileRef.current?.focus();
  }

  return (
    <main className="xp-entry" aria-labelledby="xp-entry-title">
      <h1 id="xp-entry-title" className="sr-only">
        Portfólio de Tiago Miranda — Project Designer
      </h1>
      <div className="xp-entry-top" aria-hidden="true" />
      <section
        className="xp-entry-center"
        aria-label="Boas-vindas ao portfólio"
      >
        <div className="xp-entry-divider" aria-hidden="true" />
        <div className="xp-entry-intro">
          <img
            className="xp-entry-logo"
            src="/assets/xp/windows-xp-logo.webp"
            width="800"
            height="648"
            alt="Windows XP"
            fetchPriority="high"
            draggable="false"
          />
          <p>Para começar, clique em Tiago Miranda para entrar.</p>
        </div>
        <div className="xp-entry-account">
          <button
            ref={profileRef}
            className="xp-entry-profile"
            onClick={onEnter}
            aria-label="Entrar no portfólio de Tiago Miranda, Project Designer"
          >
            <span className="xp-entry-avatar" aria-hidden="true" />
            <span className="xp-entry-identity">
              <span className="xp-entry-name">Tiago Miranda</span>
              <span className="xp-entry-role">Project Designer</span>
            </span>
          </button>
        </div>
      </section>
      <footer className="xp-entry-bottom">
        <button className="xp-entry-restart" onClick={restart}>
          <img src="/assets/xp/restart.webp" width="32" height="32" alt="" />
          <span>Reiniciar Portfólio Miranda</span>
        </button>
        <p className="xp-entry-note">
          <span>
            Depois de entrar, explore meus projetos e conheça meu trabalho.
          </span>
          <span>Cada detalhe foi desenhado com intenção.</span>
        </p>
      </footer>
      <span className="sr-only" role="status" key={resetVersion}>
        {resetVersion > 0
          ? "Tela reiniciada. Selecione Tiago Miranda para entrar."
          : ""}
      </span>
    </main>
  );
}
