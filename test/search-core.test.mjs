// Testes de unidade do núcleo puro (src/search-core.js).
// O content script consome exatamente estas funções — sem duplicação.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const core = require("../src/search-core.js");
const { normalize, verificarLimites, rastrearEstagnacao, indiceCircular } = core;

// ---------- normalize ----------
test("normalize: ignora acentos", () => {
  assert.equal(normalize("Você"), "voce");
  assert.equal(normalize("açúcar"), "acucar");
});

test("normalize: ignora maiúsculas/minúsculas", () => {
  assert.equal(normalize("Twitter"), "twitter");
});

test("normalize: texto já normalizado não muda", () => {
  assert.equal(normalize("better-ctrl-f"), "better-ctrl-f");
});

test("normalize: match normalizado encontra original acentuado", () => {
  assert.ok(normalize("Qualquer pessoa pode responder").includes(normalize("re")));
  assert.ok(normalize("você está aqui").includes(normalize("voce")));
});

// ---------- verificarLimites ----------
const base = { passos: 0, maxPassos: 60, decorridoMs: 0, maxEsperaMs: 15000, cancelado: false };

test("verificarLimites: continua dentro dos limites", () => {
  assert.deepEqual(verificarLimites(base), { continuar: true, motivo: null });
});

test("verificarLimites: cancelamento interrompe imediatamente", () => {
  const r = verificarLimites({ ...base, cancelado: true });
  assert.equal(r.continuar, false);
  assert.equal(r.motivo, "cancelado");
});

test("verificarLimites: para no limite de passos (scroll não é infinito)", () => {
  const r = verificarLimites({ ...base, passos: 60 });
  assert.equal(r.continuar, false);
  assert.equal(r.motivo, "limite_passos");
});

test("verificarLimites: para no limite de tempo", () => {
  const r = verificarLimites({ ...base, decorridoMs: 15001 });
  assert.equal(r.continuar, false);
  assert.equal(r.motivo, "tempo_esgotado");
});

test("verificarLimites: cancelamento tem prioridade sobre os demais", () => {
  const r = verificarLimites({ ...base, cancelado: true, passos: 999, decorridoMs: 99999 });
  assert.equal(r.motivo, "cancelado");
});

// ---------- rastrearEstagnacao ----------
test("rastrearEstagnacao: crescimento da página zera o contador", () => {
  let s = rastrearEstagnacao({ alturaAnterior: -1, passosSemCrescimento: 0 }, 1000, 3);
  s = rastrearEstagnacao(s, 2000, 3);
  assert.equal(s.passosSemCrescimento, 0);
  assert.equal(s.estagnado, false);
});

test("rastrearEstagnacao: altura parada incrementa até estagnar", () => {
  let s = rastrearEstagnacao({ alturaAnterior: -1, passosSemCrescimento: 0 }, 1000, 3);
  s = rastrearEstagnacao(s, 1000, 3);
  assert.equal(s.passosSemCrescimento, 1);
  s = rastrearEstagnacao(s, 1000, 3);
  assert.equal(s.passosSemCrescimento, 2);
  assert.equal(s.estagnado, false);
  s = rastrearEstagnacao(s, 1000, 3);
  assert.equal(s.passosSemCrescimento, 3);
  assert.equal(s.estagnado, true);
});

test("rastrearEstagnacao: feed infinito que para de carregar é detectado", () => {
  // Simula: scrollY sempre cresce (virtualização), mas altura total congela.
  let s = { alturaAnterior: -1, passosSemCrescimento: 0, estagnado: false };
  const alturas = [5000, 8000, 8000, 8000, 8000];
  for (const h of alturas) s = rastrearEstagnacao(s, h, 3);
  assert.equal(s.estagnado, true);
});

test("rastrearEstagnacao: retomada do crescimento reseta a detecção", () => {
  let s = { alturaAnterior: -1, passosSemCrescimento: 0, estagnado: false };
  for (const h of [1000, 1000, 1000]) s = rastrearEstagnacao(s, h, 3);
  s = rastrearEstagnacao(s, 4000, 3);
  assert.equal(s.passosSemCrescimento, 0);
  assert.equal(s.estagnado, false);
});

// ---------- indiceCircular ----------
test("indiceCircular: navega próximo/anterior com wrap-around", () => {
  assert.equal(indiceCircular(0, 5), 0);
  assert.equal(indiceCircular(5, 5), 0);   // próximo após o último volta ao primeiro
  assert.equal(indiceCircular(-1, 5), 4);  // anterior ao primeiro vai ao último
  assert.equal(indiceCircular(2, 5), 2);
});

test("indiceCircular: sem ocorrências retorna -1", () => {
  assert.equal(indiceCircular(0, 0), -1);
});
