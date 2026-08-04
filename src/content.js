// Finder-C — content script
// Intercepta Ctrl+F e garante que a palavra seja encontrada mesmo que exija
// scroll adicional (páginas com scroll infinito / virtualizado, como o X).

(() => {
  if (window.__finderCLoaded) return;
  window.__finderCLoaded = true;

  const STEP_MS = 220;          // intervalo entre scrolls enquanto procura
  const STEP_PX = window.innerHeight * 0.8; // tamanho de cada salto de scroll
  const MAX_STEPS = 200;        // limite de segurança
  const MAX_WAIT_MS = 30000;    // timeout geral

  let searching = false;

  function normalize(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  function findMatch(query) {
    const q = normalize(query);
    if (!q) return null;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
          return normalize(node.nodeValue).includes(q)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      }
    );
    const node = walker.nextNode();
    return node ? node.parentElement : null;
  }

  function highlight(el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const prev = el.style.outline;
    el.style.outline = "2px solid #1d9bf0";
    setTimeout(() => { el.style.outline = prev; }, 2500);
  }

  function showBanner(text) {
    let b = document.getElementById("__finder_c_banner");
    if (!b) {
      b = document.createElement("div");
      b.id = "__finder_c_banner";
      Object.assign(b.style, {
        position: "fixed", top: "12px", left: "50%", transform: "translateX(-50%)",
        zIndex: 2147483647, background: "#16181c", color: "#fff",
        padding: "8px 16px", borderRadius: "20px", fontSize: "13px",
        fontFamily: "system-ui, sans-serif", pointerEvents: "none",
      });
      document.documentElement.appendChild(b);
    }
    b.textContent = text;
    clearTimeout(b.__t);
    b.__t = setTimeout(() => b.remove(), 4000);
  }

  async function deepFind(query) {
    if (searching) return;
    searching = true;
    showBanner(`Finder-C: procurando "${query}"…`);

    const start = Date.now();
    let steps = 0;
    let lastScroll = -1;

    while (steps < MAX_STEPS && Date.now() - start < MAX_WAIT_MS) {
      const el = findMatch(query);
      if (el) {
        highlight(el);
        showBanner(`Finder-C: encontrado!`);
        searching = false;
        return;
      }
      const y = window.scrollY;
      if (Math.abs(y - lastScroll) < 2) break; // chegou ao fim da página
      lastScroll = y;
      window.scrollBy({ top: STEP_PX, behavior: "instant" });
      steps++;
      await new Promise((r) => setTimeout(r, STEP_MS)); // dá tempo do conteúdo virtual renderizar
    }

    // última tentativa no topo (talvez a palavra esteja acima)
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, STEP_MS));
    const el = findMatch(query);
    if (el) {
      highlight(el);
      showBanner(`Finder-C: encontrado!`);
    } else {
      showBanner(`Finder-C: "${query}" não encontrado nesta página.`);
    }
    searching = false;
  }

  window.addEventListener("keydown", (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "f") return;
    const query = window.getSelection()?.toString();
    // Se há texto selecionado, usamos busca profunda; senão deixamos o Ctrl+F nativo abrir
    if (query && query.trim()) {
      e.preventDefault();
      e.stopPropagation();
      deepFind(query.trim());
    }
  }, true);

  // API pública para futuro overlay de busca próprio
  window.__finderC = { deepFind, findMatch };
})();
