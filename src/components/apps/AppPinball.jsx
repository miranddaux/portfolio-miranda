// Pinball: jogo de terceiros (98.js.org, Space Cadet) aberto dentro da janela.
const URL_JOGO = "https://98.js.org/programs/pinball/space-cadet.html";
export default function AppPinball() {
  return (
    <div className="app-embed">
      <iframe title="3D Pinball Space Cadet" src={URL_JOGO} loading="lazy" allow="autoplay; fullscreen" />
      <div className="app-embed-status">
        <span>Clique no jogo e use Z, / e Espaço.</span>
        <a href={URL_JOGO} target="_blank" rel="noopener noreferrer">Não carregou? Abrir em nova aba<span className="sr-only"> (abre em nova aba)</span></a>
      </div>
    </div>
  );
}
