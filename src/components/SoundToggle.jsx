import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle({ enabled, onToggle, compact = false }) {
  const Icon = enabled ? Volume2 : VolumeX;
  return (
    <button
      className={`xp-sound-toggle ${compact ? "is-compact" : ""}`}
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Silenciar som de login" : "Ativar som de login"}
      title={enabled ? "Silenciar som de login" : "Ativar som de login"}
    >
      <Icon size={16} aria-hidden="true" />
      {!compact && <span>{enabled ? "Som ativado" : "Som desativado"}</span>}
    </button>
  );
}
