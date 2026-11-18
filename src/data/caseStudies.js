import { CASES } from "./cases.js";

// Curadoria editorial: Notion, revisão de 03/11/2026. Indicadores propostos
// ficam separados dos achados de pesquisa e dos resultados observados.
export const FEATURED_IDS = ["animae", "navaja", "oficina-do-tenista"];
export const PENDING_PROJECTS = [
  { id: "ultragrip", title: "UltraGrip", category: "E-commerce" },
  { id: "ciao", title: "CIAO", category: "E-commerce" },
];

const STORIES = {
  animae: {
    question: "Uma comunidade para quem vive o universo dos animes.",
    categories: ["APP / WEB APP SOCIAL", "PRODUTO PRÓPRIO"],
    roleShort: "UX, UI, design system e código com auxílio de IA",
    team: "Projeto solo",
    period: "Out/2025 — out/2026 · 1 ano",
    tools: ["Figma", "Illustrator", "Expo", "React Native", "Supabase", "Vercel", "AniList", "Jikan"],
    status: "Produto próprio · web disponível",
    accent: "animae",
    source: "https://app.notion.com/p/40a34785429b814da1b9cc829c60f378",
    links: {
      prototype: "https://www.figma.com/proto/Sdyl9kTkLtCZaIN13yvIgd/%F0%9F%93%B1-Projeto-ANIMAE--%7C-18-10-25?node-id=2083-5498&viewport=75%2C288%2C0.26&t=MBJWwQLeEJVIIHt8-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2083%3A5498&page-id=2083%3A5497",
      site: "https://animaeapp.com.br/",
      siteLabel: "Ver landing page",
      // Behance do ANIMAE em pausa: o que está publicado lá é a proposta antiga de streaming.
    },
    // Tamanho do quadro inicial do protótipo no Figma (Home · Redesenho), usado para encaixar o embed.
    // Vídeo do protótipo funcionando: `video: { src, poster, caption }` quando o Thiago enviar.
    heroTrio: [
      { src: "/assets/cases/animae-home.webp", width: 860, height: 1864, alt: "Tela inicial do ANIMAE com destaque, botão de adicionar e amigos online" },
      { src: "/assets/cases/animae-lista.webp", width: 860, height: 1864, alt: "Tela Minha Lista do ANIMAE com filtros e progresso dos episódios" },
      { src: "/assets/cases/animae-perfil-xp.webp", width: 860, height: 1864, alt: "Tela de perfil do ANIMAE com XP, sequência de dias e conquistas" },
    ],
    roles: ["Product Design", "Design System", "Mobile"],
    // Imagens por etapa (layouts: wide, pair, trio, mosaic). Slugs apontam para arquivos em /assets/cases.
    stageImages: {},
    quick: [
      ["Problema", "Acompanhar anime, organizar listas e conversar com amigos exige alternar entre plataformas."],
      ["Minha contribuição", "Defini o produto, pesquisei, desenhei a experiência e construí o app com apoio de IA."],
      ["Decisão central", "Deixei o streaming próprio de fora para concentrar o MVP em organização e comunidade."],
      ["Estado documentado", "Versão web disponível; Android preparado para teste fechado. Sem métricas públicas de uso."],
    ],
    cover: { type: "phone", src: "/assets/cases/animae-lista.webp", width: 860, height: 1864, alt: "Tela Minha Lista do ANIMAE, com acompanhamento de episódios e navegação do app", caption: "Tela real do Figma · MVP social. Contagens e dados da interface são demonstrativos.", title: "Acompanhar, registrar e conversar", text: "Uma experiência para organizar o que o usuário assiste e criar conexões em torno das mesmas histórias." },
    context: "Eu queria uma coisa simples: acompanhar os animes que assisto e conversar sobre eles com amigos, sem pular de aplicativo em aplicativo. Minha primeira ideia foi o ANIMAE+, um streaming social, com player próprio e salas para assistir junto. Mas, ao desenhar, percebi que a pergunta estava errada. O fã não precisa de mais um lugar para assistir. Ele precisa de um lugar para dividir o que assistiu. Além disso, manter um catálogo próprio, com custo e licenças, não cabia em um produto feito por uma pessoa só. Então mudei o rumo: o ANIMAE deixou de ser onde você assiste e virou onde você acompanha e conversa. Foi a decisão que organizou todo o resto do produto.",
    problem: "Como aproximar organização, descoberta e comunidade sem depender de um catálogo próprio de streaming?",
    research: {
      intro: "Antes de redesenhar, olhei como os fãs falam dos apps que já usam: fontes públicas e reclamações de usuários. Três coisas se repetiam: telas carregadas, pouca conversa entre fãs e quase nenhuma personalização. É daí que vem a oportunidade do ANIMAE. Foi uma pesquisa de mesa, não entrevistas, e por isso ainda precisa ser confirmada com o uso real.",
      findings: [
        ["Método", "Pesquisa de mesa e\nanálise de relatos públicos"],
        ["Oportunidade", "Aproximar acompanhamento\ne conversa entre fãs"],
        ["Limite", "Hipóteses ainda precisam de\nvalidação com uso real"],
      ],
    },
    decisions: [
      { title: "Comunidade em vez de streaming", choice: "Retirei o player e as salas para assistir em grupo, que eram o destaque da primeira versão. O app passou a indicar onde assistir e a concentrar lista, acompanhamento e interação.", tradeoff: "Abri mão do diferencial original para construir um produto que eu conseguisse manter." },
      { title: "Explorar antes de criar conta", choice: "Permiti que o usuário conheça a home e o catálogo em modo visitante, antes do cadastro.", tradeoff: "Menos personalização no primeiro acesso, em troca de uma barreira inicial menor." },
      { title: "Transformar o uso em jogo", choice: "Cada episódio registrado gera XP, que evolui níveis e conquistas, em uma lógica parecida com a do Duolingo. O cálculo da pontuação fica no servidor.", tradeoff: "A lógica exige mais cuidado técnico, mas a pontuação não pode ser alterada pelo aparelho do usuário." },
      { title: "Uma comunidade que não nasce vazia", choice: "Um feed sem ninguém parece abandonado. Por isso criei o Quiz do Draco, o mascote do app: um desafio rápido, com tempo e vidas, que dá XP a quem acerta e mostra o resultado no perfil. Assim, o usuário tem o que fazer desde o primeiro dia, mesmo antes de a comunidade crescer.", tradeoff: "O quiz dá um motivo para voltar ao app, mas a conversa entre os fãs ainda precisa vir de pessoas reais." },
    ],
    journeys: [{ label: "Jornada proposta do fã", steps: ["Explorar o catálogo", "Organizar a lista", "Registrar episódios", "Compartilhar com a comunidade"] }],
    solution: "Organizei fluxos e wireframes antes das interfaces finais. Como o projeto é solo, também cuidei do que acontece depois do layout: variáveis e componentes do Figma alimentam uma base de tokens consumida pelo app, para manter a mesma linguagem visual entre design e código. O app foi construído com Expo e React Native, tem o Supabase no back-end e a versão web roda na Vercel.",
    gallery: [],
    outcome: "O resultado documentado é um produto funcional na web e uma versão Android preparada para teste fechado. Ainda não houve teste com usuários, e é ele que fecha o ciclo de design: a evolução do produto será contada com datas e evidências.",
    kpis: [
      ["Ativação", "Primeira ação relevante após o cadastro"],
      ["Retenção D7", "Retorno ao app sete dias depois"],
      ["Participação", "Publicações por usuário no período"],
    ],
    learning: "Mudar de direção não significa necessariamente começar de novo. Deixar o streaming de lado preservou o problema que eu queria resolver e tornou possível continuar construindo o produto.",
  },
  navaja: {
    question: "Um aplicativo para ajudar barbeiro e cliente a se entenderem sobre o corte.",
    categories: ["APLICATIVO", "UX RESEARCH", "PROJETO CONCEITO"],
    roleShort: "Discovery, pesquisa, UX/UI e DS",
    team: "Projeto solo",
    period: "Mar — jun/2026",
    tools: ["Figma", "FigJam", "iOS HIG", "Grid de 8 pontos"],
    status: "Conceito · pesquisa real · não lançado",
    accent: "navaja",
    source: "https://app.notion.com/p/40a34785429b81c48f04ee72051d71ba",
    links: { behance: "https://www.behance.net/gallery/250920105/Navaja-Barber-Shop-App-with-AI-UI-UX-Case-Study" },
    quick: [
      ["Hipótese inicial", "O principal problema do barbeiro que trabalha sozinho seria organizar a agenda."],
      ["Descoberta", "As entrevistas apontaram uma dificuldade na conversa sobre o estilo de corte."],
      ["Minha contribuição", "Conduzi discovery, entrevistas, arquitetura, wireframes, design system e telas."],
      ["Entrega", "Conceito com oito telas de MVP, fluxos e handoff. Sem métricas de uso."],
    ],
    cover: { type: "image", src: "/assets/cases/navaja-capa.png", width: 1024, height: 768, alt: "Mockup do Navaja mostrando sugestões de cortes no aplicativo do barbeiro", caption: "Interface do projeto conceito · material já publicado no portfólio do Thiago." },
    context: "Desenhei o Navaja para barbeiros que trabalham sozinhos e administram a própria barbearia. Parti de uma hipótese de agendamento, fiz entrevistas e comparei Trinks, BestBarbers, EiBarber, Booksy e Fresha antes de definir o MVP.",
    problem: "Como simplificar a rotina do barbeiro e ajudar o cliente indeciso a explicar o corte que deseja?",
    research: {
      intro: "Conversei com três barbeiros em março de 2026, usando o mesmo roteiro de sete perguntas. A agenda já era atendida por ferramentas existentes; o apoio à escolha do corte apareceu como outra oportunidade. São achados de uma amostra qualitativa, não estatísticas do mercado.",
      findings: [
        ["3 entrevistas", "Realidades diferentes: ordem de chegada, app de gestão e Google Agenda"],
        ["2 de 3", "Usavam Google Imagens para ajudar clientes indecisos"],
        ["2 de 3", "Relataram agendamentos pelo WhatsApp"],
        ["5 concorrentes", "Benchmark usado para delimitar a oportunidade"],
      ],
    },
    decisions: [
      { title: "Sugestão de corte sem câmera", choice: "O barbeiro informa o formato do rosto e avalia as sugestões. A IA apoia a decisão do profissional.", tradeoff: "Abri mão da análise automática para evitar permissões e processamento de fotografias." },
      { title: "Um app e um link", choice: "O barbeiro usa o app; o cliente agenda por um link no navegador, próximo ao comportamento já existente no WhatsApp.", tradeoff: "Não criei um segundo app com notificações próprias para o cliente." },
      { title: "Agendar com o essencial", choice: "Nome e horário primeiro; outras informações podem ser completadas depois.", tradeoff: "Menos dados no início, em troca de um registro mais rápido durante o atendimento." },
    ],
    journeys: [
      { label: "Barbeiro · aplicativo", steps: ["Entender o pedido", "Informar o formato do rosto", "Avaliar sugestões", "Registrar o atendimento"] },
      { label: "Cliente · link no navegador", steps: ["Receber o link", "Escolher serviço e horário", "Informar os dados", "Confirmar o agendamento"] },
    ],
    solution: "Defini proposta de valor, MVP, arquitetura e wireframes antes das telas finais. O design system, com cores, tipografia, componentes e grid de 8 pontos, deu base às oito telas do conceito e ao handoff.",
    gallery: [{ src: "/assets/cases/navaja-telas.png", width: 1024, height: 569, alt: "Mockup da entrada do aplicativo Navaja", caption: "Estudo de interface e identidade visual do Navaja. Projeto não construído nem lançado." }],
    outcome: "A entrega é o processo de discovery, três entrevistas, análise de cinco concorrentes, definição do MVP, fluxos, wireframes, design system e oito telas finais. Não existem resultados reais de uso; a solução ainda precisa ser testada.",
    kpis: [
      ["Adoção", "Uso recorrente pelo barbeiro ao longo de 30 dias"],
      ["Sugestões", "Frequência de uso do apoio à escolha do corte"],
      ["Agendamento", "Faltas e dificuldades no fluxo de confirmação"],
    ],
    learning: "Se eu tivesse seguido só a hipótese inicial, teria desenhado mais um aplicativo de agenda. A pesquisa me ajudou a encontrar uma pergunta mais relevante: como barbeiro e cliente se entendem sobre o corte?",
  },
  "oficina-do-tenista": {
    question: "Uma compra de raquetes tão orientada quanto uma conversa na loja.",
    categories: ["E-COMMERCE", "SHOPIFY", "AGÊNCIA DISCO"],
    roleShort: "UX/UI, wireframes e handoff",
    team: "Agência Disco",
    period: "2026 · projeto de 90 dias",
    tools: ["Figma", "Shopify"],
    status: "Cliente real · projeto entregue",
    accent: "oficina",
    source: "https://app.notion.com/p/40a34785429b814c8dcdc411a8a50b32",
    links: { design: "https://www.figma.com/design/zPqNhCbwO8DDnnouXZfa5a?node-id=4001-25252" },
    quick: [
      ["Problema", "Quem está começando tem receio de escolher a raquete errada e encontra informações técnicas cedo demais."],
      ["Minha contribuição", "Desenhei wireframes, layouts desktop/mobile e handoff, com as decisões de UX da experiência."],
      ["Solução", "Guia por nível de jogo, uma estrutura de página de produto e comparador lado a lado."],
      ["Resultado documentado", "Projeto entregue pela Agência Disco. Sem números de resultado disponíveis."],
    ],
    cover: { type: "image", src: "/assets/cases/oficina-produto.png", width: 1024, height: 536, alt: "Página de produto da Oficina do Tenista no Figma, com raquete, atributos e compra", caption: "Página de produto · layout real do projeto na Agência Disco." },
    context: "A Oficina do Tenista, loja de esportes de raquete de Belo Horizonte, estava migrando da OpenCart para a Shopify em um projeto sob medida da Agência Disco. Meu trabalho foi aproximar a experiência digital da orientação que a pessoa recebe na loja física.",
    problem: "Como dar a quem compra online a mesma segurança de uma conversa com o vendedor?",
    research: {
      intro: "O briefing e o discovery mostraram uma dúvida recorrente no atendimento: qual raquete é adequada para meu nível? Iniciantes precisavam interpretar peso, equilíbrio e tamanho da cabeça antes de saber o que procurar. Essa evidência vem do contexto do projeto, não de um teste de usabilidade documentado.",
      findings: [
        ["Pergunta recorrente", "Qual é a raquete ideal para o meu nível?"],
        ["Barreira", "Receio de comprar um produto técnico sem experimentar"],
        ["Referência de serviço", "O vendedor começa entendendo como a pessoa joga"],
      ],
    },
    decisions: [
      { title: "Começar pelo nível de jogo", choice: "Estruturei o guia de escolha com entradas para iniciante, intermediário, avançado e competição, explicando a ficha técnica no momento certo.", tradeoff: "Acrescentei uma etapa de orientação antes da escolha do modelo." },
      { title: "Uma página de produto", choice: "Propus uma estrutura única, em vez de três páginas separadas por nível.", tradeoff: "A página precisa atender perfis diferentes, mas evita fragmentar a comparação e a manutenção." },
      { title: "Comparar lado a lado", choice: "Desenhei um comparador de três raquetes com características e preço, no guia e na página de produto.", tradeoff: "Organizei os atributos para facilitar a decisão sem sobrecarregar a primeira leitura." },
    ],
    journeys: [{ label: "Jornada proposta de compra", steps: ["Identificar o nível", "Entender as características", "Comparar raquetes", "Escolher o produto", "Adicionar ao carrinho"] }],
    solution: "A solução reúne o guia de raquetes, a página de produto com comparador e uma entrada para iniciantes com kits de raquete, corda e acessórios. O objetivo é orientar a escolha sem exigir conhecimento técnico prévio.",
    gallery: [{ src: "/assets/cases/oficina-comparador.png", width: 1024, height: 420, alt: "Comparador da Oficina do Tenista com três raquetes lado a lado e seus atributos", caption: "Comparação de três modelos · componente real do Figma da Disco. Valores pertencem ao layout apresentado." }],
    outcome: "O projeto foi entregue pela Agência Disco. Ainda não tenho números de resultado para apresentar. O próximo passo de avaliação é observar se a orientação ajuda na escolha e onde a jornada ainda gera dúvidas.",
    kpis: [
      ["Conversão", "Conversão da categoria de raquetes"],
      ["Trocas", "Trocas motivadas pela escolha do modelo errado"],
      ["Dúvidas", "Frequência da pergunta sobre qual raquete escolher no atendimento"],
    ],
    learning: "Na loja física, o vendedor não começa entregando uma ficha técnica: pergunta como a pessoa joga. Meu trabalho foi transformar essa conversa em interface e apresentar a informação no momento certo.",
  },
};

const MODULES = {
  animae: [
    {
      title: "Descobrir o próximo anime",
      text: "Quis deixar a descoberta simples. A home não destaca um título fixo: é um banner rotativo que mostra os animes em alta no momento e troca sozinho. Os dados vêm de APIs públicas: comecei com a AniList, mas o catálogo dela era limitado, então adicionei a Jikan para completar. O aplicativo inteiro consome essas duas fontes. Da home, o usuário vai direto para a página do anime, com onde assistir e o progresso à vista, e pode conhecer tudo antes de criar uma conta.",
      layout: "phones",
      images: [
        { src: "/assets/cases/animae-home.webp", width: 860, height: 1864, alt: "Home do ANIMAE com anime em destaque, botões Adicionar e Onde assistir, e amigos online" },
        { src: "/assets/cases/animae-hub.webp", width: 860, height: 1864, alt: "Página de um anime no ANIMAE com onde assistir, botão de adicionar à lista e progresso de episódios" },
      ],
    },
    {
      title: "Uma lista que acompanha o ritmo de cada fã",
      text: "Organizei os títulos por intenção: assistindo, quero ver e concluídos. O progresso fica junto de cada anime, para o usuário retomar de onde parou sem procurar essa informação em outra tela. Trabalhei contraste, hierarquia e estados para manter a lista fácil de percorrer.",
      layout: "phones",
      images: [{ src: "/assets/cases/animae-lista.webp", width: 860, height: 1864, alt: "Minha Lista com filtros de acompanhamento e progresso dos episódios", demo: "lista" }],
    },
    {
      title: "O que eu assisto também vira conversa",
      text: "No feed, o acompanhamento ganha um lado social. Conclusões, avaliações e debates ajudam a começar uma conversa, entre amigos ou com a comunidade toda. A ideia é que o que o usuário acompanha seja o ponto de partida do papo.",
      layout: "phones",
      images: [
        { src: "/assets/cases/animae-feed-amigos.webp", width: 860, height: 1864, alt: "Feed de amigos do ANIMAE com atividade de conclusão de um anime, reações e comentários" },
        { src: "/assets/cases/animae-feed-comunidade.webp", width: 860, height: 1864, alt: "Feed da comunidade do ANIMAE com debate aberto e ranking de animes da semana" },
      ],
    },
    {
      title: "Jogar também é acompanhar",
      text: "Cada episódio registrado e cada quiz respondido rendem XP, que alimenta o perfil: nível, sequência de dias e conquistas. O Quiz do Draco tem 15 segundos por pergunta, três vidas e +2 XP por acerto, e o Draco reage a cada resposta. Esta tela eu desenhei direto no código do app, então a versão ao lado é uma demonstração reduzida, com três perguntas de exemplo; no aplicativo são dez, geradas a partir do catálogo.",
      layout: "phones",
      images: [
        { src: "/assets/cases/animae-perfil-xp.webp", width: 860, height: 1864, alt: "Perfil do ANIMAE com nível, XP, sequência de dias e conquistas" },
        { src: "/assets/cases/animae-quiz-draco.webp", width: 860, height: 1864, alt: "Quiz do Draco com pergunta, barra de tempo, vidas e quatro opções de resposta", demo: "quiz" },
      ],
    },
    {
      title: "Da primeira abertura à conta criada",
      text: "O fluxo de entrada começa com o onboarding, que apresenta o aplicativo e o universo otaku, com a opção de pular. Depois vêm login e cadastro em passos curtos, com a escolha de gêneros e de onde o usuário assiste, para que as recomendações já comecem com o gosto dele.",
      images: [],
      flow: [
        { label: "Fluxo de entrada", items: [
          { src: "/assets/cases/animae-flow-onb-1.webp", width: 860, height: 1864, alt: "Onboarding 1: Seu universo otaku do seu jeito", caption: "Universo otaku" },
          { src: "/assets/cases/animae-login.webp", width: 860, height: 1864, alt: "Login com e-mail, senha, Criar conta, Entrar no fandom e login social", caption: "Login" },
          { src: "/assets/cases/animae-generos.webp", width: 860, height: 1864, alt: "Cadastro: O que você curte, com gêneros para escolher", caption: "Gêneros" },
          { src: "/assets/cases/animae-flow-streaming.webp", width: 860, height: 1864, alt: "Cadastro: Onde você assiste, com lista de serviços de streaming", caption: "Onde assiste" },
        ] },
      ],
    },
  ],
  navaja: [
    {
      title: "Escolher o corte começa pela conversa",
      text: "Parti de referências que o barbeiro já usa no atendimento. A seleção manual do formato do rosto orienta as sugestões; o profissional continua conduzindo a conversa. Na tela de estilos, organizei os cortes em um catálogo visual com filtros para aproximar a ideia do cliente de uma referência concreta.",
      images: [
        { src: "/assets/cases/navaja-rosto.png", width: 1024, height: 597, alt: "Navaja: seleção manual do formato do rosto e comprimento desejado", caption: "Sugestão por rosto · seleção manual, sem captura de fotografia." },
        { src: "/assets/cases/navaja-estilos.png", width: 1024, height: 597, alt: "Catálogo de estilos do Navaja com filtros de comprimento e referências de cortes", caption: "Estilos · catálogo visual para apoiar a conversa no atendimento." },
      ],
    },
    {
      title: "Uma entrada com identidade própria",
      text: "Trabalhei a linguagem visual do Navaja para aproximar o aplicativo do universo da barbearia. Contraste, tipografia e componentes dão unidade às telas. O design system serviu de base para o conceito e para o handoff.",
      images: [STORIES.navaja.gallery[0]],
    },
  ],
  "oficina-do-tenista": [
    {
      title: "Primeiro, como você joga?",
      text: "Comecei o guia pelo nível de jogo, antes das especificações. As entradas vão de iniciante a competição e explicam o que priorizar em cada momento. Quis transformar a orientação da loja em uma sequência que a pessoa conseguisse seguir sozinha.",
      images: [{ src: "/assets/cases/oficina-guia.png", width: 1024, height: 329, alt: "Guia da Oficina do Tenista com quatro níveis: iniciante, intermediário, avançado e competição", caption: "Guia de raquetes · orientação por nível no Figma da Disco." }],
    },
    {
      title: "A vitrine também orienta a descoberta",
      text: "Na Home, trabalhei a relação entre campanha, imagem e ação para apresentar as linhas de produto com clareza. O projeto precisava manter a força visual das marcas e dar continuidade à experiência de compra, do primeiro contato até a escolha da raquete.",
      images: [{ src: "/assets/cases/oficina-home.png", width: 1024, height: 461, alt: "Vitrine da Home Oficina do Tenista, com campanha de tênis e acesso à linha de produtos", caption: "Home · carrossel de campanhas no layout real da Disco." }],
    },
    {
      title: "Comparar para escolher com mais segurança",
      text: "Coloquei três raquetes lado a lado para que as diferenças aparecessem no mesmo contexto. Peso, equilíbrio, características e preço ajudam a comparar sem alternar entre várias páginas. Esse componente faz parte da proposta do guia e da página de produto.",
      images: [STORIES["oficina-do-tenista"].gallery[0]],
    },
  ],
};

export const CASE_STUDIES = FEATURED_IDS.map((id) => ({ ...CASES.find((c) => c.id === id), ...STORIES[id], modules: MODULES[id] }));
export const getCaseStudy = (id) => CASE_STUDIES.find((c) => c.id === id);
export const nextCaseStudy = (id) => CASE_STUDIES[(FEATURED_IDS.indexOf(id) + 1) % FEATURED_IDS.length];

export function projectLinkAction(event, navigate, href) {
  if (!navigate || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate(href);
}
