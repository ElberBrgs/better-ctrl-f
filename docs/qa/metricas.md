# Métricas de Qualidade — Better Ctrl+F

Medidas em 2026-08-05 (v0.3.0). Fontes: `node --test --experimental-test-coverage`, `cucumber-js`, GitHub Actions.

## Cobertura de código (núcleo testável `src/search-core.js`)

| Métrica | Valor | Meta |
| --- | --- | --- |
| Linhas | **100%** | ≥ 95% |
| Funções | **100%** | 100% |
| Branches | **84,21%** | ≥ 80% |

`src/content.js` (DOM/Shadow/scroll) é intencionalmente fora da cobertura unitária — a lógica de decisão foi extraída para o núcleo puro justamente para ser 100% testável offline; a integração é coberta pelo checklist de aceite (A1–A9).

## Testes

| Suíte | Quantidade | Status |
| --- | --- | --- |
| Unidade (node:test) | 15 testes | ✅ 100% passando |
| BDD (cucumber-js) | 10 cenários / 30 steps | ✅ 100% passando |
| CI (push/PR) | estática + unidade + BDD | ✅ verde |
| Release pipeline | revalida tudo antes de empacotar | ✅ verde |

## Defeitos

| Métrica | Valor |
| --- | --- |
| Defeitos reportados por usuário | 3 (BUG-01, BUG-02, BUG-03) |
| Corrigidos | 3 (100%) |
| Abertos | 0 |
| Com regressão automatizada | 2 de 3 (BUG-03 via BDD; BUG-02/BUG-03 via aceite manual A3–A6) |

## Limites operacionais da busca profunda (SLOs de UX)

| Indicador | Valor máximo |
| --- | --- |
| Tempo de scroll por busca | 15 s |
| Distância de scroll por busca | 60 passos (~48 viewports) |
| Parada por estagnação | 3 passos sem crescimento da página |
| Resposta ao cancelamento | ≤ 220 ms (próxima iteração do loop) |
