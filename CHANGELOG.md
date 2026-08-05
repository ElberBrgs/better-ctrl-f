# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.4.0] - 2026-08-05

### Adicionado

- **Varredura bidirecional**: se o termo não é encontrado descendo, a busca volta ao topo e varre até a posição de origem — em páginas virtualizadas, o conteúdo que ficou para trás também sai do DOM, e antes era impossível achá-lo. Planejamento de fases em `gerarFases()` (núcleo puro, coberto por testes).
- 4 novos testes de unidade e 3 novos cenários Gherkin (`varredura-bidirecional.feature`); caso de aceite A10 no plano de QA.

## [0.3.0] - 2026-08-05

### Corrigido

- **Composer do X não abre mais ao digitar no overlay** (BUG-02): o elemento host agora se apresenta como campo editável (`contentEditable`), fazendo handlers globais da página ignorarem as teclas; e a busca profunda retém o foco do input a cada passo, pois o feed virtualizado re-renderizava e roubava o foco — a tecla seguinte caía na página.
- **Fim do scroll infinito quando o termo não existe** (BUG-03): novos limites (60 passos / 15 s), detecção de estagnação pela altura do documento (em feed infinito o scrollY sempre cresce; a altura total é o sinal honesto de fim) e **cancelamento real** — `Esc`, fechar o overlay ou iniciar nova busca interrompem o scroll imediatamente.

### Adicionado

- Núcleo de decisão puro e testável (`src/search-core.js`): normalização, limites da busca profunda, detecção de estagnação e navegação circular.
- 15 testes de unidade (`node:test`) — cobertura de 100% de linhas/funções do núcleo.
- 10 cenários Gherkin executáveis em pt-BR (`cucumber-js`) cobrindo busca, busca profunda e navegação.
- Documentos de QA: `docs/qa/plano-de-testes.md` (estratégia, casos de aceite A1–A9, registro de defeitos, procedimento de regressão) e `docs/qa/metricas.md`.
- CI e pipeline de release agora rodam também os testes BDD.

## [Não lançado]

### Adicionado

- Script `install.ps1`: instalação em um comando (`irm ... | iex`) — baixa a release mais recente, extrai em pasta fixa e abre o `edge://extensions`.
- GIF animado de instalação no README (`docs/instalacao.gif`).

## [0.2.1] - 2026-08-04

### Corrigido

- Teclas digitadas no overlay não vazam mais para a página — o X não abre mais o composer de publicar durante a busca (eventos `keydown`/`keyup`/`keypress`/`beforeinput` bloqueados na borda do Shadow DOM).
- Destaques da busca anterior não ficam mais pintados na página quando uma nova busca não encontra resultados.

## [0.2.0] - 2026-08-04

### Adicionado

- Overlay de busca próprio (Shadow DOM), acionado por `Ctrl+F`, com preenchimento a partir do texto selecionado.
- Navegação entre ocorrências com `Enter` / `Shift+Enter` e contador `n/m`.
- Destaque de todas as ocorrências via CSS Custom Highlight API.
- Ícone da extensão nos tamanhos 16/48/128 px.

### Alterado

- Empacotamento da extensão em zip para distribuição via GitHub Releases.

## [0.1.0] - 2026-08-04

### Adicionado

- MVP: interceptação de `Ctrl+F` com busca profunda — auto-scroll em etapas para carregar conteúdo virtualizado (ex.: X/Twitter) até encontrar o termo.
- Normalização de texto que ignora acentos e maiúsculas/minúsculas.

[0.4.0]: https://github.com/ElberBrgs/better-ctrl-f/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/ElberBrgs/better-ctrl-f/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/ElberBrgs/better-ctrl-f/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/ElberBrgs/better-ctrl-f/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/ElberBrgs/better-ctrl-f/compare/9f359f5...v0.2.0
