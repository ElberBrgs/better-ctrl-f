# Better Ctrl+F

> Busca na página sem limites de scroll — encontre qualquer texto mesmo em páginas com scroll infinito como o X (Twitter).

Extensão de navegador (Chrome/Edge, Manifest V3) **sem dependências, sem build, sem coleta de dados**. `Ctrl+F` vira uma busca profunda: se a palavra não está renderizada, a página rola sozinha até ela aparecer — e o Better Ctrl+F salta direto para a ocorrência.

```
Ctrl+F → digita "você"
  → Better Ctrl+F: procurando…   (a página rola sozinha, carregando o feed)
  → Better Ctrl+F: 1/3           (salto direto para a ocorrência em azul,
                                  demais em amarelo, contador n/m)
```

## Por que existe

O `Ctrl+F` nativo só enxerga o que já está **renderizado no DOM**. Em páginas com scroll virtualizado — X/Twitter, feeds de redes sociais, dashboards longos — o conteúdo fora da viewport literalmente não existe: a busca retorna "0 resultados" para algo que está ali, a 50 telas de distância. Você é obrigado a rolar manualmente, de olho aberto, até a palavra aparecer.

O Better Ctrl+F resolve isso forçando a renderização: rola a página em etapas enquanto procura, e para no momento em que o termo é encontrado. Funciona inclusive ignorando acentos e maiúsculas ("voce" encontra "você").

## Instalação

```text
# Chrome ou Edge — a partir da release (recomendado)
1. Baixe better-ctrl-f-<versão>.zip na página de Releases e extraia
2. Acesse chrome://extensions  (ou edge://extensions)
3. Ative o "Modo do desenvolvedor"
4. "Carregar sem compactação" / "Carregar descompactada" → selecione a pasta extraída
```

```sh
# A partir do código-fonte
git clone https://github.com/ElberBrgs/better-ctrl-f
# depois carregue a pasta better-ctrl-f como acima
```

> Como é uma extensão carregada em modo desenvolvedor, o navegador pode perguntar na inicialização se quer desativá-la — escolha **Manter**.

## Uso

| Ação | Atalho |
| --- | --- |
| Abrir a busca | `Ctrl+F` (com texto selecionado, já preenche) |
| Próxima ocorrência | `Enter` ou botão `↓` |
| Ocorrência anterior | `Shift+Enter` ou botão `↑` |
| Fechar | `Esc` ou botão `✕` |

- Se o termo já está no DOM, o salto é imediato.
- Se não está, o Better Ctrl+F entra em **busca profunda**: rola a página automaticamente (status "procurando…") até encontrar ou chegar ao fim — com tentativa final a partir do topo.
- Limites de segurança: 200 passos de scroll ou 30 segundos.

## Desenvolvimento

Sem toolchain: o projeto é JavaScript vanilla. Edite, recarregue a extensão em `chrome://extensions` e teste.

```sh
node --check src/content.js         # sintaxe
node scripts/validate-manifest.mjs  # manifest + existência de ícones/scripts
node --test                         # testes de unidade
```

As decisões arquiteturais (Shadow DOM fechado, CSS Custom Highlight API, algoritmo de busca profunda, borda de eventos) estão documentadas em [docs/arquitetura.md](docs/arquitetura.md).

CI roda em todo push e PR. Releases são geradas automaticamente ao empurrar um tag `v*.*.*` — o workflow valida, empacota o zip, extrai a seção da versão do [CHANGELOG.md](CHANGELOG.md) e publica o GitHub Release com checksums.

## Segurança

- A extensão **não coleta nem transmite nenhum dado**; toda a busca é local.
- Overlay em Shadow DOM fechado, isolado do DOM da página.
- CI valida sintaxe, manifest e testes em todo push/PR; **Dependabot** mantém as GitHub Actions atualizadas.
- Relato privado de vulnerabilidades: veja [SECURITY.md](SECURITY.md).

## Quão frágil é isso?

A busca profunda depende do comportamento de virtualização de cada site. Sites que **removem** do DOM o conteúdo já rolado (o X mantém uma janela de tweets renderizada) fazem com que o contador `n/m` reflita apenas o que está carregado naquele momento — as ocorrências são recalculadas a cada busca. Se um site renderizar conteúdo sob demanda de formas exóticas (intersection observers agressivos, conteúdo em canvas), a busca pode não encontrar texto que visualmente existe. Os limites de 200 passos / 30 s existem para nunca prender a página em um loop.

## Roadmap

- [x] Busca profunda com auto-scroll
- [x] Overlay próprio com navegação `n/m`
- [x] Destaque de ocorrências via CSS Custom Highlight API
- [ ] Fallback de destaque para navegadores sem a API de Highlight (Firefox)
- [ ] Página de configurações (velocidade de scroll, cor, sites habilitados)
- [ ] Publicação na Chrome Web Store / Microsoft Edge Add-ons

## Aviso

Projeto pessoal/educacional. Ao usar em sites de terceiros, respeite os Termos de Serviço de cada plataforma.

## Licença

[MIT](LICENSE) © ElberBrgs
