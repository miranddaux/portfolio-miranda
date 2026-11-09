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

Tahoma é solicitada do sistema com `Tahoma, Verdana, Arial, sans-serif`.
A aparência exata depende das fontes instaladas no dispositivo. Não há download ou
redistribuição de Tahoma. lucide-react e GSAP já faziam parte da base.
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

O avatar de Miranda permanece vazio. Nenhum arquivo de Tahoma foi baixado:
a família continua sendo solicitada do sistema, com os fallbacks já documentados.


### Refinamento da identidade — 09/11

O logo de abertura foi substituído por `public/assets/xp/thiago-miranda-xp.png`,
baseado no anexo personalizado enviado pelo usuário nesta conversa: bandeira XP,
“Thiago Miranda”, “xp” e “Product Designer”. A preparação de transparência foi feita
com edição de imagem para compor o logo sobre o fundo azul. Não é um screenshot
de uma página nem uma imagem que substitui texto ou interação da interface.
O logo anterior `windows-xp-logo.webp` deixa de ser usado na tela de entrada.
