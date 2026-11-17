import useTelaCheia from "../hooks/useTelaCheia";

// Aviso discreto no canto inferior direito, no estilo da marca d'água "Ativar o Windows".
export default function AvisoTelaCheia() {
  const cheia = useTelaCheia();
  if (cheia) return null;
  return (
    <p className="aviso-tela-cheia">
      <strong>Tela cheia</strong>
      <span>Pressione F11 para ver o site em tela cheia</span>
    </p>
  );
}
