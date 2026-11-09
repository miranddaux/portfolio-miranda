import { useRef, useState } from "react";
import SoundToggle from "../components/SoundToggle";

/** A welcome screen only; entering never asks for credentials. */
export default function XPWelcome({ onEnter, soundEnabled, onToggleSound }) {
  const profileRef = useRef(null);
  const [resetVersion, setResetVersion] = useState(0);

  function restart() {
    setResetVersion((version) => version + 1);
    profileRef.current?.focus();
  }

  return (
    <main className="xp-entry" aria-labelledby="xp-entry-title">
      <h1 id="xp-entry-title" className="sr-only">
        Portfólio de Thiago Miranda — Product Designer
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
            src="/assets/xp/thiago-miranda-xp.png"
            width="1620"
            height="971"
            alt="Thiago Miranda XP · Product Designer"
            fetchPriority="high"
            draggable="false"
          />
          <p>Para começar, clique em Thiago Miranda para fazer login.</p>
        </div>
        <div className="xp-entry-account">
          <button
            ref={profileRef}
            className="xp-entry-profile"
            onClick={onEnter}
            aria-label="Entrar no portfólio de Thiago Miranda, Product Designer"
          >
            <span className="xp-entry-avatar" aria-hidden="true" />
            <span className="xp-entry-identity">
              <span className="xp-entry-name">Thiago Miranda</span>
              <span className="xp-entry-role">Product Designer</span>
            </span>
          </button>
        </div>
      </section>
      <footer className="xp-entry-bottom">
        <div className="xp-entry-footer-actions">
          <button className="xp-entry-restart" onClick={restart}>
            <img src="/assets/xp/restart.webp" width="32" height="32" alt="" />
            <span>Reiniciar Portfólio Miranda</span>
          </button>
          <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        </div>
        <p className="xp-entry-note">
          <span>
            Depois de entrar, explore meus projetos e conheça meu trabalho.
          </span>
        </p>
      </footer>
      <span className="sr-only" role="status" key={resetVersion}>
        {resetVersion > 0
          ? "Tela reiniciada. Selecione Thiago Miranda para entrar."
          : ""}
      </span>
    </main>
  );
}
