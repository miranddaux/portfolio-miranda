# Handoff — Modo XP (sessão com Claude, 12 a 15/11/2026)

Resumo para qualquer pessoa ou chat do Claude que continue este trabalho.
Branch: `claude/modo-xp-desktop`. Prévia privada: https://claude.ai/artifact/9zCTgCnobGmEuPg2BQTZ3U

## Regras fixas do Thiago (valem para tudo)
- Fonte Segoe UI em tudo. Regra de 8 pontos. Texto nunca abaixo de 12 px; tamanhos 12, 14, 16 e depois a escala de 8 (24, 32...).
- Figma é a fonte da verdade quando ele desenha: "exatamente igual". Arquivo: Portfólio v1 — Miranda (`xAoPbyHrtEQ4VjGZ7ZvYO6`), página 5:14 (Home 125:36, telas de login 134:2 e 134:14, Home com menu 133:2 e 133:176, painel 135:2065).
- Todo botão segue o `.xp-button` azul com ▸ à esquerda. Toda janela/modal usa `JanelaXP` (mover, redimensionar, maximizar, minimizar).
- Nunca inventar links, números, clientes ou resultados. Não copiar o código do Mitch Ivin (só referência visual).
- Respostas em português, simples, passo a passo, sempre dizendo o próximo passo.

## O que foi feito
**Login e entrada**
- Tela de login e "Bem-vindo" com a foto do Thiago (recorte do rosto), sem botão de som; "Ir para o portfólio" removido (a tela segue sozinha).
- F11 alterna tela cheia do site; aviso discreto "Tela cheia" no canto (`AvisoTelaCheia`, `useTelaCheia`).

**Área de trabalho**
- Barra de tarefas e menu Iniciar réplicas do Figma (`BarraDeTarefas`, `MenuIniciar`, `replica-figma.css`); botão start com logo e texto equilibrados.
- Ícones: Sobre mim, Meu currículo, Projetos, Entre em contato.
- Balão de boas-vindas (2,5 s, som, fecha sozinho em 10 s) — `DesktopAlerts`.
- Ruído de TV/monitor antigo, leve (`.ruido-tv` em `painel-xp.css`).

**Janela "Sobre mim"** (`PainelSobre`, abre sozinha)
- Abas: Sobre, Experiência, Educação, Habilidades, Projetos, Contato.
- Foto com carregamento de cima para baixo (`FotoXP`).
- Dados centralizados em `src/data/perfil.js` (experiência, adicional, educação, certificações, habilidades, ferramentas, línguas, contato).
- Contato: botões LinkedIn, E-mail (abre a janela de e-mail) e WhatsApp; Orkut e MSN de brincadeira.

**Meu currículo** (`JanelaCurriculo`)
- Currículo de 1 página em 2 colunas (PT e EN): `public/assets/cv/*.pdf` e prévias `.webp`.
- Zoom com clique, arrastar, Salvar baixa o PDF, troca de idioma na barra de status.
- Gerador do PDF fica fora do repositório (HTML + Playwright); se precisar refazer, reconstruir a partir dos PDFs.

**Entre em contato comigo** (`JanelaEmail`)
- Formulário estilo programa de e-mail; "Enviar mensagem" abre o e-mail da pessoa com tudo preenchido (sem servidor).

**MSN** (`Msn.jsx`, `msn.css`, `src/data/bot.js`, `src/lib/sons.js`)
- Ícone na bandeja abre a lista de contatos; aviso "ThiagoBot diz:" sobe depois do balão, com som; botão "ThiagoBot" pisca laranja na barra.
- Conversa com ThiagoBot: respostas prontas por palavra-chave (sem IA), links de assunto, botões que abrem janelas, "chamar a atenção" (janela treme), Bloquear.
- Ícones online/offline/logo enviados pelo Thiago em `public/assets/xp/msn/`.
- 15/11 (rodada MSN 7, benchmark e assets do Figma 144:10160):
  - Lista de contatos: barra de menu, cabeçalho claro com foto, status e frase, abas laterais, "Adicionar um contato" (abre o LinkedIn), grupos com caixas +/−, status "Ausente" com relógio, banner no rodapé.
  - Conversa: barra de menu, barra grande (Vídeo, Voz, Atividades, Jogos, Bloquear — cada um responde no chat), campo "Para:", aviso amarelo, seletor com os 40 emoticons, piscadela, chamar a atenção, botão Enviar grande.
  - Emoticons por código (`:)`, `;)`, `(L)`...) viram imagem no chat, nos status e no aviso (`src/data/emoticons.js`).
  - "Minha imagem de exibição": o visitante escolhe Patinho, Flor, Cachorro ou Avião (lembrado no navegador).
  - Som de mensagem: arquivo enviado pelo Thiago (`public/assets/audio/msn-mensagem.mp3`), um toque por resposta; os outros sons continuam sintetizados.
  - Celular: o balão de boas-vindas não vaza mais da tela.
- 15/11 (noite), pedidos do Thiago:
  - Nome do bot: "Thiago Bot" (`NOME_BOT` em Msn.jsx), foto `public/assets/xp/msn/thiago-bot.webp` (enviada por ele).
  - Moldura das imagens de exibição: `public/assets/xp/msn/moldura.png` (enviada por ele), componente `Moldura`.
  - Lista de contatos sem as abas laterais; frases dos contatos com mais emoticons do pack do Figma; banner do rodapé trocado pela imagem `banner.webp` (enviada por ele).
  - Conversa no layout da referência MitchBot: aba, cabeçalho, barra compacta de ícones (convidar, arquivos, voz, vídeo, Bloquear, tema), Enviar pequeno, pesquisar, avatares com moldura. Os ícones da barra são desenhados em SVG; trocar pelos originais se o Thiago enviar.
  - Som de chamar a atenção: `public/assets/audio/msn-chamar.mp3` (enviado por ele, cortado para 1,6 s).
  - Foto do "Sobre mim" carrega de cima para baixo só na primeira vez da visita (sessionStorage).
  - Ícone do MSN na bandeja em 16 px, proporcional aos outros.
- 15/11 (fim da noite):
  - Ícones da barra da conversa trocados pelos PNGs enviados pelo Thiago (`public/assets/xp/msn/barra/`: convidar, arquivos, voz, video, midia, bloquear). O de bloquear veio com xadrez falso no fundo; o fundo foi removido.
  - Foto nova do Thiago Bot; imagem padrão do visitante = foto do Thiago em pixel (`fotos/thiago-retro.png`), com as outras para trocar.
  - Som de chamar a atenção mais alto (pico em -0,8 dB, volume 100%).
  - Dribbble e Behance em `CONTATO` (perfil.js): Links sociais e aba Contato do Sobre mim, atalhos do MSN e resposta do Thiago Bot.
  - Currículo "Salvar": no site baixa pelo link; na prévia do Claude usa o recurso `downloads` (pede confirmação). Publicar a prévia com `capabilities: {downloads: true}`.

## Pendências
1. URL do Medium (o item aparece como "inativo", conforme pedido de 16/11).
2. MSN: revisar com o Thiago a rodada de 15/11 (benchmark MSN 7). Os assets do MSN são da Microsoft (ver docs/ASSETS.md).
7. Resolvido em 16/11: retirada a afirmação de prazo sem origem confirmada do bot, perfil e currículos PT/EN, incluindo as prévias. Ver `REFINEMENT-2026-11-16.md`.
3. Aba Projetos e textos dos cases: o Thiago vai detalhar depois.
4. Ícone de disquete (Salvar) é desenho próprio; trocar se ele mandar o original.
5. Fonte do PDF do currículo saiu em Inter (Segoe UI não estava disponível no ambiente).
6. Janela `Window.jsx` antiga não é mais usada.

## Como testar
`npm install`, `npm run dev`, `npm run check:design` (escala de 8 px; exceções: `replica-figma.css`, `painel-xp.css`, `msn.css`).

## Continuidade — 23/11

Leia primeiro [REFINEMENT-2026-11-23.md](REFINEMENT-2026-11-23.md): revisão desktop,
fontes editáveis dos CVs, correções Headspace, Purble Place e verificações atuais.
Prioridade seguinte: Thiago fecha QA desktop do ANIMAE antes da rodada mobile/WMP.
