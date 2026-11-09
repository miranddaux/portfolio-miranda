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

- Logo: 256 px no desktop, 208 px no celular e 192 px em telas desktop baixas.
- Plano central: azul fosco `#4C6BBB`; azuis superior e inferior preservados.
- Texto claro: `#F5F7FB`; contraste calculado sobre o plano central ≈4,74:1.
- Hover: amarelo mantido. A área escura do degradê cobre o texto pequeno para
  preservar o contraste; o desvanecimento fica na borda direita do cartão.

## Validação

`npm run check:design` verifica as declarações CSS de layout/tipografia e os
atributos de tamanho de ícones JSX. O verificador aceita apenas a exceção de 20 px
e as espessuras técnicas de 1–3 px. Ele não substitui a avaliação visual no navegador.
