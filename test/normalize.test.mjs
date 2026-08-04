// Testes da função de normalização usada na busca (espelhada de src/content.js).
// Mantida em sync manualmente: src/content.js é carregado como content script
// puro (sem módulos), então a lógica testável vive aqui duplicada por contrato.
import test from "node:test";
import assert from "node:assert/strict";

function normalize(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

test("ignora acentos", () => {
  assert.equal(normalize("Você"), "voce");
  assert.equal(normalize("açúcar"), "acucar");
});

test("ignora maiúsculas/minúsculas", () => {
  assert.equal(normalize("Twitter"), "twitter");
});

test("texto já normalizado não muda", () => {
  assert.equal(normalize("better-ctrl-f"), "better-ctrl-f");
});

test("match normalizado encontra original acentuado", () => {
  assert.ok(normalize("Qualquer pessoa pode responder").includes(normalize("re")));
  assert.ok(normalize("você está aqui").includes(normalize("voce")));
});
