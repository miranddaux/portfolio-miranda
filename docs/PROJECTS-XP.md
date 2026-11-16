# Projetos XP — refinamento de 16/11/2026

## Navegação e escopo

Projetos abre ao entrar no desktop XP. A aba Projetos do Sobre Mim mostra o mesmo
explorador diretamente, sem uma etapa intermediária. A busca pode ser aberta nas
duas áreas; cada instância tem IDs próprios. ANIMAE, Navaja e Oficina do Tenista
abrem cases reais dentro da janela XP. UltraGrip e CIAO permanecem em construção.
Playground, ARENA, XP ZONE e FreshLink foram retirados da navegação desta versão.
O rodapé do explorador mostra apenas Meus Projetos.

## Hierarquia editorial e componentes

`CaseDocument` compartilha conteúdo entre XP, Rápido e Noite. A ordem é categorias,
título, descrição, ficha (Função, Ferramentas, Ano), ações, visão do produto,
resumo rápido, contexto, módulos visuais, pesquisa, decisões, jornada, estado,
indicadores propostos e aprendizados. O texto usa primeira pessoa, sem copiar os
fatos dos cases de referência. `caseStudies.js` separa módulos, imagens e fontes.

Categorias são uma lista informativa com rótulo visível, caixa plana e sem relevo.
Botões têm relevo XP e rótulos objetivos: Visitar LP, Ver no Figma, Ver no Behance.
O botão da LP do ANIMAE é verde e aponta para https://animaeapp.com.br/.
O Behance antigo do ANIMAE permanece como link de arquivo, separado dos CTAs.
O período out/2025–out/2026 foi confirmado por Thiago nesta conversa.

As telas mobile do ANIMAE usam molduras de celular em CSS, com prévias em proporção
fixa e link para ampliar a tela original completa. A abertura tem uma grade de três
mockups; os módulos combinam telas individuais e pares, com quebra responsiva.
Navaja ganhou seleção de rosto e catálogo de cortes. Oficina ganhou o guia por
nível de jogo e a vitrine da Home, além de produto e comparador.

A LP tem espaço reservado no final do ANIMAE. O HTML publicado foi acessível, mas
não há ferramenta de navegador disponível para capturar sua aparência atual. A
página de apresentação no Figma é material anterior, não uma captura verificada
da LP atual. O print real deve ser inserido depois, sem simular uma imagem final.
Protótipos navegáveis no Figma ficam para a segunda fase, conforme Thiago pediu.

## Contenção de rolagem

O índice de âncoras do case foi removido. No layout desktop, html/body/root não
rolam e o desktop fica fixado ao viewport com overflow recortado. A rolagem é
interna às janelas e tem overscroll-behavior: contain. A busca do perfil calcula
a posição no próprio painel, sem scrollIntoView sobre todos os ancestrais. Foco
no título/pasta usa preventScroll. Os modos editoriais continuam com rolagem normal.

## Verificação

- Build de produção passou; escala de 8 pontos: 1.157 declarações verificadas.
- `node --test tests/*.test.mjs`: 9 testes passaram, incluindo mídia de cada módulo.
- Testes em DOM: Projetos direto e na aba, IDs únicos, busca, vazio, duas pastas
  pendentes, três cases, categorias não interativas, CTAs, mockups, minimizar/
  restaurar, fechar/próximo, histórico, três modos e acesso direto sem login.
- Regressão do perfil: setas, seletor, busca, foco/rolagem interna, Medium inativo,
  banner MSN e favicon passaram.
- Contraste calculado: botão azul 6,60:1; verde 6,08:1; etiquetas 10,86:1;
  texto secundário na superfície azul 5,65:1; texto principal 14,48:1.
- Nenhuma dependência adicionada.

A ferramenta de navegador permanece indisponível. DOM e contratos CSS não
verificam geometria renderizada; revisão visual de desktop/mobile e reprodução
manual do bug de rolagem devem ser feitas na versão publicada.
