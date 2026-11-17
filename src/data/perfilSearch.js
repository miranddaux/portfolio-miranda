import { ADICIONAL, CERTIFICACOES, CONTATO, EDUCACAO, EXPERIENCIAS, FERRAMENTAS, HABILIDADES, LINGUAS } from "./perfil.js";
import { REDES_SOCIAIS } from "./social.js";

export const ABAS_PERFIL = [
  { id: "sobre", nome: "Sobre", endereco: "Sobre mim" },
  { id: "experiencia", nome: "Experiência", endereco: "Experiência" },
  { id: "educacao", nome: "Educação", endereco: "Educação" },
  { id: "habilidades", nome: "Habilidades", endereco: "Habilidades" },
  { id: "projetos", nome: "Projetos", endereco: "Projetos" },
  { id: "contato", nome: "Contato", endereco: "Entre em contato" },
];

export const BIO_PERFIL = "Sou Product Designer em São José do Rio Preto. De dia, desenho e-commerces na Shopify pela Agência Disco. À noite, crio pequenos projetos na interseção entre design e código.";
export const RESUMO_PROJETOS = "ANIMAE, Navaja e Oficina do Tenista: produto próprio, aplicativo e e-commerce, com contexto, decisões e interfaces.";

const experiencias = (itens, prefixo) => itens.map((item, i) => ({
  id: `perfil-${prefixo}-${i}`,
  aba: "experiencia",
  titulo: item.cargo,
  texto: `${item.empresa} · ${item.periodo}. ${item.texto}`,
}));
const formacoes = (itens, prefixo) => itens.map((item, i) => ({
  id: `perfil-${prefixo}-${i}`,
  aba: "educacao",
  titulo: item.instituicao,
  texto: `${item.curso} · ${item.periodo}`,
}));

// O índice reutiliza os dados exibidos no perfil, sem uma segunda cópia editorial.
const INDICE = [
  { id: "perfil-sobre", aba: "sobre", titulo: "Thiago Miranda · Product Designer pleno", texto: BIO_PERFIL },
  ...experiencias(EXPERIENCIAS, "experiencia"),
  ...experiencias(ADICIONAL, "adicional"),
  ...formacoes(EDUCACAO, "educacao"),
  ...formacoes(CERTIFICACOES, "certificacao"),
  ...HABILIDADES.map((item, i) => ({ id: `perfil-habilidade-${i}`, aba: "habilidades", titulo: item.nome, texto: "Habilidades" })),
  { id: "perfil-ferramentas", aba: "habilidades", titulo: "Ferramentas", texto: FERRAMENTAS.join(" · ") },
  { id: "perfil-linguas", aba: "habilidades", titulo: "Línguas", texto: LINGUAS.join(" · ") },
  { id: "perfil-projetos", aba: "projetos", titulo: "Projetos", texto: RESUMO_PROJETOS },
  { id: "perfil-contato", aba: "contato", titulo: "Entre em contato", texto: `${Object.values(CONTATO).join(" · ")} · ${Object.values(REDES_SOCIAIS).map((r) => r.nome).join(" · ")}` },
];

const normalizar = (texto) => texto.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("pt-BR");

export function buscarNoPerfil(consulta) {
  const equivalentes = { formacao: "educacao", mentoria: "mentor", idiomas: "linguas" };
  const termos = normalizar(consulta).trim().split(/\s+/).filter(Boolean).map((termo) => equivalentes[termo] || termo);
  if (!termos.length) return [];
  return INDICE.filter((item) => {
    const aba = ABAS_PERFIL.find((a) => a.id === item.aba);
    const conteudo = normalizar(`${aba.nome} ${item.titulo} ${item.texto}`);
    return termos.every((termo) => conteudo.includes(termo));
  });
}

export function abaVizinha(aba, direcao) {
  const i = ABAS_PERFIL.findIndex((a) => a.id === aba);
  return ABAS_PERFIL[Math.max(0, Math.min(ABAS_PERFIL.length - 1, i + direcao))].id;
}
