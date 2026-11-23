import { useEffect, useRef, useState } from 'react';
import '../../styles/purble-place.css';

const JOGO = 'https://turbowarp.org/1071815115/embed?autoplay&interpolate';
const FONTE = 'https://scratch.mit.edu/projects/1071815115/';

export default function AppPurblePlace() {
  const [partida, setPartida] = useState(0);
  const [demorou, setDemorou] = useState(false);
  const tela = useRef(null);
  const espera = useRef(null);
  useEffect(() => {
    if (!partida) return;
    setDemorou(false);
    espera.current = setTimeout(() => setDemorou(true), 20000);
    return () => clearTimeout(espera.current);
  }, [partida]);
  return <section className="purble-app" aria-label="Purble Place">
    <div className="purble-toolbar" role="toolbar" aria-label="Controles do jogo">
      <button className="xp-button" onClick={() => setPartida(n => n + 1)}>{partida ? 'Reiniciar jogo' : 'Jogar'}</button>
      {partida > 0 && <button className="xp-button" onClick={() => setPartida(0)}>Parar</button>}
      <button className="xp-button" onClick={() => tela.current?.requestFullscreen?.().catch(() => {})} disabled={!partida}>Tela cheia</button>
    </div>
    <div className="purble-stage" ref={tela}>
      {partida ? <iframe key={partida} title="Purble Place — recriação de DipsyNugget" src={JOGO} onLoad={() => { clearTimeout(espera.current); setDemorou(false); }} onError={() => setDemorou(true)} allow="autoplay; fullscreen" allowFullScreen sandbox="allow-scripts allow-same-origin allow-pointer-lock" referrerPolicy="no-referrer" /> : <div className="purble-intro">
        <img src="/assets/xp/apps/purble-place.svg" width="64" height="64" alt="" />
        <h2>Purble Place</h2>
        <p>Uma cidade, três jogos: combine pares, prepare bolos e descubra personagens.</p>
        <button className="xp-button" onClick={() => setPartida(1)}>Jogar Purble Place</button>
        <p className="purble-help">Use o mouse para escolher um prédio. A bandeira verde reinicia a partida.</p>
      </div>}
    </div>
    <footer className="purble-credit">
      <span>Recriação por <a href={FONTE} target="_blank" rel="noopener noreferrer">DipsyNugget no Scratch</a> · Player TurboWarp</span>
      {partida > 0 && <a href={JOGO} target="_blank" rel="noopener noreferrer">Abrir jogo em outra aba</a>}
      {partida > 0 && demorou && <span className="purble-help">Se o jogo não aparecer, tente reiniciar ou abrir em outra aba.</span>}
    </footer>
  </section>;
}
