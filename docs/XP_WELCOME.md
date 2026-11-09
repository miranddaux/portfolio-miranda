# Tela de entrada XP — 09/11/2026

Escopo: apenas a abertura anterior à Home, conforme os três anexos e as instruções
do usuário. A Home e os cases não foram redesenhados nesta rodada.

## Investigação da referência

Site: https://mitchivin.com/
README: https://github.com/mitchivin/mitchIvin-xp

O HTML público usa JavaScript em módulos (`src/scripts/main.js`) e CSS dividido
em arquivos importados (`src/styles/main.css`). A tela é composta de HTML real;
`src/styles/gui/boot.css` define faixas, posicionamento, divisor e hover.
O `fonts.css` declara Tahoma regular/bold com webfonts; não copiamos esses arquivos
de fonte. XP.css é uma base creditada no README, mas a abertura tem estilos próprios.

A referência em desktop usa faixas de aproximadamente 100 px, plano central azul,
divisor vertical esmaecido, logo à esquerda, conta à direita e texto no rodapé.
O hover aplica um degradê azul escuro e contorno amarelo ao avatar. A implementação
Miranda segue a composição dos prints, acrescentando amarelo ao nome conforme pedido.

## Implementação

- `src/pages/XPWelcome.jsx`: tela sem autenticação, logo e botão de perfil com avatar vazio.
- `src/styles/welcome.css`: composição desktop/mobile, foco, hover e textura estática suave.
- `src/styles/tokens.css`: azuis 50–950, neutros 50–950, amarelo de destaque.
- `src/App.jsx`: entrada na sessão, retorno à abertura e preservação de links diretos.

A grafia **Tiago Miranda** e o cargo **Project Designer** seguem o pedido desta tela.
Os demais textos existentes foram preservados para as próximas rodadas.

O botão do perfil funciona com clique, Enter ou Espaço nativos de um `button`.
Entrar transfere o foco para o conteúdo da Home. Reiniciar mantém a abertura,
restaura o foco na conta e anuncia a ação. Não há senha nem captura de dados.
Após entrar, `sessionStorage` evita repetir a tela a cada retorno. A URL
`/?entrada=1` força a abertura para avaliação, e “Tela inicial” permite revê-la.
Links para `/cases/*` ou seções da Home passam direto ao conteúdo.

## Assets

Logo Windows XP (800×648 WebP) e ícone de reinício (200×200 WebP) baixados diretamente
dos recursos gráficos da referência por pedido explícito do usuário. Arquivos
preservados sem edição, em `public/assets/xp/`. Origem e atribuições: `docs/ASSETS.md`.
A foto do Mitch não foi usada. O espaço de foto de Miranda está vazio.

## Verificação

- Build Vite passou.
- Teste DOM passou: abertura sem cabeçalho da Home, avatar vazio, nome/cargo, reinício,
  clique para entrar, persistência na sessão, replay e acesso direto a quatro cases.
- Regressão DOM dos três modos, filtros e janelas passou.
- Os dois WebPs são válidos e não vazios; nenhuma URL remota de imagem no componente.
- Contrastes calculados: neutro claro sobre faixa azul escura ≈11,5:1; cargo escuro
  sobre azul médio >4,5:1; amarelo sobre azul de destaque ≈7,2:1. O nome (26 px) e a
  instrução (19 px, bold) usam a regra WCAG para texto grande.

Limite: a ferramenta de navegador compartilhado não foi oferecida e o preview relay
continua indisponível. Não se afirma validação visual de hover ou geometria desktop/
mobile nesta sessão. A publicação permite a avaliação visual pelo usuário.
