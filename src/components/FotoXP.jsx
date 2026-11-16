/**
 * Foto com efeito de carregamento do Windows XP: a imagem aparece em faixas,
 * de cima para baixo, com uma linha de varredura na frente.
 * Para repetir o efeito, troque a `key` do componente.
 */
export default function FotoXP({ src, alt = "", largura, altura, aoErro, atraso = 0 }) {
  return (
    <span className="foto-xp" style={{ "--foto-atraso": `${atraso}ms` }}>
      <img src={src} alt={alt} width={largura} height={altura} onError={aoErro} draggable="false" />
    </span>
  );
}
