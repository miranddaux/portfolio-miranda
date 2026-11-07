# Portfólio Miranda

Portfólio de Thiago Miranda, Product Designer pleno, em React + Vite + CSS + GSAP.
Esta rodada aproxima a experiência da linguagem Windows XP e usa Tahoma em todo o site.

## Rodar

```bash
npm ci
npm run dev
npm run build
```

Se o cache padrão do npm não for gravável, configure `npm_config_cache` para um
subdiretório gravável do ambiente antes de instalar.

## Modos

- **XP:** experiência inicial com janelas de perfil/projetos, menu Iniciar, atalhos,
  filtros por pasta, minimizar, restaurar, maximizar e fechar. Os três cases ficam
  visíveis ao abrir o site; não há login ou animação de boot.
- **Rápido:** Home editorial clara com resumo de 60 segundos.
- **Noite:** versão escura do modo editorial.

O seletor salva a preferência localmente. Tahoma usa Verdana/Arial como fallback;
nenhum arquivo proprietário de fonte é distribuído.

## Arquitetura

- `src/App.jsx`: seleção de modo, persistência e resolução de rotas.
- `src/components/`: cabeçalho, janela, ícone retrô, card e seções preservadas da Home.
- `src/pages/`: Home editorial, desktop XP e página compartilhada dos cases.
- `src/data/cases.js`: conteúdo dos projetos, separado das interfaces.
- `src/styles/`: base, tokens, layout e camada XP.
- `public/assets/retro/`: dez SVGs locais criados para esta implementação.

Rotas: `/cases/animae`, `/cases/navaja`, `/cases/oficina-do-tenista` e
`/cases/ultragrip`. A hospedagem deve servir `index.html` para rotas da aplicação
que não correspondam a arquivos estáticos. Vite já faz isso no desenvolvimento.

## Validação e pendências

Build e testes de interação no DOM passaram. A prévia visual está indisponível
nesta sessão, portanto desktop 1440 px e mobile ainda precisam de avaliação no
navegador. Detalhes em [docs/AUDIT.md](docs/AUDIT.md).

Ainda faltam screenshots reais/autorizados dos cases, curadoria editorial detalhada,
e-mail público, LinkedIn e CV revisado. As interfaces indicam essas pendências;
nenhum contato ou resultado foi inventado.

A direção visual usa Mitch Ivin como referência. Os assets próprios dele não foram
incorporados por ausência de licença de reutilização identificável. Origem dos
assets e alternativas avaliadas: [docs/ASSETS.md](docs/ASSETS.md).

## Fontes oficiais

- [Figma — Portfólio v1](https://www.figma.com/design/xAoPbyHrtEQ4VjGZ7ZvYO6)
- [Notion — Curadoria final de 03/11](https://app.notion.com/p/40d34785429b81f48205ed2d6dc28fdb)
