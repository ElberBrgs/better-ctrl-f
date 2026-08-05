import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const core = require("../../src/search-core.js");

// ---------- busca.feature ----------
Given("o texto da página {string}", function (texto) {
  this.texto = core.normalize(texto);
});

When("o usuário busca {string}", function (termo) {
  this.termo = core.normalize(termo);
});

Then("a busca encontra uma ocorrência", function () {
  assert.ok(this.texto.includes(this.termo));
});

Then("a busca não encontra ocorrências", function () {
  assert.ok(!this.texto.includes(this.termo));
});

// ---------- busca-profunda.feature ----------
Given(
  "uma busca profunda com limite de {int} passos e {int} ms",
  function (maxPassos, maxEsperaMs) {
    this.limites = { passos: 0, maxPassos, decorridoMs: 0, maxEsperaMs, cancelado: false };
  }
);

When("{int} passos de scroll são executados sem encontrar o termo", function (passos) {
  this.limites.passos = passos;
  this.resultado = core.verificarLimites(this.limites);
});

When("o tempo decorrido atinge {int} ms", function (ms) {
  this.limites.decorridoMs = ms;
  this.resultado = core.verificarLimites(this.limites);
});

When("o usuário cancela a busca no passo {int}", function (passos) {
  this.limites.passos = passos;
  this.limites.cancelado = true;
  this.resultado = core.verificarLimites(this.limites);
});

Then("a busca profunda para com o motivo {string}", function (motivo) {
  assert.equal(this.resultado.continuar, false);
  assert.equal(this.resultado.motivo, motivo);
});

Given("uma busca profunda tolerando {int} passos sem crescimento", function (limite) {
  this.limiteEstagnacao = limite;
  this.estado = { alturaAnterior: -1, passosSemCrescimento: 0, estagnado: false };
});

When("a altura da página evolui para {int}, {int}, {int}, {int}, {int}", function (h1, h2, h3, h4, h5) {
  for (const h of [h1, h2, h3, h4, h5])
    this.estado = core.rastrearEstagnacao(this.estado, h, this.limiteEstagnacao);
});

When("a altura da página evolui para {int}, {int}, {int}, {int}", function (h1, h2, h3, h4) {
  for (const h of [h1, h2, h3, h4])
    this.estado = core.rastrearEstagnacao(this.estado, h, this.limiteEstagnacao);
});

Then("a estagnação é detectada", function () {
  assert.equal(this.estado.estagnado, true);
});

Then("a estagnação não é detectada", function () {
  assert.equal(this.estado.estagnado, false);
});

// ---------- navegacao.feature ----------
Given("{int} ocorrências encontradas", function (total) {
  this.total = total;
});

When("o usuário navega para o índice {int}", function (i) {
  this.indice = core.indiceCircular(i, this.total);
});

Then("a ocorrência atual é a de índice {int}", function (esperado) {
  assert.equal(this.indice, esperado);
});

// ---------- varredura-bidirecional.feature ----------
Given("que o usuário está na posição de scroll {int}", function (y) {
  this.origem = y;
});

When("as fases da varredura são planejadas", function () {
  this.fases = core.gerarFases(this.origem);
});

Then("há {int} fase, começando em {int} e sem limite final", function (total, inicio) {
  assert.equal(this.fases.length, total);
  assert.equal(this.fases[0].inicio, inicio);
  assert.equal(this.fases[0].fim, Infinity);
});

Then("há {int} fases", function (total) {
  assert.equal(this.fases.length, total);
});

Then("a fase {int} começa em {int} e não tem limite final", function (n, inicio) {
  const f = this.fases[n - 1];
  assert.equal(f.inicio, inicio);
  assert.equal(f.fim, Infinity);
});

Then("a fase {int} começa em {int} e termina em {int}", function (n, inicio, fim) {
  const f = this.fases[n - 1];
  assert.equal(f.inicio, inicio);
  assert.equal(f.fim, fim);
});

Then("a fase {int} termina em {int}", function (n, fim) {
  assert.equal(this.fases[n - 1].fim, fim);
});
