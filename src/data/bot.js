// Respostas prontas do Thiago Bot (sem IA de verdade: procura palavras-chave na pergunta).
// Só usar fatos confirmados pelo Thiago. Nada de números ou promessas inventadas.

export const SUGESTOES = [
  { rotulo: "Quem é o Thiago?", pergunta: "Quem é o Thiago?" },
  { rotulo: "Experiência", pergunta: "Qual a experiência dele?" },
  { rotulo: "Projetos", pergunta: "Quero ver os projetos" },
  { rotulo: "Ferramentas", pergunta: "Quais ferramentas ele usa?" },
  { rotulo: "Currículo", pergunta: "Posso ver o currículo?" },
  { rotulo: "Contato", pergunta: "Como falo com ele?" },
];

export const BOAS_VINDAS = [
  "Oi! :) Eu sou o Thiago Bot, o assistente do Thiago aqui no portfólio.",
  "Pode perguntar sobre experiência, projetos, ferramentas, currículo ou contato. Ou escolha um assunto abaixo.",
];

const INTENCOES = [
  {
    saudacao: true,
    chaves: ["oi", "ola", "eai", "e ai", "opa", "bom dia", "boa tarde", "boa noite", "hello", "hi"],
    respostas: ["Oi! Tudo certo? Me pergunte sobre o Thiago: experiência, projetos, ferramentas, currículo ou contato."],
  },
  {
    chaves: ["quem", "sobre", "apresent", "thiago", "ele e", "voce e"],
    respostas: [
      "O Thiago é Product Designer em São José do Rio Preto, SP.",
      "Ele desenha e-commerces na Shopify pela Agência Disco e nas horas vagas cria o ANIMAE, onde design e código se encontram.",
    ],
    acao: { rotulo: "Abrir Sobre mim", abrir: "sobre" },
  },
  {
    chaves: ["experien", "trabalh", "disco", "empresa", "carreira", "anos", "historico"],
    respostas: [
      "São 6 anos de design.",
      "Hoje ele é Product Designer na Agência Disco e desenha e-commerces em Shopify do briefing ao handoff, com design systems no Figma.",
    ],
    acao: { rotulo: "Ver currículo", abrir: "curriculo" },
  },
  {
    chaves: ["dribbble", "behance", "dribble"],
    respostas: ["Os trabalhos visuais do Thiago estão no Dribbble (dribbble.com/thiagouidesign) e no Behance (behance.net/thiagomiranda38). (*)"],
    acao: { rotulo: "Abrir Dribbble", link: "https://dribbble.com/thiagouidesign" },
  },
  {
    chaves: ["projet", "case", "portfolio", "trabalhos", "navaja", "oficina", "tenista", "ultragrip"],
    respostas: ["Os destaques são ANIMAE, Navaja e Oficina do Tenista. Cada case mostra o contexto, as decisões e o resultado."],
    acao: { rotulo: "Abrir Meus projetos", abrir: "cases" },
  },
  {
    chaves: ["animae", "anime", "app"],
    respostas: ["O ANIMAE é o app próprio do Thiago, para quem acompanha anime. Ele cuida de discovery, UX, UI e design system, e constrói o front-end com apoio de IA."],
    acao: { rotulo: "Abrir Meus projetos", abrir: "cases" },
  },
  {
    chaves: ["ferrament", "figma", "framer", "adobe", "software", "programa", "tools", "usa"],
    respostas: ["No dia a dia: Figma, Framer, Adobe CC e Shopify. Para levar o design ao código: VS Code, Claude Code e Codex."],
  },
  {
    chaves: ["habilidade", "skill", "design system", "ui", "ux", "especial", "forte"],
    respostas: ["As principais habilidades: estratégia de UX, UI e visual design, design systems, front-end, e-commerce em Shopify, pensamento crítico e acessibilidade."],
  },
  {
    chaves: ["codigo", "codar", "front", "react", "css", "html", "program", "dev"],
    respostas: ["Ele gosta de levar o desenho até o código: React e CSS, com apoio de IA (Claude Code e Codex). Este portfólio foi feito assim."],
  },
  {
    chaves: ["curriculo", "cv", "resume", "pdf"],
    respostas: ["Claro! O currículo tem versão em português e em inglês, e dá para baixar em PDF."],
    acao: { rotulo: "Abrir Meu currículo", abrir: "curriculo" },
  },
  {
    chaves: ["contato", "email", "e-mail", "linkedin", "whatsapp", "telefone", "falar", "chamar", "conversar", "vaga", "proposta", "contrat"],
    respostas: [
      "O jeito mais rápido é pelo LinkedIn: linkedin.com/in/thiagomirandaui.",
      "Ou por e-mail: contato.thiagohmiranda@gmail.com.",
    ],
    acao: { rotulo: "Abrir Contato", abrir: "contato" },
  },
  {
    chaves: ["formacao", "faculdade", "curso", "certific", "estud", "unip", "fiap"],
    respostas: ["Ele é tecnólogo em Design Gráfico pela UNIP e tem certificações em UX (FIAP), Psicologia aplicada em UX e UI design no Figma."],
  },
  {
    chaves: ["ingles", "idioma", "lingua", "english"],
    respostas: ["Português nativo e inglês básico, que ele estuda toda semana."],
  },
  {
    chaves: ["onde", "mora", "cidade", "local"],
    respostas: ["Ele mora em São José do Rio Preto, SP, e trabalha remoto."],
  },
  {
    chaves: ["obrigad", "valeu", "vlw", "thanks", "brigad"],
    respostas: ["Valeu pela visita! Se quiser falar com o Thiago, é só chamar no LinkedIn."],
  },
  {
    chaves: ["tchau", "ate mais", "falou", "bye"],
    respostas: ["Até mais! Volte sempre. 👋"],
  },
  {
    chaves: ["robo", "bot", "ia", "inteligencia"],
    respostas: ["Eu sou um robozinho simples, à moda do Windows XP: respondo com frases prontas que o Thiago escreveu. Sem IA de verdade aqui. 🤖"],
  },
];

const PADRAO = {
  padrao: true,
  respostas: ["Ainda não sei responder isso. 😅 Tente: experiência, projetos, ferramentas, currículo ou contato."],
};

const normalizar = (t) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ");

export function responder(texto) {
  const t = ` ${normalizar(texto)} `;
  let melhor = null;
  let pontos = 0;
  for (const intencao of INTENCOES) {
    const p = intencao.chaves.filter((c) => {
      const chave = normalizar(c);
      // palavras curtas precisam bater inteiras ("oi", "ui", "ia")
      return chave.length <= 3 ? t.includes(` ${chave} `) : t.includes(chave);
    }).length;
    if (p > pontos && !(intencao.saudacao && melhor)) {
      pontos = p;
      melhor = intencao;
    }
  }
  // Saudação só vence quando nenhum outro assunto foi encontrado.
  const outro = INTENCOES.filter((i) => !i.saudacao).some((i) =>
    i.chaves.some((c) => {
      const chave = normalizar(c);
      return chave.length <= 3 ? t.includes(` ${chave} `) : t.includes(chave);
    }),
  );
  if (melhor?.saudacao && outro) {
    return INTENCOES.filter((i) => !i.saudacao).reduce(
      (a, i) => {
        const p = i.chaves.filter((c) => {
          const chave = normalizar(c);
          return chave.length <= 3 ? t.includes(` ${chave} `) : t.includes(chave);
        }).length;
        return p > a.p ? { p, i } : a;
      },
      { p: 0, i: PADRAO },
    ).i;
  }
  return melhor || PADRAO;
}
