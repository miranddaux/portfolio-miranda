// Ícones do Menu Iniciar desenhados aqui (32 px, estilo XP). Provisórios onde não há arquivo do Thiago.
const Base = ({ children }) => (
  <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">{children}</svg>
);

export const IconeGameBoy = () => (
  <Base>
    <rect x="6" y="2" width="20" height="28" rx="3" fill="#7a4fc4" stroke="#3e2380" strokeWidth="1.5" />
    <rect x="9" y="5" width="14" height="11" rx="1.5" fill="#26301f" stroke="#1a2014" />
    <rect x="11" y="7" width="10" height="7" fill="#9bbc0f" />
    <path d="M10 22h6M13 19v6" stroke="#1c1030" strokeWidth="2" strokeLinecap="round" />
    <circle cx="21" cy="21" r="1.8" fill="#d6336c" />
    <circle cx="23.5" cy="24" r="1.8" fill="#d6336c" />
  </Base>
);
export const IconeGaleria3D = () => (
  <Base>
    <path d="M16 3l11 6v14l-11 6-11-6V9z" fill="#4fa3e8" stroke="#1a5aa6" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M16 3l11 6-11 6L5 9z" fill="#9ed0f7" />
    <path d="M16 15v14" stroke="#1a5aa6" strokeWidth="1.5" />
    <path d="M27 9l-11 6v14l11-6z" fill="#2f7fd0" />
  </Base>
);
export const IconeJogo = () => (
  <Base>
    <path d="M16 2l11 4v9c0 7-5 12-11 15C10 27 5 22 5 15V6z" fill="#8a1c1c" stroke="#e8b923" strokeWidth="2" strokeLinejoin="round" />
    <path d="M10 10l3 10 3-6 3 6 3-10" fill="none" stroke="#f3d36b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Base>
);
export const IconeBloco = () => (
  <Base>
    <rect x="6" y="4" width="20" height="25" rx="2" fill="#fff" stroke="#4a7bc8" strokeWidth="1.5" />
    <rect x="6" y="4" width="20" height="5" fill="#6c9be0" />
    <path d="M10 14h12M10 18h12M10 22h8" stroke="#8aa4cf" strokeWidth="1.5" strokeLinecap="round" />
    {[10, 14, 18, 22].map((x) => <circle key={x} cx={x} cy="4" r="1.5" fill="#26467f" />)}
  </Base>
);
export const IconePrompt = () => (
  <Base>
    <rect x="3" y="5" width="26" height="22" rx="2" fill="#0b0b0f" stroke="#7d8696" strokeWidth="1.5" />
    <rect x="3" y="5" width="26" height="4" fill="#4b5668" />
    <text x="7" y="21" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#e6e6e6">C:\</text>
    <rect x="20" y="19" width="5" height="2" fill="#e6e6e6" />
  </Base>
);
export const SetaVerde = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
    <rect x="1" y="1" width="22" height="22" rx="4" fill="#3fae3a" stroke="#1f7a1c" strokeWidth="1.5" />
    <path d="M7 12h9m-4-5l5 5-5 5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
