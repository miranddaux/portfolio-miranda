// Emoticons do MSN (Figma "MSN Assets" 144:5307, 40 imagens em public/assets/xp/msn/emoticons).
// Código digitado → imagem. Os códigos seguem os do MSN quando existiam.
export const EMOTICONS = [
  { n: 1, codigo: ":)", nome: "Sorriso" },
  { n: 2, codigo: ":D", nome: "Sorriso aberto" },
  { n: 3, codigo: ";)", nome: "Piscadela" },
  { n: 4, codigo: ":O", nome: "Surpreso" },
  { n: 5, codigo: ":P", nome: "Mostrando a língua" },
  { n: 6, codigo: "(H)", nome: "Descolado" },
  { n: 7, codigo: ":@", nome: "Bravo" },
  { n: 8, codigo: ":S", nome: "Confuso" },
  { n: 9, codigo: ":$", nome: "Envergonhado" },
  { n: 10, codigo: ":(", nome: "Triste" },
  { n: 11, codigo: ":'(", nome: "Chorando" },
  { n: 12, codigo: ":|", nome: "Decepcionado" },
  { n: 13, codigo: "8o|", nome: "Dentes cerrados" },
  { n: 14, codigo: "8-|", nome: "Nerd" },
  { n: 15, codigo: "<:o)", nome: "Festa" },
  { n: 16, codigo: "(e16)", nome: "Mago" },
  { n: 17, codigo: "|-)", nome: "Bocejo" },
  { n: 18, codigo: "+o(", nome: "Tonto" },
  { n: 19, codigo: ":-#", nome: "Boca fechada" },
  { n: 20, codigo: "*-)", nome: "Pensativo" },
  { n: 21, codigo: "^o)", nome: "Sarcástico" },
  { n: 22, codigo: "8-)", nome: "Olhando de lado" },
  { n: 23, codigo: "(L)", nome: "Coração" },
  { n: 24, codigo: "(U)", nome: "Coração partido" },
  { n: 25, codigo: "(D)", nome: "Drinque" },
  { n: 26, codigo: "(B)", nome: "Cerveja" },
  { n: 27, codigo: "(@)", nome: "Gato" },
  { n: 28, codigo: "(sn)", nome: "Caracol" },
  { n: 29, codigo: "(bah)", nome: "Ovelha" },
  { n: 30, codigo: "(S)", nome: "Lua" },
  { n: 31, codigo: "(*)", nome: "Estrela" },
  { n: 32, codigo: "(#)", nome: "Sol" },
  { n: 33, codigo: "(R)", nome: "Arco-íris" },
  { n: 34, codigo: "({)", nome: "Abraço (esquerda)" },
  { n: 35, codigo: "(})", nome: "Abraço (direita)" },
  { n: 36, codigo: "(K)", nome: "Beijo" },
  { n: 37, codigo: "(F)", nome: "Rosa" },
  { n: 38, codigo: "(W)", nome: "Rosa murcha" },
  { n: 39, codigo: "(I)", nome: "Ideia" },
  { n: 40, codigo: "(8)", nome: "Música" },
].map((e) => ({ ...e, src: `/assets/xp/msn/emoticons/${e.n}.png` }));

const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const porCodigo = new Map(EMOTICONS.map((e) => [e.codigo.toLowerCase(), e]));
// Códigos mais longos primeiro, para ":'(" não virar ":(".
const REGEX = new RegExp(
  [...EMOTICONS].sort((a, b) => b.codigo.length - a.codigo.length).map((e) => escapar(e.codigo)).join("|"),
  "gi",
);

// Divide o texto em partes: { texto } ou { emoticon }.
export function partesComEmoticons(texto) {
  const partes = [];
  let ultimo = 0;
  for (const m of texto.matchAll(REGEX)) {
    // Não troca códigos colados em letras/números (ex.: "http://", "Ex:Pedro").
    const antes = texto[m.index - 1];
    if (antes && /[\p{L}\p{N}/]/u.test(antes)) continue;
    if (m.index > ultimo) partes.push({ texto: texto.slice(ultimo, m.index) });
    partes.push({ emoticon: porCodigo.get(m[0].toLowerCase()) });
    ultimo = m.index + m[0].length;
  }
  if (ultimo < texto.length) partes.push({ texto: texto.slice(ultimo) });
  return partes;
}
