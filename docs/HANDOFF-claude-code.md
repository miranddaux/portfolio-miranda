# Handoff — Portfólio Miranda (foco 100% ANIMAE)

Branch: `claude/animae-demos-projetos` (já no GitHub, **PR ainda não aberto**). Regras do `AGENTS.md` valem: branch + PR (nunca push direto na `main`), Segoe UI no site, grade de 8 pt, texto mínimo 12 px, nenhum número inventado, todo botão funciona ou está marcado como indisponível, conferir desktop 1440 + overflow mobile, rodar `npm run build` e `npm run check:design`.

## O que foi feito nesta branch
1. **Minha Lista (demo + imagem fixa):** contador "Assistindo" corrigido para **3** (2 quando o anime sai da lista). `public/assets/cases/animae-lista.webp` regerada a partir da própria demo (860x1864). Era o "12" gravado na imagem antiga.
2. **Home animada** (`src/components/AnimaeHomeDemo.jsx`): banner rotativo com pontos, toque em "Adicionar" (vira "Na lista" com check desenhando, fundo `#F9FAFF` 8%), a tela rola até "Amigos Online" e "Continue assistindo" e volta. Loop ~13 s.
3. **Feed > Amigos animado** (`src/components/AnimaeFeedDemo.jsx`): rola, curte (5→6), toca no ícone de comentário, a folha de comentários sobe (layout do Figma 2119:1250), digita, envia, chat rola, fecha, contador 2→3. Loop ~15 s.
4. Base compartilhada: `src/components/useDemoTela.js` (escala 430 px → container, visibilidade, `prefers-reduced-motion`). As 3 demos ficam registradas em `DEMOS` no `CaseDocument.jsx` e ligadas por `demo: "lista" | "home" | "feed"` em `src/data/caseStudies.js`. Estilos em `src/styles/animae-demo.css` (`ad-*`, `ah-*` Home, `fd-*` Feed, `qd-*` Quiz; arquivo fora da checagem de 8 pt porque replica medidas do app).
5. **Projetos:** removidos Oficina do Tenista e UltraGrip (pasta, Home, busca, bot, visualizador). **ANIMAE** segue como case completo; **Navaja** e **CIAO** ficam "Em construção" (pasta apagada, sem link; `/cases/navaja` e `/cases/ciao` mostram "Este case está em construção"). Na pasta, o ANIMAE mostra "Web app • Comunidade • Anime" só ao passar o mouse.
6. **Paint** refeito no layout do Paint do Windows 7 (`AppPaint.jsx` + `src/styles/paint.css`, liberado da regra de 8 pt como o MSN/Media Player). Funcionam: lápis, pincel, borracha, balde, conta-gotas, aerógrafo, linha, retângulo, elipse, retângulo arredondado, desfazer, limpar, salvar PNG. Desativadas e marcadas: seleções, lupa, texto, curva, polígono e menus Exibir/Imagem/Cores/Ajuda.
7. **Bloco de notas** removido do menu Iniciar > Todos os programas.

## Conhecido / para refinar (prioridade de cima para baixo)
- **Arte dos banners da Home:** só existem 2 (Dragon Ball Z, Attack on Titan), recortados dos prints do Figma. O Figma mostra 4 pontos. Pedir ao Thiago a arte dos outros e acrescentar em `BANNERS` (`AnimaeHomeDemo.jsx`). Texto do AoT ("Ação • História • 16+" e a descrição) foi escrito por mim: ele precisa confirmar.
- **Conteúdo inventado só para ter o que rolar** (conferir com o Thiago): seção "Continue assistindo" e amigo "Pedro" na Home; cards "Lucas avaliou Demon Slayer" e "Ana começou One Piece" e a frase digitada no Feed.
- **Demos só se animam sozinhas** (sem clique do visitante). Próximo passo natural: deixar clicável (tocar nos pontos do banner, no ícone de comentário etc.).
- **Posters estáticos** de Home e Feed (`animae-home.webp`, `animae-feed-amigos.webp`) continuam sendo as capturas do Figma e aparecem se a demo falhar (`DemoSegura`). Se mudar o layout das demos, regerar com Playwright (ver como foi feito para `animae-lista.webp`: elemento `.ad-root` fixo em 430x932, `deviceScaleFactor` 2, `reducedMotion`).
- **Cuidado com CSS do case:** `.case-device-screen img` estica imagens; por isso cada demo tem seletores mais específicos (`.case-device-screen .xx-root img…`) e `.case-document .xx-root p` para os parágrafos. Manter o padrão em telas novas.
- **Navaja:** o texto completo do case continua em `STORIES.navaja`/`MODULES.navaja` (`caseStudies.js`), apenas fora de `FEATURED_IDS`. Para publicar: colocar `"navaja"` em `FEATURED_IDS`, remover de `PENDING_PROJECTS`, tirar `pending: true` em `cases.js`.
- **CIAO:** só existe o nome. Não há resumo, categoria nem imagens. Não inventar.
- **`AGENTS.md` está desatualizado** (cita "Featured three: ANIMAE, Navaja, Oficina do Tenista", UltraGrip em "Mais trabalhos"). Atualizar para: case disponível = ANIMAE; Navaja e CIAO em construção.
- Imagens `public/assets/cases/oficina-*.png` ficaram sem uso (apagar se o Thiago confirmar).
- Build avisa de chunk > 500 kB: considerar `import()` das demos e do Paint.
- Hook local reclama de "unpushed commits" porque o clone só acompanha a `main`; a branch remota já está no mesmo commit.

## Pendências fora do código (Figma, arquivo `Sdyl9kTkLtCZaIN13yvIgd`, página 7.1)
- **Rolagem horizontal nos carrosséis do protótipo**: bloqueada. A conta do Figma conectada na sessão (thiago@disco-tec.com) não tem edição no arquivo. O Thiago precisa dar edição a essa conta ou reconectar a conta original.
- Testar no protótipo: troca automática do banner do hero, direção da folha de comentários (`TOP`, ainda não confirmada), scroll com navbar/footer fixos. Usar o dispositivo iPhone 15 Pro Max (430x932).

## Como testar
```
npm ci && npm run build && npm run check:design && npx vite preview --port 4173
```
Abrir `/cases/animae` (as 3 demos entram em loop quando 40% visíveis), `/?modo=xp` (clicar no perfil → Projetos, Iniciar → Todos os programas → Paint).

## Divisão por entregas (portfólio v1, 100% ANIMAE)
**Entrega 1 — MVP publicável (agora)**
- Case ANIMAE completo com as 3 demos; Projetos com Navaja/CIAO "Em construção"; modos XP e Rápido; CV, contato.
- Falta: abrir PR, revisar conteúdo inventado acima, deploy (Vercel), título/descrição/Open Graph, QA 1440 + mobile, `check:design` verde.

**Entrega 2 — Refino do ANIMAE**
- Arte real dos 4 banners; demos clicáveis; link do protótipo Figma; vídeo/GIF curto do app; code-split das demos; acessibilidade (foco, contraste, reduced motion revisados).
- Só colocar métricas se existirem de verdade (a lista de espera do ANIMAE só entra com número real).

**Entrega 3 — Segundo case**
- Publicar o Navaja (conteúdo já escrito), depois o CIAO quando houver material.

**Entrega 4 — Extras**
- Playground, modo Noite revisado, mais apps do desktop XP (itens desativados do Paint), atualização do `AGENTS.md`.
