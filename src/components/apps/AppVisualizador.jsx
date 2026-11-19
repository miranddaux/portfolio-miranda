import { useState } from "react";

const C = "/assets/cases";
// Telas e imagens que já estão nos cases. Legendas descrevem o que a imagem mostra.
const IMAGENS = [
  { src: `${C}/animae-home.webp`, legenda: "ANIMAE · Home com anime em destaque" },
  { src: `${C}/animae-hub.webp`, legenda: "ANIMAE · Página de um anime" },
  { src: `${C}/animae-lista.webp`, legenda: "ANIMAE · Minha Lista" },
  { src: `${C}/animae-feed-amigos.webp`, legenda: "ANIMAE · Feed de amigos" },
  { src: `${C}/animae-feed-comunidade.webp`, legenda: "ANIMAE · Feed da comunidade" },
  { src: `${C}/animae-perfil-xp.webp`, legenda: "ANIMAE · Perfil com XP e conquistas" },
  { src: `${C}/animae-quiz-draco.webp`, legenda: "ANIMAE · Quiz do Draco" },
  { src: `${C}/navaja-capa.png`, legenda: "Navaja · Sugestões de cortes" },
  { src: `${C}/navaja-estilos.png`, legenda: "Navaja · Catálogo de estilos" },
];

export default function AppVisualizador() {
  const [i, setI] = useState(0);
  const [real, setReal] = useState(false);
  const [medidas, setMedidas] = useState("");
  const atual = IMAGENS[i];
  const ir = (d) => { setI((n) => (n + d + IMAGENS.length) % IMAGENS.length); setMedidas(""); };
  return (
    <div className="app-viz">
      <div className="app-viz-endereco">
        <span>Endereço</span>
        <output>C:\Miranda\Imagens</output>
      </div>
      <div className={`app-viz-palco ${real ? "is-real" : ""}`} tabIndex={0} aria-label="Imagem atual">
        <img key={atual.src} src={atual.src} alt={atual.legenda} onLoad={(e) => setMedidas(`${e.currentTarget.naturalWidth} × ${e.currentTarget.naturalHeight}`)} />
      </div>
      <div className="app-viz-barra" role="toolbar" aria-label="Controles do visualizador">
        <button type="button" className="xp-button" onClick={() => ir(-1)}>Voltar</button>
        <button type="button" className="xp-button" onClick={() => ir(1)}>Avançar</button>
        <button type="button" className="xp-button" aria-pressed={real} onClick={() => setReal((v) => !v)}>
          {real ? "Ajustar" : "Tamanho real"}
        </button>
      </div>
      <div className="app-viz-status" aria-live="polite">
        <span>{atual.legenda}</span>
        <span>{i + 1} de {IMAGENS.length}{medidas && ` · ${medidas}`}</span>
      </div>
    </div>
  );
}
