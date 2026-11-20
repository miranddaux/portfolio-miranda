import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { CASE_STUDIES, FEATURED_IDS, getCaseStudy, projectLinkAction } from "../src/data/caseStudies.js";
import { ANIMAE_COPY, ANIMAE_WEB_URL } from "../src/data/animaeCase.js";
import { PAGES, pageFor, absolute } from "../src/data/seo.js";

test("o ANIMAE é o case em destaque e tem a copy oficial", () => {
  assert.deepEqual(CASE_STUDIES.map((p) => p.id), FEATURED_IDS);
  const animae = getCaseStudy("animae");
  assert.equal(animae.editorial.h1, "ANIMAE — Aplicativo social de anime");
  assert.equal(animae.period, "out/2025 — atual");
});

test("H2 do case seguem a estrutura oficial", () => {
  assert.deepEqual(ANIMAE_COPY.sections.map((s) => s.title), [
    "Visão geral",
    "O problema e a mudança de direção",
    "Pesquisa e descoberta",
    "Decisões de produto",
    "UX/UI, prototipação e Design System",
    "A solução: como o ANIMAE funciona",
    "Status atual e validação",
    "Aprendizados",
  ]);
});

test("os dois CTAs existem, são HTTPS e a landing antiga não é mais usada", () => {
  const { links } = getCaseStudy("animae");
  assert.equal(links.web, ANIMAE_WEB_URL);
  assert.equal(ANIMAE_WEB_URL, "https://animae-plus-main.vercel.app/");
  assert.equal(links.webLabel, "Explorar versão web");
  assert.equal(links.prototypeLabel, "Ver protótipo no Figma");
  assert.equal(new URL(links.prototype).hostname, "www.figma.com");
  assert.equal(links.site, undefined);
});

test("as dez imagens do case existem, são locais e têm alt e dimensões do arquivo", () => {
  const images = [];
  const walk = (blocks) => blocks.forEach((b) => { if (b.images) images.push(...b.images); if (b.blocks) walk(b.blocks); });
  ANIMAE_COPY.sections.forEach((s) => walk(s.blocks));
  const slugs = new Set(images.map((i) => i.src.split("/").pop()));
  for (const f of ["animae-home", "animae-lista", "animae-perfil-xp", "animae-hub", "animae-feed-comunidade", "animae-quiz-draco", "animae-flow-onb-1", "animae-login", "animae-generos", "animae-flow-streaming"]) {
    assert(slugs.has(`${f}.webp`) || f === "animae-perfil-xp" || f === "animae-home" || f === "animae-lista", f);
  }
  for (const image of images) {
    const path = new URL(`../public${image.src}`, import.meta.url);
    assert(existsSync(path), image.src);
    const bytes = readFileSync(path);
    assert.equal(bytes.readUInt16LE(26) & 0x3fff, image.width, image.src);
    assert.equal(bytes.readUInt16LE(28) & 0x3fff, image.height, image.src);
    assert(image.alt);
  }
});

test("SEO: título, descrição e canonical do case", () => {
  const page = pageFor("/cases/animae");
  assert.equal(page.title, "ANIMAE — Case de Product Design e UX/UI | Thiago Miranda");
  assert(page.description.startsWith("Do streaming ao app social de anime"));
  assert(absolute(page.path).endsWith("/cases/animae"));
  assert.equal(new Set(PAGES.map((p) => p.title)).size, PAGES.length);
});

test("navegação interna preserva abrir em nova aba e cliques modificados", () => {
  const calls = [];
  let prevented = false;
  const click = { button: 0, preventDefault: () => { prevented = true; } };
  projectLinkAction(click, (href) => calls.push(href), "/cases/animae");
  assert(prevented);
  assert.deepEqual(calls, ["/cases/animae"]);
  for (const extra of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { button: 1 }]) {
    prevented = false;
    projectLinkAction({ ...click, ...extra }, () => assert.fail("não deve interceptar"), "/cases/animae");
    assert.equal(prevented, false);
  }
});
