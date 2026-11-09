# Portfólio Miranda

Portfólio de Thiago Miranda, Product Designer pleno, em React + Vite + CSS + GSAP.
Esta rodada aproxima a experiência da linguagem Windows XP e usa Tahoma em todo o site.

## Rodar

```bash
npm ci
npm run dev
npm run build
```

Se o cache padrão do npm não for gravável, configure `npm_config_cache` para um
subdiretório gravável do ambiente antes de instalar.

## Modos

- **XP:** experiência inicial com janelas de perfil/projetos, menu Iniciar, atalhos,
  filtros por pasta, minimizar, restaurar, maximizar e fechar. Os três cases ficam
  visíveis ao entrar na Home. A abertura agora tem uma tela de boas-vindas XP,
  sem senha, formulário de autenticação ou animação de boot.
- **Rápido:** Home editorial clara com resumo de 60 segundos.
- **Noite:** versão escura do modo editorial.

O seletor salva a preferência localmente. Tahoma usa Verdana/Arial como fallback;
nenhum arquivo proprietário de fonte é distribuído.

## Tela de entrada — rodada 09/11

A primeira visita à raiz abre a tela de boas-vindas inspirada no XP. Selecione
**Thiago Miranda · Product Designer** para entrar.
O espaço do avatar permanece vazio. Hover e foco usam azul escuro e amarelo.
A sessão memoriza a entrada para não interromper a volta dos cases.
O botão “Tela inicial” e a URL `/?entrada=1` permitem rever a abertura.
Links diretos para cases e seções não exigem passar pela abertura.

As novas escalas de azul, neutros e destaque ficam em `src/styles/tokens.css`;
a interface de entrada não usa preto ou branco puros. O logo personalizado enviado
pelo usuário e o ícone de reinício são arquivos locais. A instrução de login usa
20 px em peso medium (exceção explícita à escala de 8), em off-white (#F5F7FB), conforme a escolha visual mais recente.
As fontes de origem estão em [docs/XP_WELCOME.md](docs/XP_WELCOME.md).

## Design system

Layout, grids, medidas fixas, espaçamentos e tipografia seguem a escala de 8 pontos
nos três modos e nos cases. Textos começam em 16 px. A única exceção tipográfica
é a instrução da abertura, em 20 px/medium, conforme solicitado.
Execute `npm run check:design` para verificar a escala.
Detalhes: [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

## Paleta XP

As cores-base solicitadas são `#002697` (azul profundo) e `#5179E1` (azul central),
centralizadas nos tokens `--color-xp-deep` e `--color-xp-mid`. Janelas, botões,
links, filtros e foco usam essas cores ou tonalidades derivadas. Os modos claro
e escuro preservam suas superfícies neutras.

A abertura tem faixas planas nas cores exatas, logo com 280 px no desktop/224 px
no celular, nome de perfil em 24 px e avatar
vazio de 64 px (56 px no celular). Uma textura CRT estática e discreta cobre a
abertura e a experiência XP, sem animação ou bloqueio de cliques.

## Arquitetura

- `src/App.jsx`: seleção de modo, persistência e resolução de rotas.
- `src/components/`: cabeçalho, janela, ícone retrô, card e seções preservadas da Home.
- `src/pages/`: Home editorial, desktop XP e página compartilhada dos cases.
- `src/data/cases.js`: conteúdo dos projetos, separado das interfaces.
- `src/styles/`: base, tokens, layout e camada XP.
- `public/assets/retro/`: dez SVGs locais criados para esta implementação.

Rotas: `/cases/animae`, `/cases/navaja`, `/cases/oficina-do-tenista` e
`/cases/ultragrip`. A hospedagem deve servir `index.html` para rotas da aplicação
que não correspondam a arquivos estáticos. Vite já faz isso no desenvolvimento.

## Validação e pendências

Build e testes de interação no DOM passaram. A prévia visual está indisponível
nesta sessão, portanto desktop 1440 px e mobile ainda precisam de avaliação no
navegador. Detalhes em [docs/AUDIT.md](docs/AUDIT.md).

Ainda faltam screenshots reais/autorizados dos cases, curadoria editorial detalhada,
e-mail público, LinkedIn e CV revisado. As interfaces indicam essas pendências;
nenhum contato ou resultado foi inventado.

A direção visual usa Mitch Ivin como referência. A rodada inicial usou assets originais; na rodada de 09/11, o logo personalizado fornecido pelo usuário e o ícone de
reinício foram incorporados com origem e atribuição registradas. Origem dos
assets e alternativas avaliadas: [docs/ASSETS.md](docs/ASSETS.md).

## Fontes oficiais

- [Figma — Portfólio v1](https://www.figma.com/design/xAoPbyHrtEQ4VjGZ7ZvYO6)
- [Notion — Curadoria final de 03/11](https://app.notion.com/p/40d34785429b81f48205ed2d6dc28fdb)
