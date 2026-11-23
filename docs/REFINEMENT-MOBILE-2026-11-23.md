# Revisão desktop e mobile — continuação de 23/11/2026

Esta rodada substitui as pendências mobile do documento anterior e a decisão de
usar uma recriação Scratch do Purble Place. Mantém a base XP aprovada e o case ANIMAE.

## Conteúdo e desktop

- Agência Disco: menus e megamenus, no perfil e nos PDFs PT/EN (em inglês:
  menus, mega menus). PDFs e WebPs regenerados, ambos em uma página.
- Copy do ANIMAE usa usuário/usuários no lugar de pessoa/pessoas; lista pessoal
  continua sendo o nome correto da funcionalidade.
- Banner principal: container 528 px, imagem com 84% da altura, centralizada e sem fade.
  O mockup inteiro cabe no quadro, mantendo sua proporção e inclinação.
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
  natural. Não usa o corte/deslocamento das duplas do desktop. As demos de Home,
  Minha Lista e Feed voltaram a rodar também no mobile, escaladas para a largura
  real do celular e respeitando movimento reduzido. Os loops começam ao abrir o
  case, sem exigir 40% da tela visível, rolagem ou clique. Não há botões de parar
  ou reproduzir. Em aba oculta, os timers param; em movimento reduzido, aparece
  a captura real. As imagens são ilustrativas, sem links de ampliação.
- Onboarding segue a mesma regra, com um quadro por tela, sem links de ampliação.
- Celulares e tablets de toque usam essa adaptação; desktop preserva suas grades.
- Boas-vindas automáticas não cobrem o campo de mensagem no celular. O usuário
  pode abrir o aviso pelo ícone de informação. Abrir o bot não força o teclado.

## Windows Media Player

O mesmo componente, `<video>`/iframe e hooks continuam responsáveis pelo estado.
A apresentação mobile troca o posicionamento via CSS: não cria um segundo vídeo.
Usa moldura azul/prateada glossy em CSS inspirada nos anexos, glifos existentes,
thumbs de progresso/volume já locais e o asset local da bandeira Windows. Não
apresenta uma nova imagem gerada como se fosse o PNG original do anexo.

Visor mobile 3:2, textos e tempo reais, timeline, saltos de 10 s, play/pause, stop,
anterior/próximo, mute, volume, seleção da playlist e tela cheia funcionais.
Reorganizar por breakpoint preserva o elemento de vídeo. A janela acompanha a
mudança de orientação/largura e rola se faltar altura; respeita a safe area.
Os botões mobile têm ao menos 40×40 px. O controle principal recebe mais destaque.
No iPhone/iPad o slider de volume fica indisponível com orientação para os botões
físicos; mute continua disponível. YouTube mantém sua API e o link para a origem.
A disponibilidade de embeds e autoplay continua sob as regras da fonte/navegador.

Corrigido também o loop do HTMLVideoElement em playlist: repetir um vídeo não deve
impedir o evento de fim de avançar para o próximo item.

## Headspace

A demonstração local começa como faixa padrão ao abrir, respeitando a permissão
de áudio do navegador. Por nova decisão do Thiago, Headspace está desabilitado
no mobile até receber os assets. Menu e abertura programática respeitam essa
restrição. A skin e o equalizador desktop continuam como antes.

A recuperação desktop agora renova a URL da mesma faixa e tenta novamente até
duas vezes (400/1200 ms) em falha transitória. A busca tem prazo de 12 s e o
início do áudio, 15 s. Erros de mídia e rejeição do play não duplicam a tentativa.
Trocar, pausar, parar ou fechar cancela tentativas pendentes; sem resultado no
catálogo não dispara uma busca infinita. A seleção nunca é substituída por outra
música. Isso trata falhas temporárias, sem prometer disponibilidade da Apple.

## Purble Place — original ainda pendente

Thiago rejeitou a recriação e informou que não tem os arquivos originais.
A integração Scratch foi retirada, e o item fica oculto tanto no menu principal quanto em Todos os programas.
A flag MOSTRAR_PURBLE_PLACE permanece false; os pontos de integração e o asset
continuam no código para uma futura retomada.
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

- `node --test tests/*.test.mjs`: 20 testes.
- `npm run check:design` e `npm run build`.
- `MIRANDA_QA_BASE_URL=http://127.0.0.1:5173 python tests/media-player-browser.py`:
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
  Headspace mobile desabilitado e ausência de exceções JavaScript.
- Desktop: quatro prévias reais avançaram; uma falha de rede provocada no áudio
  foi recuperada automaticamente na segunda requisição, sem trocar de faixa.
  Trocas rápidas mantiveram a última seleção. Os aborts da faixa anterior são
  esperados; a indisponibilidade espontânea relatada não se repetiu nesse teste.
- `python tests/mobile-ui-browser.py` (mesma variável de URL): contato em 3+2,
  recuo medido de 16 px, controles de janela com 40 px, fotos maiores, home
  centralizada, Headspace mobile inativo e autoplay das demos antes de qualquer rolagem ou clique, sem controles e sem
  links de imagem. O mockup do banner fica inteiro dentro do quadro, sem máscara.
- Centro do título Desenvolvimento e do selo: ambos em y=603 na medição mobile.

Os avisos de bundle principal e import do motor DOOM são anteriores e persistem.

## Novo QA visual solicitado

- Corrigida a soma indevida de recuos: rolagem sem padding + limite com 16 px;
  título, contato e listas não somam outro recuo. Contato usa três redes na
  primeira linha e duas na segunda; até 380 px usa duas colunas e WhatsApp na
  linha inteira. Ícone ao lado do texto e altura de 40 px. Orkut/MSN ocupam
  uma linha com duas colunas.
- Tags de perfil, contexto e ferramentas do case compartilham superfície azul,
  texto escuro, borda e brilho interno discretos. Swipe horizontal sem scrollbar.
- Barra de título e primeira linha da janela têm 40 px. Controles têm alvo real
  de 40 px e face visual de 24 px; o miolo começa abaixo da barra. Sem área de
  toque sobreposta ao conteúdo nem botões escondidos por trás da navegação.
- Foto do perfil: 128 px; avatar do menu: 56 px. Atalhos principais centralizados
  verticalmente na área acima da barra de tarefas, mantendo ícone à esquerda.
- Chat usa 14/24 px; controles de 40 px. Jogos indisponíveis usam um recado curto.
- WMP mobile tem controles menores, visor mais alto e omite tela cheia quando
  o navegador não oferece suporte. Rejeitar fullscreen remove o controle, sem
  manter o recado técnico no rodapé; link de origem continua disponível.

## Currículo — avaliação editorial e aderência às vagas

A base é boa para UI/Product Designer pleno com especialidade em e-commerce.
O PDF tem uma página por idioma, texto extraível, quatro links e cabeçalhos
convencionais. A hierarquia separa bem experiência, projetos, formação e competências.
Duas colunas funcionam visualmente, mas extração de texto não prova compatibilidade
com todo ATS. Para formulários que misturem colunas, a alternativa é uma coluna.

A descrição da Disco é específica: Shopify, PDP/PLP, carrinho, arquitetura de
informação, menus/megamenus, componentes, tokens e handoff. Nomear essas entregas
comunica melhor a atuação real. Checkout permanece fora porque Thiago não o desenha.
As finalidades de usabilidade/conversão estão apresentadas como foco, sem fingir
que uma melhora quantitativa foi medida.

Comparação de requisitos consultados em 23/11/2026:

| Referência | Aderência já demonstrada no currículo | Evidência que ainda fortaleceria a candidatura |
| --- | --- | --- |
| [OLX — Product Designer Pleno](https://vemsergrupoolx.gupy.io/jobs/12811937) | Figma, fluxos, interfaces, arquitetura de informação, Design System e handoff | Casos com pesquisa, validação, uso de dados, acompanhamento pós-entrega e Design QA |
| [Grupo SBF — Product Designer Pleno](https://gruposbftalentos.gupy.io/jobs/12855399) | Navegação, visual design, acessibilidade e prototipação | Evidência de discovery/delivery e métodos de pesquisa aplicados |
| [Freshly Commerce — Senior Product Designer](https://careers.freshlycommerce.com/jobs/product-designer) | Especialidade Shopify, craft visual, componentes e colaboração com desenvolvimento | Referência de competências do domínio, não indicação de senioridade ou garantia de vaga: requer ownership e impacto, além de comunicação fluente |

A maior oportunidade é mostrar efeito das decisões: um antes/depois de navegação,
exemplo de componente reutilizado e resultado validado. Só acrescentar números
quando houver registro. A competência Testes de usabilidade merece evidência em
case/entrevista; pesquisa de mesa do ANIMAE não equivale a entrevista com usuários.
A validação do app continua descrita como próxima etapa.

Manter a distinção entre seis anos em design e tempo no cargo de Product Designer.
Inglês básico está honesto e pode limitar vagas internacionais que exigem comunicação
fluente. Para o currículo, o objetivo é clareza e palavras-chave de ATS, não SEO
como o de uma página web. Nenhuma comparação permite prometer match ou aprovação.
