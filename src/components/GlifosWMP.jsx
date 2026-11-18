// Glifos próprios (SVG) no estilo do Windows Media Player do XP: azul-marinho com brilho branco embaixo.
// Nada de biblioteca de ícones.
const Base = ({ children, id }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="wmp-glifo">
    <defs>
      <linearGradient id={`wmp-g-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a63c4" />
        <stop offset="1" stopColor="#0c2a80" />
      </linearGradient>
    </defs>
    <g transform="translate(0 1)" fill="#fff" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" opacity="0.85">{children}</g>
    <g fill={`url(#wmp-g-${id})`} stroke="#0c2a80" strokeWidth="1" strokeLinejoin="round">{children}</g>
  </svg>
);

export const GlifoPlay = () => <Base id="play"><path d="M11 7 L25 16 L11 25 Z" /></Base>;
export const GlifoPause = () => <Base id="pause"><rect x="9" y="7" width="5" height="18" rx="1" /><rect x="18" y="7" width="5" height="18" rx="1" /></Base>;
export const GlifoStop = () => <Base id="stop"><rect x="8" y="8" width="16" height="16" rx="1.5" /></Base>;
export const GlifoAnterior = () => <Base id="prev"><rect x="7" y="8" width="3.5" height="16" rx="1" /><path d="M25 8 L12 16 L25 24 Z" /></Base>;
export const GlifoProximo = () => <Base id="next"><rect x="21.5" y="8" width="3.5" height="16" rx="1" /><path d="M7 8 L20 16 L7 24 Z" /></Base>;
export const GlifoVolume = ({ mudo }) => (
  <Base id={mudo ? "mute" : "vol"}>
    <path d="M6 12 H11 L17 7 V25 L11 20 H6 Z" />
    {mudo ? <path d="M21 12 L27 20 M27 12 L21 20" fill="none" strokeWidth="2.4" strokeLinecap="round" /> : <path d="M21 11 Q25 16 21 21" fill="none" strokeWidth="2.4" strokeLinecap="round" />}
  </Base>
);
