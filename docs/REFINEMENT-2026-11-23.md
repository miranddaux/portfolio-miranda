# Revisão desktop — 23/11/2026

Base: `main` em `15e876a` (merge PR #49). O código e a copy aprovados nessa base
prevalecem sobre os planos históricos de três modos, Playground e outros cases.
A rodada mobile/Windows Media Player do texto anexado fica para a próxima fase.

## Perfil, currículo e conteúdo

- Sobre: `desenho e-commerces` não quebra no meio; Em estudo centralizado no título.
- PDFs PT e EN reconstruídos em uma página, com texto selecionável, links reais e
  prévias WebP correspondentes. Desenho/I design começa na linha seguinte;
  e-commerce e de ponta a ponta/end to end permanecem inteiros.
- Resumo: seis anos em **design**, sem atribuir esse período inteiro a Product
  Design; UI, DS, acessibilidade, colaboração e app próprio construído com IA.
- Disco: storefront Shopify (home, PDP, PLP, carrinho, páginas institucionais),
  arquitetura de informação, mega menu, product cards, componentes/tokens e handoff.
  Não atribui checkout nem resultados de conversão medidos. CRO descreve o foco.
- Não recuperamos o prazo de 2–3 semanas para 4–5 dias das bases anexadas: essa
  afirmação já havia sido retirada por falta de origem confirmada.
- ANIMAE: pesquisa de mesa conforme o case, em vez de cinco entrevistas; web
  funcional/Android preparado para teste fechado, sem afirmar lançamento na Play.
- Hackathon: primeiro entre 30 squads; designer e mentor; wireframes, DS,
  navegação e protótipo. A última correção do Thiago descreve interface de app;
  evitamos fixar a entrega como landing page do Apoia.se, como constava na base.
- Link do currículo atualizado do antigo Framer para o site Vercel atual.

Fontes editáveis: `src/data/curriculos.js`. Gerar novamente:

```sh
npm ci
node scripts/export-cv.mjs
```

O exportador usa Chromium, Python/Playwright e PyMuPDF instalados no ambiente;
`CHROMIUM_BIN` permite indicar outro executável. Inter vem do pacote local
@fontsource/inter. Não usa conteúdo de documentos como instrução de execução.

## Case ANIMAE

- Construí em vez de construo; aprendizado coerente no passado e nome em negrito.
- Decisões em 2×2, números discretos, títulos primeiro, justificativa/hipótese e
  troca explícitas. Três parágrafos por decisão, preservando os limites da pesquisa.
- Padding de 40 px no documento e largura máxima de 1280 px; leitura limitada,
  imagens e módulos ocupam a largura útil. Ritmo de 8 px preservado.
- Banner de 432 px com imagem menor, topo preservado e fade inferior.
- Onboarding explica exploração antes de conta e personalização progressiva.
- Container query agora também no scroll da janela XP; grids não impõem largura
  mínima pelos seus filhos. Fluxos/trios rolam no próprio quadro em janela estreita.

## Interações

- Reiniciar, Sair e logoff limpam a rota/fragmento e reabrem Sobre na aba Sobre.
  Refresh também inicia um desktop limpo. Um novo acesso por URL direta de case
  continua compartilhável; reabrir a página por refresh volta ao Sobre.
- Sair executa logoff; Desligar mantém o diálogo de energia existente.
- Codex no submenu de usados recentemente. Ícone oficial monocromático extraído
  do PDF da OpenAI, com transparência original e fundo azul por CSS; é uma
  alternativa ao arquivo colorido mostrado no chat, que não veio como arquivo local.
- Bot do MSN mantém só a homenagem ao MSN e o emoticon, sem prometer um case de DS.

## Headspace

`src/lib/headspacePlayback.js` controla seleção, busca e reprodução. Pedidos antigos
não podem trocar fonte ou exibir erro no pedido atual. Parar cancela a busca;
a falha limpa a fonte anterior, e Tocar tenta a seleção correta novamente.
A busca tem prazo de 12 s, cache de 15 min e exige título/artista compatíveis.
O AudioContext é retomado no gesto do clique; play não aguarda resume para iniciar.
Erros AbortError de trocas são ignorados. Bloqueios de áudio pedem novo clique,
URLs com erro saem do cache. Volume funciona também sem Web Audio; imports liberam
seus object URLs ao fechar. Não substituímos uma música por outra silenciosamente.

A demonstração local e arquivos importados independem do catálogo externo.
As prévias do iTunes continuam sujeitas à disponibilidade e à rede do provedor.

## Purble Place — pesquisa e integração

- [Atalho informado](https://github.com/hdhanwani/testing_project/blob/master/Microsoft_Games/Purble%20Place/PurblePlaceMCE.lnk): é um .lnk, não um motor web.
- [Areshkew/purble-place-decomp](https://github.com/Areshkew/purble-place-decomp):
  reconstrução C++/WASM com três jogos; exige DLLs da instalação do visitante.
  Não redistribuímos os arquivos proprietários que não foram fornecidos.
- [Comfy-Cakes-Game](https://github.com/iammsp-star/Comfy-Cakes-Game): MIT,
  alternativa de código aberto, mas cobre apenas a fábrica de bolos.
- [DipsyNugget — projeto 1071815115](https://scratch.mit.edu/projects/1071815115/):
  recriação comunitária com os três prédios; escolhida para a janela XP, via
  [TurboWarp embed](https://turbowarp.org/1071815115/embed).

A janela identifica autor e recriação; carrega só após Jogar. Tem Reiniciar,
Parar, tela cheia e alternativa para abrir em outra aba. Fechar/Parar destrói o
iframe e encerra o áudio. Ícone da janela é um SVG original de bolo, sem artwork
extraído do Windows. A disponibilidade dessa recriação depende de Scratch/TurboWarp.

## SEO e verificação

Descrição da Home atualizada com especialidade e localização no Brasil;
prerender contém a mesma bio, experiências, projetos, contatos e PDFs da interface,
com Person em JSON-LD e país BR. Canonical/OG/sitemap continuam no domínio Vercel.

- `node --test tests/*.test.mjs`: 15 testes, incluindo cinco regressões de áudio.
- `npm run check:design`: escala de 8 px e tamanhos dos ícones.
- `npm run build`: prerender Home/case e assets completos.
- Navegador Chromium: entrada, tabs, alinhamento do selo, abertura de case,
  cards 2×2, nome em negrito, refresh, logoff e nova entrada na aba Sobre.
- Áudio real: demo avançou; ABC/iTunes avançou cerca de seis segundos, sem erro.
- Purble: cidade e entrada no Comfy Cakes, pedido de bolo e controles carregados;
  menus de dificuldade de Pairs e Shop também abrem.
- Básico a 390 px: body 390; scroller do case 369, scrollWidth 369 (sem overflow
  horizontal do documento). Não representa fechamento da rodada mobile.
- PDFs: ambos têm uma página; inspeção visual, extração de texto e quatro links.

As capturas externas no ambiente de QA precisaram ignorar o certificado do proxy
local. Essa opção pertence ao teste e não foi adicionada ao site.
Persistem os avisos de build anteriores: bundle principal acima de 500 kB e import
estático/dinâmico do motor DOOM. Não impedem o build.
