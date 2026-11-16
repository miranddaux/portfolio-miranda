import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { CASE_STUDIES, FEATURED_IDS, PENDING_PROJECTS, getCaseStudy, nextCaseStudy, projectLinkAction } from "../src/data/caseStudies.js";

test("somente os três projetos definidos têm case disponível", () => {
  assert.deepEqual(CASE_STUDIES.map((p) => p.id), ["animae", "navaja", "oficina-do-tenista"]);
  assert.equal(getCaseStudy("ultragrip"), undefined);
  assert(PENDING_PROJECTS.some((p) => p.id === "ultragrip"));
  assert(PENDING_PROJECTS.every((p) => !FEATURED_IDS.includes(p.id)));
  assert.equal(nextCaseStudy("animae").id, "navaja");
  assert.equal(nextCaseStudy("navaja").id, "oficina-do-tenista");
  assert.equal(nextCaseStudy("oficina-do-tenista").id, "animae");
});

test("mídias são locais, não vazias e preservam as dimensões do PNG original", () => {
  for (const project of CASE_STUDIES) {
    for (const image of [project.cover, ...project.gallery].filter((m) => m.src)) {
      const path = new URL(`../public${image.src}`, import.meta.url);
      assert(existsSync(path), image.src);
      const bytes = readFileSync(path);
      assert(bytes.length > 1000);
      assert.equal(bytes.readUInt32BE(16), image.width, image.src);
      assert.equal(bytes.readUInt32BE(20), image.height, image.src);
      assert(image.alt && image.caption);
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
  assert(getCaseStudy("animae").links.behanceLabel.includes("v1"));
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
