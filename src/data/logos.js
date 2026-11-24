// Logos das ferramentas que o Thiago usa (arquivos enviados por ele, em /public/assets/logos).
// Só entra aqui quem tem arquivo; o resto aparece apenas como texto.
const L = "/assets/logos";
const LOGOS = {
  codex: `${L}/codex.png`,
  figma: `${L}/figma.png`,
  photoshop: `${L}/photoshop.png`,
  illustrator: `${L}/illustrator.png`,
  claude: `${L}/claude.png`,
  "claude code": `${L}/claude.png`,
  cursor: `${L}/cursor.png`,
  shopify: `${L}/shopify.png`,
  "vs code": `${L}/vscode.png`,
  "framer ai": `${L}/framer.png`,
  framer: `${L}/framer.png`,
};
export const logoDe = (nome) => LOGOS[String(nome).toLowerCase()] || null;
