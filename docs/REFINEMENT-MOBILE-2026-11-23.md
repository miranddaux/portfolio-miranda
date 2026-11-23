# Revisão desktop e mobile — continuação de 23/11/2026

Esta rodada substitui as pendências mobile do documento anterior e a decisão de
usar uma recriação Scratch do Purble Place. Mantém a base XP aprovada e o case ANIMAE.

## Conteúdo e desktop

- Agência Disco: menus e megamenus, no perfil e nos PDFs PT/EN (em inglês:
  menus, mega menus). PDFs e WebPs regenerados, ambos em uma página.
- Copy do ANIMAE usa usuário/usuários no lugar de pessoa/pessoas; lista pessoal
  continua sendo o nome correto da funcionalidade.
- Banner principal: container 528 px, imagem 608 px, fade inferior mantido.
- Cards de decisões continuam em 2×2, agora com `--case-surface` como os demais.
- O selo Em estudo permanece em flex alinhado ao centro do título.
- MSN: removida a referência ao DS do portfólio; LinkedIn, e-mail e WhatsApp são
  links reais tanto no perfil de contatos como nas respostas do bot. Espaço de
  8/16 px entre remetente, mensagem, sugestões e ações; linha de 24 px no corpo.

## Mobile

- Atalhos mantêm ícone à esquerda e texto ao lado. Ícones de 64 px, bloco mais
  perto da esquerda, padding lateral de 16 px e alvos grandes.
- Perfil e case aproveitam a largura com 16 px laterais. Ferramentas/tags podem
  rolar horizontalmente, com semântica de lista e aparência informativa.
- Filtro nativo no explorador: Todos, Cases disponíveis e Em construção. A lista
  filtrada é real, combina com busca e informa sua quantidade ao leitor de tela.
- Telas de produto: uma por quadro no celular, proporção original e altura
  natural. Não usa o corte/deslocamento das duplas do desktop. No mobile, os
  demos interativos de tamanho fixo dão lugar às capturas reais dos mesmos assets;
  no desktop continuam interativos. A imagem pode ser ampliada por um link.
- Onboarding segue a mesma regra, com um quadro por tela e links de ampliação.
- Celulares e tablets de toque usam essa adaptação; desktop preserva suas grades.
- Boas-vindas automáticas não cobrem o campo de mensagem no celular. O usuário
  pode abrir o aviso pelo ícone de informação. Abrir o bot não força o teclado.

## Windows Media Player

O mesmo componente, `<video>`/iframe e hooks continuam responsáveis pelo estado.
A apresentação mobile troca o posicionamento via CSS: não cria um segundo vídeo.
Usa moldura azul/prateada glossy em CSS inspirada nos anexos, glifos existentes,
thumbs de progresso/volume já locais e o asset local da bandeira Windows. Não
apresenta uma nova imagem gerada como se fosse o PNG original do anexo.

Visor 16:9, textos e tempo reais, timeline, saltos de 10 s, play/pause, stop,
anterior/próximo, mute, volume, seleção da playlist e tela cheia funcionais.
Reorganizar por breakpoint preserva o elemento de vídeo. A janela acompanha a
mudança de orientação/largura e rola se faltar altura; respeita a safe area.
Os botões mobile têm ao menos 44×44 px. O controle principal recebe mais destaque.
No iPhone/iPad o slider de volume fica indisponível com orientação para os botões
físicos; mute continua disponível. YouTube mantém sua API e o link para a origem.
A disponibilidade de embeds e autoplay continua sob as regras da fonte/navegador.

Corrigido também o loop do HTMLVideoElement em playlist: repetir um vídeo não deve
impedir o evento de fim de avançar para o próximo item.

## Headspace

A demonstração local começa como faixa padrão ao abrir, respeitando a permissão
de áudio do navegador. No mobile, controles acessíveis substituem as pequenas
áreas de clique da skin: a mesma instância de áudio, botões, progresso, volume e
playlist. A skin e o equalizador desktop continuam como antes.

## Purble Place — original ainda pendente

Thiago rejeitou a recriação e informou que não tem os arquivos originais.
A integração Scratch foi retirada, e o item fica inativo com Original em pesquisa.
Não foi trocado por outra recriação nem renomeado para parecer o original.

Fontes verificadas além da pesquisa anterior:

- [Areshkew/purble-place-decomp](https://github.com/Areshkew/purble-place-decomp):
  port WASM que lê arte, sons e layouts originais. A página pede PurblePlace.dll,
  PurblePlace2.dll, CardGames.dll e PurblePlace.exe.mui; não inclui esses recursos.
  Portanto o link público não abre direto no jogo sem os arquivos.
- [simontime/PurblePlaceDecomp](https://github.com/simontime/PurblePlaceDecomp):
  decompilação para Windows, sem jogo web pronto.
- [Port PS4](https://github.com/iHaiDeeZ/PurblePlace-PS4): também exige arquivos
  do Windows e não é um build para navegador.
- [Win7 Simu](https://visnalize.com/win7simu/simulated/purbleplace): identifica-se
  como simulação, não o executável original solicitado.
- [PurblePlace.online](https://purbleplace.online/) e
  [PurblePlaceGame.org](https://purbleplacegame.org/about/): declaram recriações.
  PurblePlace.app também identifica seu jogo web como remake de Comfy Cakes.
- Busca ampliada incluiu repositórios Purble Place, asset extractors, ports,
  Wine/Boxedwine/Emupedia e possíveis incorporações. Não houve versão original
  jogável e incorporável confirmada que atendesse ao pedido sem arquivos adicionais.

## Verificação

- `node --test tests/*.test.mjs`: 15 testes.
- `npm run check:design` e `npm run build`.
- `MIRANDA_QA_BASE_URL=http://127.0.0.1:5175 python tests/media-player-browser.py`:
  Vite em execução; requer Python/Playwright, Chromium e ffmpeg. Gera um vídeo de
  teste temporário e responde aos pedidos HTTP Range corretamente. A fixture em
  tests/fixtures não entra no build de produção.
- Chromium a 320, 375, 390, 430, 768 e 1440 px: sem overflow do documento/player;
  proporção das três telas preservada; apenas um elemento de vídeo.
- Controles reais: reprodução avança, pausa, seek por teclado e toque, arraste,
  stop, volume/mute, seleção de faixa; resize mantém o mesmo elemento de vídeo;
  fullscreen e callbacks de fechar/minimizar. iPhone emulado verifica o estado
  de volume indisponível; não substitui teste em Safari físico.
- Fluxos do app a 390 px: filtro de projetos, abertura/minimização, links de contato,
  Headspace com demo avançando e ausência de exceções JavaScript.
- Centro do título Desenvolvimento e do selo: ambos em y=603 na medição mobile.

Os avisos de bundle principal e import do motor DOOM são anteriores e persistem.
