# Portfólio Miranda · v0.1

Implementação inicial em React + Vite + CSS + GSAP, inspirada nas telas **Home · Modo Rápido · Desktop 1440** e **Home · Modo Noite · Desktop 1440** do Figma, e nas decisões de 03/11 registradas no Notion.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse o endereço local exibido pelo Vite. Para gerar versão de produção: `npm run build`.

## O que funciona

- Três modos de interface: Rápido, Noite e XP (o último é uma interpretação inicial, não uma cópia pixel-perfect do Windows XP).
- Navegação por seções, resumo de 60 segundos, 3 cases principais e filtro de todos os trabalhos.
- Leitura dos cases em modal, com Escape para fechar e aviso de conteúdo editorial provisório.
- GSAP na entrada do hero, respeitando `prefers-reduced-motion`.
- Layout desktop-first e quebras responsivas para tablet/celular.

## Faltando antes de publicar

- Trocar arte abstrata dos cases pelos screenshots reais exportados do Figma (e confirmar permissões dos materiais de clientes).
- Confirmar e-mail público, URL do LinkedIn e anexar CV revisado. Não foram inventados links de contato.
- Substituir resumos iniciais por evidências detalhadas e resultados comprovados de cada case.
- Conferir texto final da Oficina do Tenista e do ANIMAE com as fichas do Notion.
- Testar acessibilidade, desempenho, metadados sociais e deploy.

## Fontes de conteúdo e decisões

- Notion: `Curadoria final de referências e escrita (03/11)`, `Estrutura UX do portfólio (v1)`, `Portfólio v1: discovery e decisões`.
- Figma: https://www.figma.com/design/xAoPbyHrtEQ4VjGZ7ZvYO6/Portf%C3%B3lio-v1-%E2%80%94-Miranda?node-id=113-2

## Nota de implementação

O arquivo de Figma possui duas telas de Home visíveis e uma instância de código. O modo XP aqui é um tema inicial sobre o mesmo layout para manter legibilidade e foco do recrutador. Os elementos gráficos dos cases são placeholders desenhados por CSS, não assets finais.
