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
