// Rota atual do site. Na prévia (arquivo único publicado como artifact), a página é servida
// em um endereço que não é "/" — então qualquer caminho fora de /cases/ conta como a Home.
// Ative com VITE_PREVIA=1 no build da prévia. No site de verdade nada muda.
export const PREVIA = import.meta.env.VITE_PREVIA === "1";

export function rota() {
  const p = location.pathname.replace(/\/$/, "") || "/";
  if (PREVIA && !p.startsWith("/cases/")) return "/";
  return p;
}

export function irParaEntrada() {
  if (!PREVIA) {
    location.assign("/?entrada=1");
    return;
  }
  const u = new URL(location.href);
  u.searchParams.set("entrada", "1");
  u.hash = "";
  location.assign(u.toString());
}
