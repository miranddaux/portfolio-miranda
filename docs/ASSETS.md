# Assets e referências

## Assets locais desta rodada

Diretório: `public/assets/retro/`.

| Arquivo | Uso | Origem |
| --- | --- | --- |
| meadow.svg | Plano de fundo do modo XP | Ilustração vetorial criada para o Portfólio Miranda |
| folder.svg | Projetos e filtros | Ícone original inspirado em interfaces de desktop |
| computer.svg | Playground e favicon | Ícone original |
| profile.svg | Perfil e menu Iniciar | Ícone original |
| document.svg | Indicação de currículo pendente | Ícone original |
| mail.svg | Contato | Ícone original |
| community.svg | ANIMAE, representação provisória | Ícone original, não é screenshot do produto |
| research.svg | Navaja, representação provisória | Ícone original, não é screenshot do produto |
| shop.svg | E-commerce, representação provisória | Ícone original, não é screenshot do produto |
| medal.svg | Conquista SouJunior | Ícone original |

Esses SVGs não são exportações de assets de Mitch Ivin, da Microsoft ou do Figma.
O fundo não é a fotografia Bliss. Não foram incorporados logotipos, sons, fontes
ou imagens proprietárias do Windows. Os ícones provisórios não substituem as futuras
imagens reais dos projetos.

## Inspirações

- Mitch Ivin — https://mitchivin.com/: linguagem de desktop XP, janelas e barra de tarefas.
- ToyFight — https://toyfight.co/: referência futura de composição no Sobre.
- Brand Appart — https://www.brandappart.com/about#arthur-humeau: referência futura de objetos pessoais.

As referências ToyFight e Brand Appart não tiveram assets importados nesta rodada.

## Fontes e bibliotecas

Segoe UI é solicitada do sistema com `"Segoe UI", system-ui, sans-serif`.
A aparência exata depende das fontes instaladas no dispositivo. Não há download ou
redistribuição de Segoe UI. lucide-react e GSAP já faziam parte da base.
XP.css foi avaliado (MIT), mas não foi instalado nem copiado.


## Rodada 09/11 — tela de entrada

Por solicitação explícita do usuário, dois recursos visuais da referência foram
incorporados localmente (sem hotlink):

| Arquivo | Origem | Uso |
| --- | --- | --- |
| `public/assets/xp/windows-xp-logo.webp` | https://mitchivin.com/assets/gui/boot/bad34b1e986eab4c.webp | Logo Windows XP na tela de entrada |
| `public/assets/xp/restart.webp` | https://mitchivin.com/assets/gui/icons/system/b70fdb51d20505bc.webp | Ícone do botão de reinício |

São recursos gráficos associados ao Windows, não assets originais de Miranda.
O README da referência atribui imagens e marcas do Windows à Microsoft Corporation.
Não foi identificada licença aberta para esse pacote; esta documentação não o
classifica como MIT nem presume transferência de direitos. O uso segue o pedido
explícito de reproduzir a interface XP e trazer esses recursos. A foto, a marca
pessoal, o currículo e os projetos do Mitch não foram incorporados.

O avatar de Miranda permanece vazio. Nenhum arquivo de Segoe UI foi baixado:
a família continua sendo solicitada do sistema, com os fallbacks já documentados.


### Refinamento da identidade — 09/11

O logo de abertura foi substituído por `public/assets/xp/thiago-miranda-xp.png`,
baseado no anexo personalizado enviado pelo usuário nesta conversa: bandeira XP,
“Thiago Miranda”, “xp” e “Product Designer”. A preparação de transparência foi feita
com edição de imagem para compor o logo sobre o fundo azul. Não é um screenshot
de uma página nem uma imagem que substitui texto ou interação da interface.
O logo anterior `windows-xp-logo.webp` deixa de ser usado na tela de entrada.


## Som de login XP — 09/11

Arquivo: `public/assets/audio/windows-xp-logon.mp3`.
Origem: https://mitchivin.com/assets/sounds/08bd8dbd83b0f63f.mp3

O recurso foi identificado como o cue `login` no módulo público de áudio da
referência e baixado localmente por pedido explícito do usuário. MP3 estéreo,
44,1 kHz, 4,127 s e 66.499 bytes. Não é uma trilha inventada ou sintetizada.
O som do Windows é material associado à Microsoft; não é classificado aqui
como composição original de Miranda nem como recurso com licença aberta.
A atribuição acompanha a origem e os créditos já registrados para os recursos XP.

Uso: uma reprodução a partir do clique no perfil, com volume de 35%, controle
para silenciar e preferência persistida. Sem hotlink, reprodução automática ao
carregar a página ou loop.


## MSN Messenger — 15/11

Pedido explícito do Thiago: usar os assets do MSN do Figma para chegar mais perto do MSN 7.

- Origem: Figma "Portfólio v1 — Miranda", frame `MSN Assets` (144:10160), colado pelo Thiago.
  Recortes feitos a partir de capturas do Figma (tamanho 1x):
  - `public/assets/xp/msn/emoticons/1.png` a `40.png` — conjunto `Emote` (144:5307), 48×48.
  - `public/assets/xp/msn/fotos/{pato,flor,cachorro}.webp` — imagens de exibição (144:13537, 144:13535, 144:13534), 200×200.
  - `public/assets/xp/msn/barra/{video,voz,jogos,atividades,bloquear}.png` — componente `Icons` (144:6675), 36×36.
  - `public/assets/xp/msn/status-ausente.png` — `User-Active` / Variant3 (144:5410), 40×40.
- Som de mensagem: `public/assets/audio/msn-mensagem.mp3`, arquivo enviado pelo Thiago em 15/11
  (`MSN_Messenger_sound_1.mp3`). O original repetia o toque 3 vezes; ficou só o primeiro toque
  (0,8 s), convertido para MP3 64 kbps.
- Esses emoticons, ícones e o som são material associado à Microsoft (MSN Messenger). Não são
  criações originais do Miranda nem recursos com licença aberta. Ficam documentados aqui para
  a decisão de publicação.

### Rodada 15/11 (noite) — arquivos enviados pelo Thiago
- `public/assets/xp/msn/moldura.png` — moldura da imagem de exibição (185×185, original).
- `public/assets/xp/msn/thiago-bot.webp` — retrato do Thiago Bot, reduzido para 256×256.
- `public/assets/xp/msn/banner.webp` — banner "Portfólio Thiago Live Messenger", reduzido para 660×221 (tem a bandeira do Windows e os bonecos do MSN).
- `public/assets/audio/msn-chamar.mp3` — som de chamar a atenção, cortado do arquivo enviado (1,6 s).

## Links sociais — 16/11

Os anexos de LinkedIn e WhatsApp orientam as marcas e cores desta rodada.
Como os anexos não estavam disponíveis como arquivos no ambiente, foram usadas
versões das marcas disponibilizadas no Wikimedia Commons, salvas localmente:

| Arquivo | Origem |
| --- | --- |
| `public/assets/social/linkedin.png` | https://commons.wikimedia.org/wiki/File:LinkedIn_logo_initials.png |
| `public/assets/social/whatsapp.svg` | https://commons.wikimedia.org/wiki/File:WhatsApp.svg |

São marcas de LinkedIn e WhatsApp/Meta, usadas para identificar os respectivos
destinos de contato. Não são desenhos originais do portfólio. As cores dos assets
são preservadas; não há filtros de recoloração nem hotlink. Dribbble e Behance
mantêm os PNGs existentes no projeto.

## Cases em janela XP — 16/11

| Asset local | Origem e uso |
| --- | --- |
| `cases/animae-lista.png` | Figma ANIMAE `Sdyl9kTkLtCZaIN13yvIgd`, tela `1372:11482`, 428×1024: Minha Lista do MVP social, capa do case. Dados na interface são demonstrativos. |
| `cases/animae-v1.png` | Imagem já publicada por Thiago em `thiagomirandaux.framer.website/work/animae`, asset Framer `tNm4OIUdzzLa5jBbtbSMGPipgE.png`, 1024×427. Exibida somente com legenda de versão 1/streaming. |
| `cases/navaja-capa.png` | Portfólio publicado de Thiago, `/work/navaja`, asset Framer `LKsO3FHoUaXsTu2yPXGsDaG9I.png`, 1024×768. Mockup do conceito, capa do case. |
| `cases/navaja-telas.png` | Mesma página, asset `QcIT7fKS34KUGLUj55B29jt1q8.png`, 1024×569. Estudo da entrada do app, na solução. |
| `cases/oficina-produto.png` | Figma DISCO Cases `zPqNhCbwO8DDnnouXZfa5a`, Oficina do Tenista, `4001:58688` (pdp-detail), 1024×536. Capa do case. |
| `cases/oficina-comparador.png` | Mesmo arquivo, `4001:58692` (section-comparador), 1024×420. Evidência da comparação lado a lado, na solução. |

Os renders do Figma foram obtidos pelo conector. O endpoint de download retornou
403; usou-se a resposta inline de screenshot para salvar o PNG, sem retocar o
conteúdo. URLs temporárias não fazem parte do código. As imagens do Framer são
variantes disponibilizadas pelo próprio CDN, salvas localmente e verificadas.

Os PNGs representam telas dos projetos do próprio Thiago, não prints dos sites
de referência Dex/Omar. O layout do portfólio continua sendo HTML/CSS interativo;
as imagens não substituem o documento. As figuras preservam proporção e podem
ser abertas em nova aba para ampliar. Ilustrações e fotos dentro das interfaces
pertencem aos respectivos projetos/fontes; não são fotografias originais do portfólio.

As pastas usam o asset XP local `xp/figma/pasta.png`, já existente no projeto.
Os marcadores A/N/OT são rótulos em texto, não logotipos inventados.

O componente `SocialLink` compartilha ícone, nome, foco e destinos entre MSN,
Sobre mim, Contato, janela de e-mail e modos editoriais. O nome de nenhuma rede
fica oculto em janelas estreitas. Ícones usam caixas de 16 px nos links compactos
e 24 px nos cards, com `object-fit: contain` para preservar a proporção.

## Novas telas dos cases — 16/11/2026

Imagens preservadas como PNG, sem retoques. As molduras de celular são HTML/CSS.
As capturas dos projetos contêm dados ilustrativos de UI, não métricas de resultado.

| Arquivo em public/assets/cases | Origem |
| --- | --- |
| animae-busca.png | Figma Sdyl9kTkLtCZaIN13yvIgd, nó 1514:8703 |
| animae-feed.png | Mesmo arquivo, nó 1399:2221 |
| animae-perfil.png | Mesmo arquivo, nó 1394:4346 |
| animae-onboarding.png | Mesmo arquivo, nó 1351:6756 |
| oficina-home.png | Figma zPqNhCbwO8DDnnouXZfa5a, nó 4001:58593 |
| oficina-guia.png | Mesmo arquivo, nó 4001:59029 |
| navaja-estilos.png | Portfólio publicado de Thiago; Framer 1uIKFSwW7MVym1mgLMhyoJrHxc.png, variante 1024 |
| navaja-rosto.png | Mesmo portfólio; Framer VKfRNDhIpmbBZ4hFSZAlpSkCV7U.png, variante 1024 |

As imagens Navaja vêm de https://thiagomirandaux.framer.website/work/navaja.
A captura atual da LP https://animaeapp.com.br/ continua pendente; o espaço no case
é identificado como captura em preparação. Nenhum print de referência foi usado
como se fosse uma tela do ANIMAE.
