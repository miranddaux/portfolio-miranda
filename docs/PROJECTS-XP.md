# Projetos e cases — rodada de 16/11/2026

## Escopo e curadoria

Janela Projetos com pastas, baseada no anexo do Thiago. Só ANIMAE, Navaja e
Oficina do Tenista abrem cases. UltraGrip, CIAO, FreshLink, ARENA e XP ZONE
aparecem em cinza, com “Em construção” no hover/foco e indicação permanente em
dispositivos sem hover. Não foram copiados os projetos das referências.

O e-commerce escolhido é Oficina do Tenista, conforme a seleção de três destaques.
Pastas abrem com um clique/ativação do teclado; os links também permitem nova aba.

## Referências e decisões de UX

- Screenshot fornecido: explorador com grade de pastas e estados indisponíveis.
- Dex: https://www.gabrielvaldivia.com/work/dex — coluna central, imagens amplas,
  ficha e blocos por decisão. O conteúdo e as imagens do Dex não foram importados.
- Cashbud: https://omaruiux.com/#/project/cashbud — resumo e processo enxutos.
- E-commerce: https://omaruiux.com/#/project/hm-mena — ritmo da apresentação visual.
- Figma do portfólio: `xAoPbyHrtEQ4VjGZ7ZvYO6`, case v2 `78:2` e explorador `153:3747`.
  Ambos foram lidos com contexto de design e screenshot. Os placeholders e os
  textos antigos do wireframe não substituem a curadoria editorial de 03/11.

A nova solicitação das pastas substitui a lista lateral do explorador anterior.
A linguagem de janela continua usando `JanelaXP`, barra de tarefas e tokens locais.

Cada case contém ficha, links disponíveis, índice, resumo de 60 segundos,
problema, pesquisa, decisões e trocas, jornada proposta, solução, resultado,
plano de medição e aprendizados. A leitura fica numa coluna central dentro da
janela XP; não exige ir a um site externo. Behance é uma saída complementar.

## Conteúdo e limites

Textos condensados das páginas de revisão do Notion:

- ANIMAE: https://app.notion.com/p/40a34785429b814da1b9cc829c60f378
- Navaja: https://app.notion.com/p/40a34785429b81c48f04ee72051d71ba
- Oficina: https://app.notion.com/p/40a34785429b814c8dcdc411a8a50b32

Os achados “2 de 3” do Navaja são apresentados como amostra qualitativa, não
como porcentagens do mercado nem KPIs. Indicadores de negócio aparecem como
“A medir”, separados das entregas. Não foram reaproveitados 30%, 3x ou a métrica
de redução de prazo sem confirmação. Não foram publicados comentários internos.

O link do Behance do ANIMAE mostra a versão antiga de streaming e está
explicitamente identificado como apresentação v1. A imagem v1 tem legenda de
arquivo, separada da tela do MVP social. Navaja tem link confirmado de Behance.
Protótipos navegáveis e Behance da Oficina não foram inferidos. O arquivo Figma
é rotulado como arquivo de design, não como protótipo. A web do ANIMAE vem do
registro de ferramentas do próprio projeto. Sem resultados de uso publicados.

## Arquitetura

- `ProjectsExplorer`: pastas, estados, busca e chrome do explorador.
- `CaseDocument`: documento compartilhado pelos três modos, com mídia e jornada.
- `caseStudies.js`: narrativa, fontes, links, mídia e indicadores separados da UI.
- `App`: resolve rotas e acompanha `popstate`; links reais preservam deep links.
- `XPDesktop`: abre o documento em `JanelaXP` e mantém tarefa/minimizar/restaurar.
- `CasePage`: usa o mesmo documento nos modos editoriais. O antigo endereço de
  UltraGrip permanece com uma indicação de case em construção.

Fechar o case volta às pastas e devolve o foco à pasta correspondente. Os três
cases se encadeiam na ordem definida. Busca de pastas não depende de servidor.
Em telas pequenas, janelas usam o comportamento compacto existente; grade,
ficha, índice e narrativa se reorganizam por largura de container.

## Validação

- Build de produção e escala de 8 pontos: 1.074 declarações verificadas.
- `node --test tests/*.test.mjs`: 8 testes passaram.
- Integridade de mídia: PNGs locais, não vazios, com dimensões declaradas iguais
  ao arquivo; fontes e slots listados em `ASSETS.md`.
- Testes em DOM: grade, busca, sem resultados, pastas pendentes, navegação dos
  três cases, índice, mídia, minimizar/restaurar, próximo/fechar, histórico,
  três modos e link direto sem passar pelo login.
- Nenhuma dependência de produção adicionada.

A ferramenta de navegador não está disponível nesta sessão. Revisão visual de
desktop 1440 px e overflow mobile permanece pendente no endereço publicado;
os testes de DOM não substituem essa avaliação. A composição final ainda pode
ser refinada com Thiago a partir da prévia.
