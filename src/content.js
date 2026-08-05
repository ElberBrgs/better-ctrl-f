// Better Ctrl+F — content script
// Overlay de busca próprio (estilo Ctrl+F nativo) com busca profunda:
// rola a página automaticamente para carregar conteúdo virtualizado
// (ex.: X/Twitter) até encontrar a palavra, então salta direto para ela.

(() => {
  if (window.__finderCLoaded) return;
  window.__finderCLoaded = true;

  const { normalize, verificarLimites, rastrearEstagnacao, indiceCircular } =
    window.BetterCtrlFCore;

  const STEP_MS = 220;
  const MAX_STEPS = 60;        // ~48 telas de scroll — bem menor que antes
  const MAX_WAIT_MS = 15000;   // 15 s no máximo por busca
  const STAGNANT_LIMIT = 3;    // passos sem crescimento da página = feed esgotado

  let matches = [];        // Array<Range>
  let current = -1;
  let buscaId = 0;         // token de cancelamento da busca profunda
  let query = "";

  // ---------- coleta de matches ----------
  function collectRanges(q) {
    const nq = normalize(q);
    const ranges = [];
    if (!nq) return ranges;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const p = node.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          const t = p.tagName;
          if (t === "SCRIPT" || t === "STYLE" || t === "NOSCRIPT" || t === "IFRAME")
            return NodeFilter.FILTER_REJECT;
          if (p.closest("#__finder_c_root")) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );
    let node;
    while ((node = walker.nextNode())) {
      const text = normalize(node.nodeValue);
      let idx = text.indexOf(nq);
      while (idx !== -1) {
        const r = document.createRange();
        r.setStart(node, idx);
        r.setEnd(node, idx + nq.length);
        ranges.push(r);
        idx = text.indexOf(nq, idx + nq.length);
      }
    }
    return ranges;
  }

  // ---------- highlights ----------
  const useHighlights = typeof CSS !== "undefined" && CSS.highlights;
  let hlAll = null, hlCurrent = null;
  if (useHighlights) {
    hlAll = new Highlight();
    hlCurrent = new Highlight();
    CSS.highlights.set("finder-c-all", hlAll);
    CSS.highlights.set("finder-c-current", hlCurrent);
    const style = document.createElement("style");
    style.textContent = `
      ::highlight(finder-c-all) { background-color: #ffe066; color: #000; }
      ::highlight(finder-c-current) { background-color: #1d9bf0; color: #fff; }
    `;
    document.head.appendChild(style);
  }

  function paint() {
    if (useHighlights) {
      hlAll.clear();
      hlCurrent.clear();
      for (const r of matches) hlAll.add(r);
      if (current >= 0 && matches[current]) hlCurrent.add(matches[current]);
    }
  }

  function clearHighlights() {
    if (useHighlights) { hlAll.clear(); hlCurrent.clear(); }
  }

  // ---------- overlay (Shadow DOM) ----------
  const host = document.createElement("div");
  host.id = "__finder_c_root";
  // Faz handlers globais da página (que abrem diálogos ao teclar) tratarem
  // eventos vindos do overlay como digitação em campo editável.
  host.contentEditable = "true";
  host.tabIndex = -1;
  const shadow = host.attachShadow({ mode: "closed" });
  shadow.innerHTML = `
    <style>
      .box {
        position: fixed; top: 12px; right: 16px; z-index: 2147483647;
        display: flex; align-items: center; gap: 6px;
        background: #16181c; color: #fff; border-radius: 10px;
        padding: 6px 8px; font: 13px system-ui, sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,.4);
      }
      input {
        background: #2f3336; border: 1px solid #536471; border-radius: 6px;
        color: #fff; padding: 5px 8px; width: 200px; outline: none;
        font: 13px system-ui, sans-serif;
      }
      input:focus { border-color: #1d9bf0; }
      .count { min-width: 52px; text-align: center; color: #8b98a5; }
      button {
        background: transparent; border: none; color: #fff; cursor: pointer;
        font-size: 14px; padding: 4px 8px; border-radius: 6px;
      }
      button:hover { background: #2f3336; }
      .status { color: #8b98a5; font-size: 12px; }
    </style>
    <div class="box">
      <input id="q" type="text" placeholder="Buscar na página (profundo)…" />
      <span class="count" id="count"></span>
      <button id="prev" title="Anterior (Shift+Enter)">↑</button>
      <button id="next" title="Próximo (Enter)">↓</button>
      <span class="status" id="status"></span>
      <button id="close" title="Fechar (Esc)">✕</button>
    </div>
  `;
  const input = shadow.getElementById("q");
  const countEl = shadow.getElementById("count");
  const statusEl = shadow.getElementById("status");

  function open(prefill) {
    if (!host.isConnected) document.documentElement.appendChild(host);
    if (prefill) input.value = prefill;
    input.focus();
    input.select();
    if (input.value) onQuery(input.value);
  }

  function close() {
    buscaId++; // cancela qualquer busca profunda em andamento
    host.remove();
    clearHighlights();
    matches = [];
    current = -1;
  }

  function updateCount() {
    countEl.textContent = matches.length ? `${current + 1}/${matches.length}` : "0/0";
  }

  function goTo(i) {
    if (!matches.length) return;
    current = indiceCircular(i, matches.length);
    const r = matches[current];
    const el = r.startContainer.parentElement;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    paint();
    updateCount();
  }

  // ---------- busca profunda ----------
  // Regras de parada (qualquer uma interrompe o scroll):
  //   - encontrou o termo
  //   - usuário cancelou (Esc, fechar overlay, nova busca)
  //   - limite de passos ou de tempo
  //   - página estagnada: altura do documento não cresceu por STAGNANT_LIMIT
  //     passos consecutivos (em feed infinito o scrollY sempre cresce — a
  //     altura total é o sinal honesto de que não há mais nada carregando)
  async function deepFind() {
    const meuId = ++buscaId;
    const cancelado = () => meuId !== buscaId;

    matches = [];
    current = -1;
    clearHighlights();
    updateCount();
    statusEl.textContent = "procurando…";
    const inicio = Date.now();
    let passos = 0;
    let estagnacao = { alturaAnterior: -1, passosSemCrescimento: 0, estagnado: false };

    while (true) {
      const limite = verificarLimites({
        passos,
        maxPassos: MAX_STEPS,
        decorridoMs: Date.now() - inicio,
        maxEsperaMs: MAX_WAIT_MS,
        cancelado: cancelado(),
      });
      if (!limite.continuar) break;

      matches = collectRanges(query);
      if (matches.length) {
        statusEl.textContent = "";
        goTo(0);
        return;
      }

      if (estagnacao.estagnado) break;

      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "instant" });
      passos++;
      await new Promise((r) => setTimeout(r, STEP_MS));

      estagnacao = rastrearEstagnacao(
        estagnacao,
        document.documentElement.scrollHeight,
        STAGNANT_LIMIT
      );

      // O feed virtualizado pode re-renderizar e roubar o foco do input;
      // sem foco, a próxima tecla cai na página (ex.: abre o composer do X).
      if (host.isConnected && document.activeElement !== host) input.focus();
    }

    if (cancelado()) return;

    // tenta também do topo (a palavra pode estar acima)
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, STEP_MS));
    if (cancelado()) return;
    matches = collectRanges(query);
    statusEl.textContent = matches.length ? "" : "não encontrado";
    if (matches.length) goTo(0);
    else updateCount();
  }

  function onQuery(q) {
    buscaId++; // nova busca cancela qualquer scroll em andamento
    query = q;
    current = -1;
    if (!q.trim()) { matches = []; paint(); updateCount(); statusEl.textContent = ""; return; }
    matches = collectRanges(q);
    if (matches.length) {
      statusEl.textContent = "";
      goTo(0);
    } else {
      updateCount();
      deepFind();
    }
  }

  // ---------- eventos ----------
  let debounce;
  input.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => onQuery(input.value), 250);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); goTo(current + (e.shiftKey ? -1 : 1)); }
    if (e.key === "Escape") close();
  });
  // Impede que atalhos globais da página (ex.: composer do X) reajam à digitação
  // dentro do overlay — eventos de teclado atravessam o shadow root (composed).
  // Fase bubble: o input já processou suas teclas antes de bloquearmos a subida.
  for (const type of ["keydown", "keyup", "keypress", "beforeinput"]) {
    host.addEventListener(type, (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    });
  }
  shadow.getElementById("next").addEventListener("click", () => goTo(current + 1));
  shadow.getElementById("prev").addEventListener("click", () => goTo(current - 1));
  shadow.getElementById("close").addEventListener("click", close);

  window.addEventListener("keydown", (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "f") return;
    e.preventDefault();
    e.stopPropagation();
    open(window.getSelection()?.toString().trim() || "");
  }, true);

  window.__finderC = { open, close, onQuery };
})();
