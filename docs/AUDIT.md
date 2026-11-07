# Auditoria e rodada XP — 07/11/2026

## Base preservada

Repositório: `miranddaux/portfolio-miranda`. A implementação inicial estava na
branch `codex/portfolio-inicial` (commit `3f05b14`), com PR #1 aberto para `main`.
A branch `main` continha apenas a inicialização do repositório.

`AGENTS.md`, `docs/CODEX_START.md` e `README.md` foram lidos integralmente antes
de alterar o código. O build inicial passou após configurar o cache do npm em
um diretório gravável do workspace.

## O que existia

- React + Vite, GSAP e lucide-react, sem necessidade de novas dependências de produto.
- Home, três temas em memória, três destaques, filtro de trabalhos, Sobre e Playground.
- Cases abertos apenas em modal; um único componente concentrava toda a aplicação.
- Artes abstratas provisórias e dados de contato/CV ainda ausentes.
- O botão “Meu CV” levava ao contato, sem fornecer um currículo.

## Decisões aplicadas

- Pedido mais recente: direção Windows XP próxima de Mitch Ivin e Tahoma no site.
- XP passa a ser a experiência inicial; o seletor mantém Rápido e Noite e salva a escolha.
- Conteúdo e sequência dos três destaques preservados. UltraGrip continua em Mais trabalhos.
- Fontes externas removidas. Tahoma é uma fonte do sistema, com fallback Verdana/Arial;
  nenhum arquivo de fonte proprietário é distribuído.
- Janelas, atalhos, menu Iniciar, barra de tarefas, filtros e controles de janela implementados
  com React/CSS próprios. Não há boot ou login bloqueando a leitura.
- Navegação dos cases passa a usar links e URLs próprias.
- CV indisponível é identificado como “em breve”; nenhuma URL pessoal foi inventada.

## Referências e assets

Figma: página `3 · UI e layout`, mural `89:4`, Home `113:2` e Noite `113:233`.
Notion: curadoria final de 03/11, com prioridade para a decisão de três destaques.
A rodada XP segue a nova direção do usuário; não pretende reproduzir exatamente a
Home editorial do Figma.

O HTML de https://mitchivin.com/ e o README de
https://github.com/mitchivin/mitchIvin-xp foram inspecionados. O repositório não
publica o código da aplicação nem oferece licença para o pacote próprio de assets.
O README atribui imagens e marcas do Windows à Microsoft. Nenhum asset proprietário
do site foi incorporado. Ver `docs/ASSETS.md`.

XP.css foi avaliado como alternativa: MIT, usado como referência pelo Mitch. Optou-se
por CSS próprio para evitar estilos globais conflitantes e manter os três modos, sem
nova dependência. O CSS de XP.css não foi copiado.

## Validação desta rodada

- `npm run build`: passou na base e na versão modificada.
- Teste de interação em DOM com React + linkedom, isolado fora das dependências do
  produto: passou para destaque dos três cases, filtro UltraGrip, minimizar/restaurar/
  maximizar/fechar/reabrir janelas, menu Iniciar e Escape, contato, três modos e
  persistência, filtro Apps, quatro rotas de case, metadados e página não encontrada.
- SVGs: XML válido, dimensões explícitas e arquivos locais não vazios.
- Nenhuma fonte remota ou URL temporária de asset é usada em produção.
- `git diff --check`: sem erros.

**Limite:** não houve revisão visual no navegador. `sites-preview status` retornou
`preview relay unavailable`; a ferramenta `cua_repl.js` não foi disponibilizada.
As regras de preview do ambiente não permitem abrir um servidor/navegador alternativo.
Layout em 1440 px, overflow em celular, foco visual e contraste renderizado precisam
ser conferidos quando a prévia estiver disponível. Teste de DOM não mede geometria.

## Próxima rodada

1. Visualizar em 1440 px e em 390/320 px; ajustar escala, densidade e composição.
2. Inserir screenshots reais e autorizados de ANIMAE, Navaja e Oficina do Tenista.
3. Refinar conteúdo dos cases com evidências oficiais, começando pelo ANIMAE.
4. Configurar e-mail público, LinkedIn e CV revisado.
5. Definir hospedagem com fallback para `index.html` nas rotas `/cases/*`.
6. Avaliar pré-renderização para SEO e validar desempenho/acessibilidade em navegador.
