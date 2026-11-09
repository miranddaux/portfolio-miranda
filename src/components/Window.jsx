import { useState } from "react";
import RetroIcon from "./RetroIcon";

export default function Window({
  id,
  title,
  icon = "folder",
  children,
  onClose,
  onMinimize,
  className = "",
}) {
  const [maximized, setMaximized] = useState(false);
  return (
    <section
      className={`xp-window ${maximized ? "is-maximized" : ""} ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="xp-titlebar">
        <div className="xp-window-title">
          <RetroIcon name={icon} size={16} />
          <h2 id={`${id}-title`} tabIndex={-1}>
            {title}
          </h2>
        </div>
        <div className="xp-controls">
          {onMinimize && (
            <button onClick={onMinimize} aria-label={`Minimizar ${title}`}>
              <span aria-hidden="true">_</span>
            </button>
          )}
          <button
            aria-label={`${maximized ? "Restaurar" : "Maximizar"} ${title}`}
            aria-pressed={maximized}
            onClick={() => setMaximized(!maximized)}
          >
            <span aria-hidden="true">{maximized ? "❐" : "□"}</span>
          </button>
          {onClose && (
            <button
              className="xp-close"
              onClick={onClose}
              aria-label={`Fechar ${title}`}
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>
      <div className="xp-window-body">{children}</div>
    </section>
  );
}
