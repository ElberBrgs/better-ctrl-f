# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

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

[0.2.1]: https://github.com/ElberBrgs/finder-c/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/ElberBrgs/finder-c/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/ElberBrgs/finder-c/compare/9f359f5...v0.2.0
