import { useEffect, useRef } from "react";
import SoundToggle from "../components/SoundToggle";

export default function XPGreeting({
  onContinue,
  soundEnabled,
  onToggleSound,
  audioBlocked,
  onRetrySound,
}) {
  const titleRef = useRef(null);
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="xp-entry xp-greeting" aria-labelledby="xp-greeting-title">
      <div className="xp-entry-top" aria-hidden="true" />
      <section className="xp-entry-center xp-greeting-center">
        <h1 id="xp-greeting-title" ref={titleRef} tabIndex={-1}>
          Bem-vindo
        </h1>
      </section>
      <footer className="xp-entry-bottom">
        <div className="xp-entry-footer-actions">
          <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
          {audioBlocked && soundEnabled && (
            <button className="xp-entry-restart" onClick={onRetrySound}>
              Tocar som
            </button>
          )}
        </div>
        <button className="xp-entry-restart" onClick={onContinue}>
          Ir para o portfólio →
        </button>
      </footer>
    </main>
  );
}
