// Habbo Hotel: um jogo que o Thiago jogava. Não reproduz o login do site: só leva ao site oficial.
export default function AppHabbo() {
  return (
    <div className="app-habbo">
      <img className="app-habbo-logo" src="/assets/xp/apps/habbo-logo.png" alt="Habbo" width="160" />
      <h2 className="sr-only">Habbo Hotel</h2>
      <p>Um jogo que eu jogava.</p>
      <a className="xp-button" href="https://www.habbo.com.br/" target="_blank" rel="noopener noreferrer">
        Abrir habbo.com.br<span className="sr-only"> (abre em nova aba)</span>
      </a>
    </div>
  );
}
