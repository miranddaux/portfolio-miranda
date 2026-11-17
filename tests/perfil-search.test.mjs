import assert from "node:assert/strict";
import test from "node:test";
import { ABAS_PERFIL, abaVizinha, buscarNoPerfil } from "../src/data/perfilSearch.js";

test("setas percorrem as seis abas em ordem e param nos extremos", () => {
  let atual = "sobre";
  const ordem = [atual];
  for (let i = 1; i < ABAS_PERFIL.length; i++) {
    atual = abaVizinha(atual, 1);
    ordem.push(atual);
  }
  assert.deepEqual(ordem, ["sobre", "experiencia", "educacao", "habilidades", "projetos", "contato"]);
  assert.equal(abaVizinha("contato", 1), "contato");
  assert.equal(abaVizinha("sobre", -1), "sobre");
  assert.equal(abaVizinha("habilidades", -1), "educacao");
});

test("pesquisa conteúdo real em várias abas sem depender de acentos ou caixa", () => {
  const figma = buscarNoPerfil("  FIGMA  ");
  assert(figma.some((r) => r.aba === "experiencia"));
  assert(figma.some((r) => r.aba === "educacao"));
  assert(figma.some((r) => r.id === "perfil-ferramentas"));
  assert.deepEqual(buscarNoPerfil("psicologia"), buscarNoPerfil("PSICOLOGÍA"));
  assert(buscarNoPerfil("ingles").some((r) => r.id === "perfil-linguas"));
  assert(buscarNoPerfil("mentoria").some((r) => r.titulo.includes("SouJunior")));
  const formacao = buscarNoPerfil("formação");
  assert(formacao.length > 0);
  assert(formacao.every((r) => r.aba === "educacao"));
});

test("combina palavras e encontra informações específicas e contatos", () => {
  assert.deepEqual(buscarNoPerfil("UNIP gráfico").map((r) => r.id), ["perfil-educacao-0"]);
  assert.deepEqual(buscarNoPerfil("SouJunior 30").map((r) => r.id), ["perfil-adicional-1"]);
  assert(buscarNoPerfil("WhatsApp").some((r) => r.id === "perfil-contato"));
  assert(buscarNoPerfil("Shopify Figma").some((r) => r.id === "perfil-experiencia-0"));
});

test("consulta vazia e conteúdo inexistente não produzem resultados fictícios", () => {
  assert.deepEqual(buscarNoPerfil("  "), []);
  assert.deepEqual(buscarNoPerfil("xyz987inexistente"), []);
  assert.deepEqual(buscarNoPerfil("Figma xyz987inexistente"), []);
});
