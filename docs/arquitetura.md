# Arquitetura do Finder-C

Documento para contribuidores: as decisões por trás do código. O README é para usuários; aqui é o "por quê".

## Decisão 1 — Content script puro, sem build

A extensão é JavaScript vanilla carregado como content script Manifest V3. Sem bundler, sem framework, sem dependências. Motivo: a superfície de instalação é "carregar a pasta no navegador" — qualquer camada de build adicionaria atrito sem ganho proporcional para um projeto deste tamanho.

## Decisão 2 — Overlay em Shadow DOM fechado

O overlay de busca vive em `host.attachShadow({ mode: "closed" })`. Isso resolve dois problemas de uma vez:

1. **CSS**: sites como o X têm folhas de estilo agressivas que quebrariam o visual do overlay. O Shadow DOM isola completamente os estilos.
2. **Confiança**: `mode: "closed"` impede que a página inspecione ou adultere o conteúdo do overlay via `element.shadowRoot`.

Custo: o próprio teste externo não consegue ler o estado do overlay. Por isso `window.__finderC` expõe uma API mínima (`open`, `close`, `onQuery`) usada nos testes.

### Borda de eventos

Eventos de teclado têm `composed: true`, ou seja, atravessam o shadow root. Se nada bloqueasse, a página veria cada tecla digitada na busca — foi assim que o X abria o composer ao digitar no overlay (bug corrigido na v0.2.1). A solução: listeners em fase de **bubble** no elemento host que chamam `stopPropagation()` + `stopImmediatePropagation()` para `keydown`, `keyup`, `keypress` e `beforeinput`. Bubble (não capture) para garantir que o próprio `<input>` do overlay processe suas teclas antes do bloqueio.

## Decisão 3 — CSS Custom Highlight API em vez de spans

O destaque das ocorrências usa `CSS.highlights` (`::highlight(finder-c-all)` e `::highlight(finder-c-current)`) sobre `Range`s, em vez de envolver matches em `<span>`s. Motivos:

- Não muta o DOM da página (sites reativos como o X reconciliam o DOM constantemente e spans injetados seriam destruídos — ou pior, quebrariam a reconciliação);
- Criar e limpar milhares de highlights é uma operação de render, não de layout/DOM — muito mais barato;
- Limpar é `hlAll.clear()` — zero rastro.

Requer Chromium 105+. Fallback ainda não implementado (ver roadmap do README).

## Decisão 4 — Busca profunda com auto-scroll

O problema central: em páginas com scroll virtualizado, o texto fora da viewport **não existe no DOM**. Não há como encontrar o que não foi renderizado. O algoritmo de `deepFind`:

1. Coleta os `Range`s que casam com a query no DOM atual (`TreeWalker` sobre nós de texto, excluindo `script`/`style`/`noscript`/`iframe` e o próprio overlay);
2. Se encontrou, pinta e salta para a primeira ocorrência;
3. Se não, rola `0.8 × viewport` a cada `STEP_MS = 220 ms` (tempo suficiente para o virtualizador renderizar o novo bloco);
4. Para quando o scroll não avança mais (fim da página), quando encontra, ou nos limites de segurança (`MAX_STEPS = 200`, `MAX_WAIT_MS = 30 s`);
5. Se nada foi achado descendo, tenta uma vez do topo antes de declarar "não encontrado".

### Por que auto-scroll e não `window.find()`?

`window.find()` (e o Ctrl+F nativo) também só opera sobre o DOM renderizado — é exatamente a limitação que motivou o projeto. A única forma de buscar em conteúdo virtualizado é forçar a renderização, e a forma de forçar é rolar.

## Decisão 5 — Normalização na busca, não no highlight

A comparação normaliza com `NFD` + remoção de diacríticos + lowercase, então "voce" encontra "você". Os `Range`s, porém, apontam para os índices do texto normalizado — que coincide em comprimento com o original **apenas porque** a decomposição NFD seguida da remoção de marcas preserva o comprimento para o latino comum. Se a extensão um dia suportar scripts onde isso não vale (ex.: alguns ideogramas), o mapeamento de índices precisará ser revisitado.
