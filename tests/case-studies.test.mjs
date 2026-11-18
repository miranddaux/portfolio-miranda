import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { CASE_STUDIES, FEATURED_IDS, PENDING_PROJECTS, getCaseStudy, nextCaseStudy, projectLinkAction } from "../src/data/caseStudies.js";

test("somente os três projetos definidos têm case disponível", () => {
  assert.deepEqual(CASE_STUDIES.map((p) => p.id), ["animae", "navaja", "oficina-do-tenista"]);
  assert.equal(getCaseStudy("ultragrip"), undefined);
  assert.deepEqual(PENDING_PROJECTS.map(p => p.id), ["ultragrip", "ciao"]);
  assert(PENDING_PROJECTS.every((p) => !FEATURED_IDS.includes(p.id)));
  assert.equal(nextCaseStudy("animae").id, "navaja");
  assert.equal(nextCaseStudy("navaja").id, "oficina-do-tenista");
  assert.equal(nextCaseStudy("oficina-do-tenista").id, "animae");
});

test("mídias são locais, não vazias e preservam as dimensões do arquivo original", () => {
  for (const project of CASE_STUDIES) {
    for (const image of [project.cover, ...project.gallery, ...project.modules.flatMap(m => m.images)].filter((m) => m.src)) {
      const path = new URL(`../public${image.src}`, import.meta.url);
      assert(existsSync(path), image.src);
      const bytes = readFileSync(path);
      assert(bytes.length > 1000);
      const webp = image.src.endsWith(".webp");
      const width = webp ? bytes.readUInt16LE(26) & 0x3fff : bytes.readUInt32BE(16);
      const height = webp ? bytes.readUInt16LE(28) & 0x3fff : bytes.readUInt32BE(20);
      assert.equal(width, image.width, image.src);
      assert.equal(height, image.height, image.src);
      assert(image.alt);
    }
  }
});

test("links conhecidos são HTTPS e a apresentação antiga do ANIMAE é identificada", () => {
  for (const project of CASE_STUDIES) {
    for (const [key, href] of Object.entries(project.links)) {
      if (!key.endsWith("Label")) assert.equal(new URL(href).protocol, "https:");
    }
    assert(project.research.intro);
    assert.equal(project.decisions.length, 3);
    assert(project.journeys.every((j) => j.steps.length >= 3));
    assert(project.kpis.every(([name, definition]) => name && definition));
  }
  assert.equal(getCaseStudy("animae").links.behanceLabel, "Ver case completo no Behance");
  assert.equal(getCaseStudy("navaja").links.prototype, undefined);
  assert.equal(getCaseStudy("oficina-do-tenista").links.site, undefined);
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
    projectLinkAction({ ...click, ...extra }, () => assert.fail("não deve interceptar"), "/cases/navaja");
    assert.equal(prevented, false);
  }
});

 test("ANIMAE usa o período confirmado e os módulos têm conteúdo e categorias descritivas", () => {
  const animae = getCaseStudy("animae");
  assert.equal(animae.period, "Out/2025 — out/2026 · 1 ano");
  assert.equal(animae.links.site, "https://animaeapp.com.br/");
  assert.equal(animae.modules.length, 7);
  for (const project of CASE_STUDIES) {
    assert(project.categories.length >= 2);
    assert(project.categories.every(c => c === c.toUpperCase()));
    assert(project.modules.every(m => m.title && m.text && Array.isArray(m.images)));
  }
});
