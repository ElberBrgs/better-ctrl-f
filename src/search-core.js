// Better Ctrl+F — núcleo puro de decisão (sem DOM)
// Carregado como content script clássico antes de content.js e também
// importado pelos testes (UMD mínimo).

(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.BetterCtrlFCore = api;
})(typeof self !== "undefined" ? self : globalThis, function () {
  "use strict";

  // Remove diacríticos e normaliza caixa: "Você" -> "voce"
  function normalize(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  // Decide se a busca profunda deve continuar.
  // Retorna { continuar: boolean, motivo: string|null }
  function verificarLimites({ passos, maxPassos, decorridoMs, maxEsperaMs, cancelado }) {
    if (cancelado) return { continuar: false, motivo: "cancelado" };
    if (passos >= maxPassos) return { continuar: false, motivo: "limite_passos" };
    if (decorridoMs >= maxEsperaMs) return { continuar: false, motivo: "tempo_esgotado" };
    return { continuar: true, motivo: null };
  }

  // Rastreia estagnação do documento: em feeds infinitos o scrollY sempre cresce,
  // mas a altura total para de crescer quando não há mais conteúdo carregando.
  // Retorna novo estado { passosSemCrescimento, estagnado, alturaAnterior }.
  function rastrearEstagnacao(estado, alturaAtual, limiteEstagnacao) {
    const semCrescimento =
      alturaAtual <= (estado.alturaAnterior ?? -1)
        ? (estado.passosSemCrescimento ?? 0) + 1
        : 0;
    return {
      alturaAnterior: alturaAtual,
      passosSemCrescimento: semCrescimento,
      estagnado: semCrescimento >= limiteEstagnacao,
    };
  }

  // Índice de wrap-around para navegação n/m
  function indiceCircular(i, total) {
    if (total <= 0) return -1;
    return ((i % total) + total) % total;
  }

  // Planeja as fases da varredura para cobrir a página inteira.
  // O termo pode estar ABAIXO da posição atual (fase 1: descer até o fim)
  // ou ACIMA dela (fase 2: voltar ao topo e descer até a origem) — em
  // páginas virtualizadas, o conteúdo acima também sai do DOM ao rolar.
  // Retorna [{ inicio, fim }] com fim = Infinity na última fase.
  function gerarFases(origemY) {
    const origem = Math.max(0, origemY || 0);
    const fases = [{ inicio: origem, fim: Infinity }];
    if (origem > 0) fases.push({ inicio: 0, fim: origem });
    return fases;
  }

  return { normalize, verificarLimites, rastrearEstagnacao, indiceCircular, gerarFases };
});
