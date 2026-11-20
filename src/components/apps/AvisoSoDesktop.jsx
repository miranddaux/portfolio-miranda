// Recado no lugar dos jogos que dependem de teclado (DOOM e Pinball) quando
// a pessoa está no celular: evita carregar o motor do jogo à toa.
export default function AvisoSoDesktop({ nome, icone, texto }) {
  return (
    <div className="so-desktop">
      {icone && <img src={icone} alt="" width="48" height="48" />}
      <h2>{nome} roda no computador</h2>
      <p>{texto}</p>
      <p className="so-desktop-dica">
        Abra o portfólio em um computador para jogar. Por aqui, siga pelos projetos e pelo perfil —
        é o que importa mesmo.
      </p>
    </div>
  );
}
