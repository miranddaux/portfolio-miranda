# Escala de 8 pontos

A regra vale para Rápido, Noite, XP, abertura e páginas de cases.
As medidas fixas de layout usam tokens em `src/styles/tokens.css`:

- `--space-unit`: 8 px.
- `--space-1` a `--space-16`: 8 a 128 px, de 8 em 8.
- Dimensões maiores: múltiplos inteiros de `--space-unit`.
- Tipografia: 16, 24, 32, 40, 48, 56, 64, 72 e 80 px. Nenhum texto abaixo de 16 px.
- Entrelinhas, margens, padding, gaps, medidas fixas de grid e containers seguem a mesma escala.
- Ícones de componentes usam tamanhos múltiplos de 8.

## Exceção pedida pelo usuário

A frase “Para começar, clique em Thiago Miranda para fazer login.” usa **20 px,
peso 500 (medium)** e entrelinha de 32 px. É a única exceção tipográfica à escala.

## Valores ópticos e comportamento responsivo

Bordas, traços de foco, divisores finos, sombras, tracking e texturas conservam
medidas ópticas pequenas; uma borda não precisa ter 8 px. Porcentagens e frações
de grid continuam fluidas. A proporção natural dos assets é preservada; as medidas
intrínsecas do PNG não são suas dimensões de exibição.

Os headers estreitos têm duas linhas para manter os textos a 16 px. As janelas
reorganizam-se em coluna e suas alturas crescem com o conteúdo.

## Abertura desta rodada

- Logo: 280 px no desktop, 224 px no celular e 208 px em telas desktop baixas.
- Plano central: `#5179E1`; faixas superior/inferior planas: `#002697`.
- Âncoras `--color-xp-mid` e `--color-xp-deep`; o restante da escala azul deriva
  dessas duas cores. As superfícies neutras dos modos Rápido e Noite permanecem.
- Instrução (20 px/500) e cargo (16 px) usam off-white `#F5F7FB` por pedido
  explícito do usuário. O contraste sobre `#5179E1` é ≈3,79:1; essa combinação
  não é registrada como AA para texto pequeno. O hover amarelo permanece.
- O nome é 24 px, claro, com contraste ≈3,79:1 — atende ao critério de texto grande.
- Perfil reduzido: avatar 64 px no desktop/56 px no celular; cartão 320 px.
- Hover amarelo sobre azul profundo: ≈9,34:1. O degradê só desvanece na borda.
- Uma camada CRT compartilhada cobre abertura e XP: linhas horizontais a 2,5%
  e máscara vertical a 1%, sem animação ou eventos de ponteiro.
- Nos demais componentes que usam texto escuro `#070E1A`, o contraste mínimo
  calculado com a textura é ≈4,57:1. Isso não substitui auditoria visual no navegador.

## Validação

`npm run check:design` verifica as declarações CSS de layout/tipografia e os
atributos de tamanho de ícones JSX. O verificador aceita apenas a exceção de 20 px
e as espessuras técnicas de 1–3 px. Ele não substitui a avaliação visual no navegador.

## Regra de tipografia e grade (atualizada em 12/11/2026)

- Fonte única: **Segoe UI** (`--font-ui`), com fallback `system-ui, Roboto, Arial`.
- Texto nunca abaixo de **12 px**. Escala: `--text-12`, `--text-14`, `--text-16` e, acima, a escala de 8 px (24…80).
- Layout em múltiplos de 8 px (`--space-*`); `npm run check:design` valida.
- Barra de tarefas e Menu Iniciar: `BarraDeTarefas.jsx`, `MenuIniciar.jsx`, `src/styles/replica-figma.css`,
  espelhando a seção **Sistema de Design · Desktop XP** do Figma (variáveis `xp/*`, `espaco/*`, `raio/*`).
- Exceções vigentes: instrução da tela de boas-vindas (20 px) e `src/styles/replica-figma.css` (barra de tarefas e Menu Iniciar com as medidas exatas do Figma, fora da grade de 8 px e da escala 12/14/16, a pedido do Miranda em 12/11/2026).

## Janela XP e Painel "Sobre mim" (`painel-xp.css`)

- Réplica do Figma `Control Panel` (135:2065): `JanelaXP.jsx` (mover, redimensionar pelas 8 alças, maximizar, setas do teclado) e `PainelSobre.jsx` (barras, painel lateral, abas que trocam o conteúdo no mesmo componente).
- Limite do conteúdo: `--limite-conteudo` (720px) em `.janela-xp`. Abaixo de 760px de largura a janela esconde o painel lateral (container query).
- `painel-xp.css` é exceção à grade de 8 px, como `replica-figma.css`; os textos seguem Segoe UI e só 12/14/16 (título grande: 24).
- Ícones extraídos do Figma em `public/assets/xp/painel/`. A foto vai em `public/assets/xp/foto-thiago.webp` (sem o arquivo, aparece "TM").
