import { useState } from "react";
import { Menu, X } from "lucide-react";
export default function Header({ mode, setMode }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <a className="brand" href="/">
        MIRANDA<span className="brand-star">✳</span>
        <span className="brand-edition">portfolio edition</span>
      </a>
      <nav
        id="main-navigation"
        className={`nav ${open ? "open" : ""}`}
        aria-label="Navegação principal"
      >
        {[
          ["cases", "Cases"],
          ["playground", "Playground"],
          ["sobre", "Sobre"],
          ["contato", "Contato"],
        ].map(([id, label]) => (
          <a key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <div className="mode-switch" role="group" aria-label="Modo visual">
          {[
            ["rapido", "Rápido"],
            ["noite", "Noite"],
            ["xp", "XP"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`mode ${id === mode ? "active" : ""}`}
              onClick={() => setMode(id)}
              aria-pressed={id === mode}
            >
              {label}
            </button>
          ))}
        </div>
        <span
          className="cv-unavailable"
          title="O currículo revisado ainda não foi anexado"
        >
          CV em breve
        </span>
        <button
          className="mobile-menu"
          aria-controls="main-navigation"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
