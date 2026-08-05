# Plano de Testes — Better Ctrl+F

## Estratégia em camadas

| Camada | Ferramenta | Onde | O que cobre |
| --- | --- | --- | --- |
| Estática | `node --check`, `scripts/validate-manifest.mjs` | CI | Sintaxe, manifest, existência de assets |
| Unidade | `node --test` (node:test) | `test/` | Lógica pura de `src/search-core.js` |
| BDD | `cucumber-js` | `features/` | Comportamento em linguagem de negócio (pt-BR) |
| Exploratória/aceite | manual, no X real | checklist abaixo | Integração content script × página real |

Toda camada roda no CI a cada push e PR, e no workflow de release antes de empacotar.

## Casos de aceite manual (executar antes de cada release)

Ambiente: Microsoft Edge, `x.com/home` com login ativo, extensão carregada.

| # | Caso | Passos | Resultado esperado |
| --- | --- | --- | --- |
| A1 | Busca imediata | `Ctrl+F`, digitar palavra visível no feed | Salto direto; ocorrência azul, demais amarelas; contador `n/m` |
| A2 | Busca profunda | `Ctrl+F`, digitar termo presente muito abaixo no feed | Página rola sozinha (status "procurando…") e para no termo |
| A3 | Não encontrado | `Ctrl+F`, digitar `xyzqw123` | Scroll para em ≤ 15 s (ou antes, por estagnação); status "não encontrado"; **não** rola indefinidamente |
| A4 | Cancelamento por Esc | Iniciar busca profunda e pressionar `Esc` durante o scroll | Scroll para imediatamente; overlay fecha; destaques somem |
| A5 | Nova busca cancela anterior | Iniciar busca profunda e alterar o termo durante o scroll | Scroll para; nova busca começa do ponto atual |
| A6 | Isolamento de teclado | Com overlay aberto, digitar letras que são atalhos do X (`n`, `r`, `l`) | Nenhum composer/diálogo do X abre; texto entra no campo de busca |
| A7 | Acentos e caixa | Buscar `voce` tendo "você" no feed | Encontra "você" |
| A8 | Wrap-around | Com várias ocorrências, `Shift+Enter` na primeira | Vai para a última; contador `m/m` |
| A9 | Texto selecionado | Selecionar texto no feed e `Ctrl+F` | Overlay abre pré-preenchido e já busca |

## Registro de defeitos

| ID | Descrição | Causa raiz | Correção | Regressão coberta por |
| --- | --- | --- | --- | --- |
| BUG-01 | Destaques antigos persistiam em busca sem resultado | highlights não eram limpos ao iniciar nova busca | `clearHighlights()` no início da busca profunda (v0.2.1) | A3 |
| BUG-02 | Composer do X abria ao digitar no overlay | handlers globais da página viam as teclas (evento `composed` atravessa o shadow root); foco do input era perdido durante re-render do feed virtualizado | `contentEditable` no host (handlers tratam como campo editável) + retenção de foco a cada passo da busca profunda (v0.3.0) | A6 |
| BUG-03 | Scroll infinito quando o termo não existe | feed infinito sempre cresce → loop nunca detectava fim; loop não verificava cancelamento | limites 60 passos/15 s, detecção de estagnação por altura do documento, token de cancelamento (v0.3.0) | A3, A4, A5 + features `busca-profunda.feature` |

## Procedimento de regressão

1. `npm test` (estática + unidade) — deve passar 100%.
2. `npm run test:bdd` — todos os cenários devem passar.
3. `npm run coverage` — linhas/funções de `search-core.js` devem permanecer em 100%.
4. Executar os casos A1–A9 no X.
5. Só então: bump de versão, tag, push (o pipeline revalida 1–3 antes de empacotar).
