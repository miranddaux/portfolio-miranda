// COPY OFICIAL do case ANIMAE (revisão de 20/11/2026). Texto, não mexer sem pedido do Thiago.
// Marcação inline: **negrito**.
export const ANIMAE_WEB_URL = "https://animae-plus-main.vercel.app/";

const IMG = {
  home: { src: "/assets/cases/animae-home.webp", width: 860, height: 1864, alt: "Home do ANIMAE com anime em destaque, botões Adicionar e Onde assistir, e amigos online" },
  hub: { src: "/assets/cases/animae-hub.webp", width: 860, height: 1864, alt: "Página de um anime no ANIMAE com onde assistir, botão de adicionar à lista e progresso de episódios" },
  lista: { src: "/assets/cases/animae-lista.webp", width: 860, height: 1864, alt: "Minha Lista com filtros de acompanhamento e progresso dos episódios" },
  feedAmigos: { src: "/assets/cases/animae-feed-amigos.webp", width: 860, height: 1864, alt: "Feed de amigos do ANIMAE com atividade de conclusão de um anime, reações e comentários" },
  feedComunidade: { src: "/assets/cases/animae-feed-comunidade.webp", width: 860, height: 1864, alt: "Feed da comunidade do ANIMAE com debate aberto e ranking de animes da semana" },
  perfil: { src: "/assets/cases/animae-perfil-xp.webp", width: 860, height: 1864, alt: "Perfil do ANIMAE com nível, XP, sequência de dias e conquistas" },
  quiz: { src: "/assets/cases/animae-quiz-draco.webp", width: 860, height: 1864, alt: "Quiz do Draco com pergunta, barra de tempo, vidas e quatro opções de resposta" },
  onb: { src: "/assets/cases/animae-flow-onb-1.webp", width: 860, height: 1864, alt: "Onboarding 1: Seu universo otaku do seu jeito", caption: "Universo otaku" },
  login: { src: "/assets/cases/animae-login.webp", width: 860, height: 1864, alt: "Login com e-mail, senha, Criar conta, Entrar no fandom e login social", caption: "Login" },
  generos: { src: "/assets/cases/animae-generos.webp", width: 860, height: 1864, alt: "Cadastro: O que você curte, com gêneros para escolher", caption: "Gêneros" },
  streaming: { src: "/assets/cases/animae-flow-streaming.webp", width: 860, height: 1864, alt: "Cadastro: Onde você assiste, com lista de serviços de streaming", caption: "Onde assiste" },
};

export const ANIMAE_COPY = {
  h1: "ANIMAE — Aplicativo social de anime",
  tags: ["Aplicativo social", "Mobile", "Web", "Produto próprio"],
  tagline: "Do streaming à comunidade: um espaço para acompanhar animes, descobrir novas histórias e se conectar com outros fãs.",
  intro: "O ANIMAE é um produto que idealizei e construí sozinho, unindo Product Design, UX/UI, identidade visual, Design System e desenvolvimento com apoio de inteligência artificial.",
  ctaWeb: "Explorar versão web",
  ctaPrototype: "Ver protótipo no Figma",
  overview: [
    ["Função", ["Product Designer", "UX/UI Design", "Desenvolvimento"]],
    ["Ferramentas", ["Figma", "Illustrator", "React Native", "Expo", "Supabase", "Vercel", "APIs AniList e Jikan"]],
  ],
  period: "out/2025 — atual",
  status: "versão web funcional e aplicativo Android preparado para teste fechado, conforme a versão documentada do projeto.",
  sections: [
    {
      id: "visao-geral", title: "Visão geral",
      blocks: [
        { type: "h3", text: "Uma experiência que continua depois do episódio" },
        { type: "p", text: "A proposta do ANIMAE é reunir em um mesmo lugar a descoberta de animes, o acompanhamento de episódios e a interação entre fãs." },
        { type: "p", text: "O usuário pode organizar sua lista, acompanhar o progresso, descobrir o que outros usuários estão assistindo e participar de atividades dentro da comunidade." },
        { type: "p", text: "A ideia é simples: fazer com que assistir a um anime seja o começo de uma experiência que também envolve acompanhar, descobrir e compartilhar." },
        { type: "trio", label: "Home, Minha Lista e Perfil do ANIMAE", images: [{ ...IMG.home, demo: "home" }, { ...IMG.lista, demo: "lista" }, IMG.perfil] },
      ],
    },
    {
      id: "problema", title: "O problema e a mudança de direção",
      blocks: [
        { type: "h3", text: "Como aproximar descoberta, acompanhamento e comunidade sem depender de um streaming próprio?" },
        { type: "p", text: "Eu sentia falta de um espaço que reunisse três coisas: descobrir animes, acompanhar o que estou assistindo e trocar ideias com outros usuários que gostam das mesmas histórias." },
        { type: "p", text: "No começo, tentei resolver isso criando o ANIMAE+, uma plataforma de streaming social, com catálogo, player próprio e salas para assistir junto." },
        { type: "p", text: "Cheguei a desenhar esses fluxos e interfaces, incluindo o CinéRoom, uma proposta de sala compartilhada." },
        { type: "p", text: "Mas, estudando melhor o projeto, percebi que manter um catálogo próprio envolveria licenças, custos e uma estrutura que não seriam viáveis para alguém construindo tudo sozinho." },
        { type: "p", text: "Foi aí que comecei a repensar a proposta." },
        { type: "p", text: "**Em vez de criar mais um lugar para assistir anime, por que não criar um espaço onde a experiência continuasse depois do episódio?**" },
        { type: "p", text: "Deixei o streaming de lado e passei a focar em acompanhamento, descoberta e comunidade." },
        { type: "p", text: "Essa foi a decisão que mudou o rumo do ANIMAE e ajudou a definir o que realmente fazia sentido construir." },
      ],
    },
    {
      id: "pesquisa", title: "Pesquisa e descoberta",
      blocks: [
        { type: "h3", text: "O que os relatos de outros fãs mostravam?" },
        { type: "p", text: "Antes de avançar nas novas interfaces, procurei entender como os usuários utilizavam aplicativos de acompanhamento de anime e o que comentavam sobre essas experiências." },
        { type: "p", text: "Analisei fontes públicas, avaliações e relatos de usuários de produtos existentes." },
        { type: "p", text: "Entre os pontos que apareceram estavam interfaces carregadas, experiências de comunidade pouco integradas ao acompanhamento e limitações de personalização." },
        { type: "p", text: "Esses relatos ajudaram a orientar as primeiras hipóteses do ANIMAE." },
        { type: "p", text: "Mas é importante deixar claro: **foi uma pesquisa de mesa, não uma pesquisa com entrevistas ou testes de usabilidade.**" },
        { type: "p", text: "Por isso, as oportunidades identificadas ainda precisam ser validadas com usuários utilizando o produto." },
        { type: "facts", items: [
          ["Método", "pesquisa de mesa e análise de relatos públicos."],
          ["Oportunidade", "aproximar acompanhamento, descoberta e interação entre fãs."],
          ["Limitação", "hipóteses ainda sem validação estruturada com usuários."],
        ] },
      ],
    },
    {
      id: "decisoes", title: "Decisões de produto",
      blocks: [
        { type: "decision", n: "01", h3: "Comunidade em vez de streaming", blocks: [
          { type: "p", text: "Retirei o player e as salas para assistir junto. Concentrei o produto em descoberta, lista pessoal e interação, indicando onde assistir nas plataformas disponíveis." },
          { type: "p", text: "**Por quê:** tornar o escopo viável para um projeto solo, sem manter um catálogo próprio de streaming." },
          { type: "p", text: "**A troca:** abrir mão da principal funcionalidade da proposta original." },
        ] },
        { type: "decision", n: "02", h3: "Explorar antes de criar uma conta", blocks: [
          { type: "p", text: "Deixei a home e o catálogo acessíveis como visitante, para que o cadastro não fosse a primeira barreira para conhecer o aplicativo." },
          { type: "p", text: "**A hipótese:** conhecer a proposta na prática pode ajudar o usuário a decidir se quer criar seu perfil. Ainda preciso validar isso com usuários." },
          { type: "p", text: "**A troca:** menos personalização no primeiro acesso, mas uma entrada com menos etapas." },
        ] },
        { type: "decision", n: "03", h3: "Gamificação com regras no servidor", blocks: [
          { type: "p", text: "Transformei episódios registrados e acertos no quiz em XP, com níveis, sequências de dias e conquistas no perfil para dar visibilidade ao progresso." },
          { type: "p", text: "**Por quê no servidor:** manter o cálculo da pontuação fora do aparelho e evitar alterações diretas pelo aplicativo." },
          { type: "p", text: "**A troca:** mais complexidade técnica em favor de regras de progressão mais consistentes." },
        ] },
        { type: "decision", n: "04", h3: "Criar valor antes de a comunidade crescer", blocks: [
          { type: "p", text: "Criei o Quiz do Draco: perguntas sobre anime com tempo, vidas e pontuação. Assim, existe uma atividade individual mesmo enquanto a comunidade ainda está começando." },
          { type: "p", text: "**A hipótese:** oferecer valor antes de existir um feed ativo. O efeito na retenção ainda precisa ser medido." },
          { type: "p", text: "**A troca:** o quiz cria uma atividade independente da quantidade de usuários no feed, mas não substitui as interações reais entre os fãs." },
        ] },
      ],
    },
    {
      id: "ux-ui-ds", title: "UX/UI, prototipação e Design System",
      blocks: [
        { type: "h3", text: "Do Figma ao aplicativo funcional" },
        { type: "p", text: "Comecei organizando a jornada, os fluxos e os wireframes antes de desenvolver as interfaces finais." },
        { type: "p", text: "Como o ANIMAE é um projeto solo, também precisei pensar no que acontece depois do design." },
        { type: "p", text: "Estruturei componentes, variáveis e tokens no Figma para manter uma linguagem visual consistente e aproximar as decisões de interface da implementação." },
        { type: "p", text: "O aplicativo foi desenvolvido com React Native e Expo, utiliza Supabase no back-end e possui uma versão web hospedada na Vercel." },
        { type: "p", text: "O desenvolvimento contou com apoio de IA, enquanto continuei responsável pelas decisões de produto, interface e direção visual." },
        { type: "h3", text: "Jornada principal do usuário" },
        { type: "journey", items: ["Explorar e descobrir animes", "Adicionar títulos à lista pessoal", "Registrar o progresso dos episódios", "Interagir com outros usuários da comunidade"] },
      ],
    },
    {
      id: "solucao", title: "A solução: como o ANIMAE funciona",
      blocks: [
        { type: "item", h3: "Descoberta de animes", images: [{ ...IMG.home, demo: "home" }, IMG.hub], blocks: [
          { type: "p", text: "A home utiliza um banner rotativo para apresentar títulos em destaque." },
          { type: "p", text: "Os dados do catálogo vêm de APIs públicas. Comecei utilizando a AniList e depois adicionei a Jikan para complementar as informações disponíveis." },
          { type: "p", text: "Da home, o usuário pode acessar a página de cada anime, consultar seus detalhes, acompanhar o progresso e encontrar indicações de onde assistir." },
          { type: "p", text: "A exploração inicial do catálogo também está disponível antes do cadastro." },
        ] },
        { type: "item", h3: "Minha Lista: acompanhar cada episódio", images: [{ ...IMG.lista, demo: "lista" }], blocks: [
          { type: "p", text: "Organizei os animes em três grupos principais:" },
          { type: "ul", items: ["Assistindo", "Quero ver", "Concluídos"] },
          { type: "p", text: "Cada título mostra o progresso de episódios, permitindo retomar o acompanhamento sem precisar procurar essa informação em outra tela." },
          { type: "p", text: "Aqui, o foco do UI Design foi manter uma leitura simples, com hierarquia, contraste e estados visuais consistentes." },
        ] },
        { type: "item", h3: "Feed: transformar acompanhamento em conversa", images: [{ ...IMG.feedAmigos, demo: "feed" }, IMG.feedComunidade], blocks: [
          { type: "p", text: "O feed conecta o acompanhamento dos animes ao lado social do aplicativo." },
          { type: "p", text: "A proposta é que avaliações, conclusões e discussões sirvam como ponto de partida para conversas entre amigos e outros fãs." },
          { type: "p", text: "Em vez de separar completamente a lista pessoal da comunidade, quis aproximar essas duas experiências." },
        ] },
        { type: "item", h3: "Perfil, XP e Quiz do Draco", images: [IMG.perfil, IMG.quiz], blocks: [
          { type: "p", text: "O perfil reúne informações sobre a jornada do usuário: animes acompanhados, horas assistidas, XP, níveis, sequência de dias e conquistas." },
          { type: "p", text: "O Quiz do Draco complementa essa experiência." },
          { type: "p", text: "São dez perguntas por partida, geradas a partir do catálogo, com 15 segundos por pergunta, três vidas e 2 XP por acerto." },
          { type: "p", text: "O Draco reage às respostas, trazendo um pouco da personalidade do aplicativo para a interação." },
        ] },
        { type: "flow", h3: "Onboarding e cadastro", label: "Fluxo de entrada", images: [IMG.onb, IMG.login, IMG.generos, IMG.streaming], blocks: [
          { type: "p", text: "O fluxo de entrada apresenta o universo do ANIMAE. Antes de criar uma conta, o usuário pode explorar a home e o catálogo para entender o que o aplicativo oferece." },
          { type: "p", text: "Quis dar contexto antes de pedir um compromisso: primeiro conhecer o produto, depois decidir se faz sentido criar um perfil." },
          { type: "p", text: "Durante o cadastro, a escolha de gêneros favoritos e plataformas de streaming ajuda a orientar a personalização inicial da experiência." },
          { type: "p", text: "Distribuí essas escolhas ao longo do fluxo para apresentar o produto aos poucos, sem concentrar todas as decisões na primeira abertura. A intenção é reduzir a carga inicial; o efeito ainda precisa ser avaliado em testes de usabilidade." },
        ] },
      ],
    },
    {
      id: "status", title: "Status atual e validação",
      blocks: [
        { type: "h3", text: "O que já foi construído e o que ainda preciso descobrir" },
        { type: "p", text: "O ANIMAE possui uma versão web funcional e uma versão Android preparada para teste fechado, conforme o estado documentado do projeto." },
        { type: "p", text: "O trabalho desenvolvido inclui identidade visual, Design System, fluxos de UX/UI, funcionalidades de acompanhamento e gamificação, além da implementação com apoio de IA." },
        { type: "p", text: "Mas ter o produto construído não significa que todas as hipóteses foram validadas." },
        { type: "p", text: "Ainda preciso realizar testes de usabilidade estruturados e acompanhar o comportamento de usuários reais para entender o que funciona, o que precisa mudar e quais funcionalidades realmente geram valor." },
        { type: "h3", text: "Métricas que pretendo acompanhar" },
        { type: "kpis", items: [
          ["Ativação", "proporção de usuários que realizam uma primeira ação relevante após o cadastro."],
          ["Retenção D7", "proporção de usuários que retornam sete dias depois, com definição clara da coorte e do evento de retorno."],
          ["Participação", "atividade no feed e publicações por usuário ao longo do período."],
        ] },
        { type: "p", text: "Essas são métricas propostas para a próxima etapa, não resultados já alcançados." },
      ],
    },
    {
      id: "aprendizados", title: "Aprendizados",
      blocks: [
        { type: "h3", text: "Mudar a solução não significa abandonar o problema" },
        { type: "p", text: "O maior aprendizado do **ANIMAE** foi entender que mudar de direção não significa necessariamente começar de novo." },
        { type: "p", text: "Comecei tentando criar uma plataforma de streaming e construí um espaço para acompanhar animes e conectar usuários que gostam das mesmas histórias." },
        { type: "p", text: "Nesse processo, precisei tomar decisões que foram além das interfaces: cortar funcionalidades, reorganizar o escopo, construir um Design System e aproximar design e código." },
        { type: "p", text: "O próximo desafio é colocar essas decisões à prova." },
        { type: "p", text: "**Quero descobrir se a experiência que construí realmente faz sentido para quem vai utilizar o ANIMAE.**" },
      ],
    },
  ],
};

export const heroTrio = [
  { ...IMG.home, alt: "Tela inicial do ANIMAE com destaque, botão de adicionar e amigos online" },
  IMG.lista,
  IMG.perfil,
];
