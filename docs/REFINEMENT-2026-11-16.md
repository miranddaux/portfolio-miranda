# Refinamento — links sociais

Base: `claude/modo-xp-desktop`, commit `b63f030`.
Branch de revisão: `codex/social-links-responsive`.

- `SocialLink` e `src/data/social.js` unificam nomes, destinos e marcas.
- LinkedIn e WhatsApp usam assets locais das marcas, com origem em `ASSETS.md`.
- MSN mostra ícone e nome para as quatro redes em todas as larguras.
  Grid automático acompanha o redimensionamento da janela; não depende só do viewport.
- Links do resumo, cards de Contato, atalho do e-mail e contato editorial seguem
  o mesmo componente. O botão E-mail do painel continua abrindo a janela interna.
- Alvos de toque têm 48 px em dispositivos com ponteiro grosso; foco visível,
  nomes acessíveis e indicação de abertura em nova aba.
- Retirada a afirmação não confirmada sobre prazo de layout de `perfil.js`,
  `bot.js` e dos PDFs PT/EN. As prévias dos PDFs foram renderizadas novamente.
  A correção é pontual; o restante do currículo existente foi preservado.

Validação: `npm ci` com cache gravável em `/tmp`, build de produção,
`npm run check:design`, verificação dos assets e renderização dos componentes.
A prévia do currículo PT foi inspecionada após a correção.

A ferramenta de navegador `cua_repl.js` não está disponível nesta sessão.
Não foi possível verificar visualmente desktop/mobile nem medir overflow no
navegador. A responsividade usa grids fluidos e os tokens de 8 pontos; permanece
pendente a avaliação visual com Thiago no endereço publicado.

## Segunda rodada — Sobre Mim e MSN

- As setas da barra percorrem as seis abas em ordem, com limites no começo/fim.
  O seletor Endereço também muda de aba. As teclas direcionais do tablist continuam funcionando.
- Buscar abre uma pesquisa em todas as abas, com resultados reais derivados dos
  mesmos dados exibidos na interface. A busca ignora acentos e caixa, combina
  palavras e leva o visitante até o item, com rolagem e foco. Tem estado vazio,
  limpar, fechar e Escape; nenhum serviço ou dependência de busca foi adicionado.
- Medium aparece como `inativo`, sem link nem ação. O WhatsApp recebeu uma
  compensação óptica de escala, pois o SVG tem margem interna maior que as outras marcas.
- A janela se chama `Sobre Mim - Miranda`. Textos adicionais do ANIMAE e do
  Hackathon SouJunior foram ajustados conforme a nova orientação do Thiago.
- O favicon usa o retrato do Thiago já existente, com recorte do rosto. A imagem
  foi comparada com o anexo; nenhum novo retrato foi gerado.
- O banner do MSN é um botão com texto HTML, moldura e degradês em CSS. As marcas
  Windows e Messenger são os assets individuais já existentes. O antigo banner
  inteiro em WebP deixou de ser usado. Texto quebra conforme a largura, sem
  redimensionar uma imagem inteira. O fundo sob o texto é mais escuro que o da
  referência para preservar contraste; a composição original orienta o resultado.

Validação: `node --test tests/perfil-search.test.mjs` (4 testes), build, escala de
8 pontos (887 declarações) e check do diff. Testes de interação em DOM verificaram
as setas, seletor, busca por Figma e Psicologia, seleção de resultado com rolagem/foco,
estado sem resultados, limpar, Escape, Medium inativo, textos, ação do banner e favicon.
Esses testes não substituem a revisão visual desktop/mobile no navegador, que
continua indisponível nesta sessão.

Próxima rodada solicitada: estudar outras referências para a seção Projetos,
com conteúdo/documento centralizado, antes de definir seu layout.
