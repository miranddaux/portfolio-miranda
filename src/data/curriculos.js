// Conteúdo editorial dos PDFs. Fontes: bases PT/EN enviadas e correções de 23/11/2026.
// Resultados quantitativos sem confirmação e entrevistas incompatíveis com o case foram retirados.
import { CONTATO } from './perfil.js';
import { SITE_URL } from './seo.js';

const contato = [
  ['E-mail', CONTATO.email, `mailto:${CONTATO.email}`],
  ['LinkedIn', CONTATO.linkedinTexto, CONTATO.linkedin],
  ['Portfólio', 'portfolio-miranda-tawny.vercel.app', SITE_URL],
  ['Telefone', CONTATO.telefone, 'tel:+5517992556714'],
];
export const CURRICULOS_TEXTO = {
  pt: {
    lang: 'pt-BR', title: 'Currículo · Thiago Miranda · Product Designer',
    summary: 'Product Designer com 6 anos de experiência em design.<br>Desenho <span class="nowrap">e-commerces</span>, sites e apps do briefing ao handoff, com foco em UI, Design Systems, conversão e acessibilidade. Trabalho próximo de desenvolvimento e negócio. Construí meu próprio app para entender melhor um produto <span class="nowrap">de ponta a ponta.</span>',
    experience: 'Experiência', projects: 'Projetos e prêmios',
    jobs: [
      ['Agência Disco, Remoto', 'Product Designer', 'Mar 2025 – Atual', [
        'Desenho lojas Shopify do briefing ao handoff: home, páginas de produto (PDP), coleções (PLP), carrinho e páginas institucionais, com foco em usabilidade e conversão (CRO).',
        'Organizo a arquitetura de informação, menus e megamenus e os cards de produto para facilitar a descoberta e a navegação pela loja.',
        'Estruturo Design Systems no Figma com tokens, componentes e wireframes reutilizáveis. Documento estados e interações no handoff para aproximar design e implementação.',
      ]],
      ['M8K Agência, Remoto', 'Visual Designer', 'Set 2023 – Fev 2025', [
        'Criei e gerenciei identidades visuais em anúncios, e-mail marketing e campanhas de performance, mantendo consistência entre os canais.',
        'Reorganizei o fluxo criativo da equipe para dar clareza às revisões e às entregas.',
      ]],
      ['DR Publicidade, Remoto', 'Designer Gráfico', 'Mar 2022 – Ago 2023', [
        'Cuidei da comunicação visual da conta Bosch Power Tools, seguindo diretrizes internacionais e adaptando key visuals para PDV e grandes eventos.',
      ]],
      ['Grupo ZNTT, São José do Rio Preto', 'Designer Gráfico e Estrategista de Marketing', 'Mai 2020 – Ago 2021', [
        'Liderei 2 designers e desenvolvi a identidade visual e a direção de arte de 7 marcas de uma holding de franquias.',
        'Conectei criação e comercial por meio de kits de franquia e apresentações que traduzem informações técnicas em conteúdo visual.',
      ]],
    ],
    awards: [
      ['ANIMAE — app social para fãs de anime', 'Fundador e Product Designer', 'Projeto próprio', [
        'Idealizei e construí o produto: pesquisa de mesa, definição de escopo, UX/UI, identidade visual, Design System e protótipo de alta fidelidade.',
        'Desenvolvi o app em React Native, Expo e Supabase com apoio de IA. Versão web funcional e Android preparado para teste fechado; validação com usuários como próxima etapa.',
      ]],
      ['Hackathon SouJunior — 1º lugar entre 30 squads', 'Designer e mentor do squad vencedor', 'Set 2026', [
        'Contribuí com wireframes, Design System, navegação e protótipo para transformar a proposta da equipe em uma interface consistente.',
      ]],
    ],
    contact: [...contato, ['Local', 'São José do Rio Preto, SP, Brasil']],
    sidebar: [
      ['Formação', [
        ['Universidade Paulista (UNIP)', 'Fev 2018 – Jun 2021', 'Tecnólogo em Design Gráfico'],
      ]],
      ['Certificações', [
        ['Experiência do Usuário (UX)', 'FIAP · Mar 2026'],
        ['Psicologia Aplicada ao UX', 'TIC em Trilhas · Mar 2026'],
        ['PRO FIGMA UI Design e Web', 'Udemy · 2025'],
        ['Introdução a UI e UX', 'Domestika · 2025'],
      ]],
      ['Competências', [
        ['Design', 'Design Systems e tokens', 'UI e Visual Design', 'UX Design', 'Prototipagem e wireframing', 'Acessibilidade (WCAG)', 'Design responsivo'],
        ['Produto e pesquisa', 'Discovery e pesquisa de mesa', 'Arquitetura de informação', 'Benchmark', 'Testes de usabilidade', 'CRO e e-commerce', 'Developer handoff', 'Scrum e Kanban'],
        ['Ferramentas', 'Figma · Shopify · Framer', 'Adobe CC · Notion', 'Claude Code e Codex', 'HTML, CSS e React (em estudo)'],
      ]],
      ['Idiomas', [['', 'Português (nativo)', 'Inglês (básico)']]],
    ],
  },
  en: {
    lang: 'en', title: 'Resume · Thiago Miranda · Product Designer',
    summary: 'Product Designer with 6 years of experience in design.<br>I design <span class="nowrap">e-commerce</span> stores, websites and apps from brief to handoff, focusing on UI, Design Systems, conversion and accessibility. I work closely with engineering and business teams. I built my own app to better understand a product <span class="nowrap">end to end.</span>',
    experience: 'Experience', projects: 'Projects and awards',
    jobs: [
      ['Agência Disco, Remote', 'Product Designer', 'Mar 2025 – Present', [
        'Design Shopify storefronts from brief to handoff: home, product pages (PDP), collection pages (PLP), cart and brand pages, focusing on usability and conversion rate optimization (CRO).',
        'Structure information architecture, menus, mega menus and product cards to support product discovery and navigation.',
        'Build Figma Design Systems with tokens, reusable components and wireframes. Document states and interactions for developer handoff, connecting design and implementation.',
      ]],
      ['M8K Agência, Remote', 'Visual Designer', 'Sep 2023 – Feb 2025', [
        'Created and managed visual identities across advertising, email marketing and performance campaigns, keeping the brand consistent across channels.',
        'Reorganized the creative workflow to clarify reviews and deliveries.',
      ]],
      ['DR Publicidade, Remote', 'Graphic Designer', 'Mar 2022 – Aug 2023', [
        'Managed visual communication for the Bosch Power Tools account, following international brand guidelines and adapting key visuals for retail and large events.',
      ]],
      ['Grupo ZNTT, São José do Rio Preto', 'Graphic Designer and Marketing Strategist', 'May 2020 – Aug 2021', [
        'Led 2 designers and developed visual identities and art direction for 7 brands in a franchise group.',
        'Connected creative and sales teams through franchise kits and presentations that translate technical information into clear visuals.',
      ]],
    ],
    awards: [
      ['ANIMAE — social app for anime fans', 'Founder and Product Designer', 'Independent project', [
        'Conceived and built the product: desk research, scoping, UX/UI, visual identity, Design System and a high-fidelity prototype.',
        'Developed the app with React Native, Expo and Supabase, assisted by AI. Functional web version and Android build prepared for closed testing; user validation is the next step.',
      ]],
      ['SouJunior Hackathon — 1st place among 30 squads', 'Designer and mentor of the winning squad', 'Sep 2026', [
        'Contributed wireframes, a Design System, navigation and a prototype to turn the team’s proposal into a consistent interface.',
      ]],
    ],
    contact: contato.map(([k,v,h])=>[{ 'E-mail':'Email', 'Portfólio':'Portfolio', 'Telefone':'Phone' }[k]||k,v,h]).concat([['Location','São José do Rio Preto, SP, Brazil']]),
    sidebar: [
      ['Education', [['Universidade Paulista (UNIP)', 'Feb 2018 – Jun 2021', 'Associate degree in Graphic Design']]],
      ['Certifications', [
        ['User Experience (UX)', 'FIAP · Mar 2026'],
        ['Applied Psychology for UX', 'TIC em Trilhas · Mar 2026'],
        ['PRO FIGMA UI Design and Web', 'Udemy · 2025'],
        ['Intro to UI and UX', 'Domestika · 2025'],
      ]],
      ['Skills', [
        ['Design', 'Design Systems and tokens', 'UI and Visual Design', 'UX Design', 'Prototyping and wireframing', 'Accessibility (WCAG)', 'Responsive design'],
        ['Product and research', 'Discovery and desk research', 'Information architecture', 'Benchmarking', 'Usability testing', 'CRO and e-commerce', 'Developer handoff', 'Scrum and Kanban'],
        ['Tools', 'Figma · Shopify · Framer', 'Adobe CC · Notion', 'Claude Code and Codex', 'HTML, CSS and React (learning)'],
      ]],
      ['Languages', [['', 'Portuguese (native)', 'English (basic)']]],
    ],
  },
};
