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

A identidade final é **Thiago Miranda · Product Designer**, após a correção do usuário.
Os demais textos existentes foram preservados para as próximas rodadas.

O botão do perfil funciona com clique, Enter ou Espaço nativos de um `button`.
Entrar transfere o foco para o conteúdo da Home. Reiniciar mantém a abertura,
restaura o foco na conta e anuncia a ação. Não há senha nem captura de dados.
Após entrar, `sessionStorage` evita repetir a tela a cada retorno. A URL
`/?entrada=1` força a abertura para avaliação, e “Tela inicial” permite revê-la.
Links para `/cases/*` ou seções da Home passam direto ao conteúdo.

## Assets

O logo personalizado enviado pelo usuário substitui a marca Windows XP usada
na primeira rodada. Foi preparado com fundo transparente para uso sobre azul.
O ícone de reinício (200×200 WebP) veio dos recursos da referência. Arquivos
locais em `public/assets/xp/`. Origem e atribuições: `docs/ASSETS.md`.
A foto do Mitch não foi usada. O espaço de foto de Miranda está vazio.

## Verificação

- Build Vite passou.
- Teste DOM passou: abertura sem cabeçalho da Home, avatar vazio, nome/cargo, reinício,
  clique para entrar, persistência na sessão, replay e acesso direto a quatro cases.
- Regressão DOM dos três modos, filtros e janelas passou.
- Os dois WebPs são válidos e não vazios; nenhuma URL remota de imagem no componente.
- Refinamento: logo com 280 px no desktop/224 px no celular; instrução em 20 px,
  peso 500 (exceção explícita à escala de 8 pontos), com o texto “Para começar, clique em Thiago Miranda para fazer login.”.
- Rodapé contém somente “Depois de entrar, explore meus projetos e conheça meu trabalho.”.
- Paleta final exata: faixas planas `#002697` e centro `#5179E1`. Os azuis da
  interface foram unificados nesses dois tokens e em suas tonalidades derivadas.
- Textura leve e estática de monitor antigo compartilhada com a Home XP.
- Perfil menor: nome 24 px, avatar vazio 64 px no desktop e 56 px no celular.
- Instrução e cargo passaram a off-white `#F5F7FB` por solicitação explícita.
  Contraste base ≈3,79:1: não se afirma AA para esses textos pequenos. Nome de
  24 px continua claro; hover amarelo sobre o azul profundo preservado.
- Espaçamentos, ícones, entrelinhas e medidas fixas seguem os tokens de 8 pontos.
- `npm run check:design` e regressão DOM dos modos, janelas e abertura passaram.
- Guia completo e exceções ópticas: `docs/DESIGN_SYSTEM.md`.

Limite: a ferramenta de navegador compartilhado não foi oferecida e o preview relay
continua indisponível. Não se afirma validação visual de hover ou geometria desktop/
mobile nesta sessão. A publicação permite a avaliação visual pelo usuário.


## Transição “Bem-vindo” e som de login

Ao selecionar o perfil, a aplicação mostra `XPGreeting` entre a entrada e a Home.
A mensagem usa Tahoma itálico, 48 px no desktop/40 px no celular, as mesmas cores
e a textura estática já aprovadas. Dura 2,4 s e pode ser pulada a qualquer momento.
Movimento reduzido desativa o fade de entrada; nenhuma animação controla navegação.

`useXPLogin` mantém três fases (`profile`, `welcome`, `portfolio`), impede entrada
repetida e limpa temporizadores/áudio no unmount. A sessão só é marcada como
iniciada ao chegar à Home. Links de case continuam passando diretamente ao conteúdo.

O áudio é pré-carregado na entrada, mas `play()` é chamado somente dentro do clique
ou ativação por teclado, antes de qualquer `await`. O volume começa em 35%. Som
silenciado é lembrado via `miranda-sound`; o controle também está no cabeçalho.
A transição não depende de o arquivo carregar ou terminar. Rejeição de reprodução
mostra “Tocar som”, e a navegação continua normalmente.

Verificação: build e escala passaram. Teste DOM com áudio simulado passou para
pré-carga sem reprodução, clique, fase intermediária, avanço automático/pular,
preferência silenciosa, mute durante reprodução, bloqueio/retry e cleanup, além
da regressão dos modos, cases e janelas. `ffprobe` validou o MP3 local (4,127 s,
estéreo/44,1 kHz). Reprodução audível e sincronismo no navegador real continuam
sem verificação nesta sessão devido à indisponibilidade do controle de navegador.
