// Recado no lugar dos jogos que dependem de teclado (DOOM e Pinball) quando
// a pessoa está no celular: evita carregar o motor do jogo à toa.
export default function AvisoSoDesktop({ nome, icone }) {
  return (
    <div className="so-desktop">
      {icone && <img src={icone} alt="" width="48" height="48" />}
      <h2>{nome}</h2>
      <p>Não disponível na versão mobile, por enquanto.</p>
    </div>
  );
}
