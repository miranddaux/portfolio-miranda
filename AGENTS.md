# Codex instructions — Portfolio Miranda

## Mission
Build a polished, recruiter-first Product Designer portfolio for Thiago Miranda, focused on interviews for remote mid-level Product Designer roles in product companies. Implement in real, maintainable frontend code. The retro Windows XP / videogame identity is a design layer, never an obstacle to reading case studies.

## Source-of-truth priority
1. New explicit user decisions.
2. Notion decision page (2026-11-03): https://app.notion.com/p/40d34785429b81f48205ed2d6dc28fdb
3. Figma UI layout: https://www.figma.com/design/xAoPbyHrtEQ4VjGZ7ZvYO6/Portf%C3%B3lio-v1-%E2%80%94-Miranda?node-id=113-2
   Night theme: node 113:233. Figma page `3 · UI e layout` includes both frames and `Portfólio em Modo XP` code instance.
4. Notion UX structure: https://app.notion.com/p/3fe34785429b810b984bea054c22588f
5. This repository's existing code.

## Latest explicit user direction — 2026-11-09
- Refine one screen at a time, starting with the XP welcome screen before the Home.
- Recreate the supplied XP welcome layout. Use the latest user-supplied Thiago Miranda XP logo, at a smaller size, and the restart artwork requested from mitchivin.com. Attribute sources accurately.
- Welcome screen copy: Thiago Miranda, Product Designer. Leave the avatar empty. Hover/focus: darker blue background, yellow avatar border and name.
- Use system Tahoma UI. Apply an 8px fixed layout and typography scale across all modes and case pages, minimum text 16px. The welcome instruction is the explicit exception: 20px, weight 500, line-height 32px. Keep borders/focus strokes thin. Use the exact user palette: #002697 for top/bottom bands and #5179E1 for the center. Standardize UI blues on those anchors with derived tints. Apply a subtle static CRT texture to welcome/XP, without flicker. Profile name is 24px and avatar 64px desktop/56px mobile. Small text over the center uses #070E1A for contrast. See docs/DESIGN_SYSTEM.md.
- Welcome is presentational, never authentication. Preserve direct access to cases and existing modes.

## Key product decisions
- Featured three: ANIMAE, Navaja, Oficina do Tenista, in that order. UltraGrip belongs to `Mais trabalhos`, NOT to featured trio.
- Navigation: Cases, Playground, Sobre, Contato; CV one click from home when valid asset exists.
- Three UI modes: Rápido (default, paper/charcoal/coral), Noite (dark), XP (nostalgic). Do not create a full simulated operating system that hides the work.
- Text legible; decorative pixel type only for labels. Headings Unbounded; prose Neue Montreal (or rights-cleared fallback); pixel labels Press Start 2P (or equivalent).
- Above the fold: who Thiago is, Product Designer pleno, Figma-to-code specialty, featured work and obvious actions.
- Case structure: context, specific problem, Thiago's role, evidence and decisions/trade-offs, actual outcome/status (never invented), takeaways, next case.
- Home may use `modo rapido` 60-second overview. Mobile must remain usable, but desktop is first priority.
- IA use may be described accurately: Figma, Claude MCP/Claude Code assisted process. Do not imply independent engineering contributions not evidenced.
- ANIMAE is a founder-led anime community/tracking app; evolved from streaming idea due to licensing challenges. Focus on decision quality and design system, not mascot as main story.
- Navaja: the hypothesis changed after three interviews with barbers from scheduling to hairstyle communication. Concept project, not shipped product.
- Oficina do Tenista: e-commerce case; require screenshots and verified outcomes before asserting metrics.
- Disco client projects: publication must respect contracts, approval and data sensitivity; no invented numbers.
- SouJunior hackathon: squad won among 30 teams; do not claim 'only designer' (user corrected to designer and mentor).

## Current stack and implementation rules
- Existing React + Vite + CSS + GSAP + lucide-react. Inspect installed dependencies and existing components before adding anything.
- Prefer semantic links for navigation, accessible dialogs for case content; support keyboard navigation, escape close, focus management, `prefers-reduced-motion` and WCAG AA contrast.
- GSAP is progressive enhancement; no animation should block content or SEO. Keep transitions restrained and avoid scroll hijacking.
- Extract reusable primitives and data-driven case content. Avoid one enormous component in `src/main.jsx` in the next refactor.
- Keep CSS tokens in one place and give theme modes stable variables.
- Preserve text and working sections until their replacements are validated. No fabricated CV, email, LinkedIn URLs, Figma assets, metrics or customer testimonials.
- Never download third-party fonts or licensed Windows XP icon artwork without checking redistribution rights. Prefer open-source or original-inspired icons/components and document attribution.
- Never copy the full page from reference portfolios (especially Balan). Borrow interaction patterns only; establish distinct visual identity.

## Execution plan for the next Codex session
1. Run `npm install`, `npm run build`, check current behavior and record any errors.
2. Refactor into `src/components`, `src/data`, `src/styles` without changing current copy or behavior.
3. Implement full case routes (`/cases/animae`, `/cases/navaja`, `/cases/oficina-do-tenista`) and recruiter-friendly summaries, replacing modal-only deep-link limitations. Add accessible back/next navigation.
4. Match Figma Home `113:2` and `113:233` at desktop 1440 with the exact local design assets, after fetching them from Figma and verifying licensing/assets. Existing CSS project art is a placeholder.
5. Build an original XP component layer for window chrome, buttons, tabs, status badges, and folder navigation while keeping content accessible.
6. Check responsive layout, keyboard navigation, light/dark theme, reduced motion, metadata, and link correctness. Add no-op/disabled UI only with explicit explanation, never misleading CTA.
7. Publish via branch + PR, not direct changes to main, unless user explicitly requests direct push.

## Definition of done for each change
- Build passes; implementation matches relevant Figma frame or clearly states documented deviations.
- Every visible CTA works or is explicitly labeled unavailable.
- There are no invented performance figures, false shipped-product claims, broken links, or inaccessible controls.
- Desktop 1440px reviewed, plus a basic mobile overflow check.
- Summarize what changed, what was tested, and what remains blocked by missing content/assets.
