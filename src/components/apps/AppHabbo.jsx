// Habbo Hotel: o site oficial carrega dentro da janela. Login e jogo acontecem no próprio Habbo.
// Se o site bloquear a exibição em quadro, o link abaixo abre em nova aba.
const URL_HABBO = "https://www.habbo.com.br/";
export default function AppHabbo() {
  return (
    <div className="app-embed">
      <iframe title="Habbo Hotel" src={URL_HABBO} loading="lazy" allow="autoplay; fullscreen; clipboard-write" referrerPolicy="no-referrer-when-downgrade" />
      <div className="app-embed-status">
        <span>Site oficial do Habbo Hotel.</span>
        <a href={URL_HABBO} target="_blank" rel="noopener noreferrer">Não carregou? Abrir em nova aba<span className="sr-only"> (abre em nova aba)</span></a>
      </div>
    </div>
  );
}
