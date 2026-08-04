# Finder-C

> Busca na página sem limites de scroll — encontre qualquer texto, mesmo em páginas com scroll infinito como o X (Twitter).

## Problema

O `Ctrl + F` nativo do navegador só encontra o texto que já está **renderizado no DOM**. Em páginas com scroll virtualizado ou infinito (X/Twitter, feeds de redes sociais, longos dashboards), o conteúdo fora da área visível literalmente não existe no DOM — então a busca retorna "0/0" ou não acha nada, e você é obrigado a rolar manualmente até a palavra aparecer.

## Solução

Finder-C é uma extensão de navegador que faz **busca profunda (deep find)**:

1. Você seleciona um texto (ou digita na caixa de busca da extensão) e aciona o atalho.
2. Se a palavra não estiver visível, a extensão rola a página automaticamente, forçando o carregamento do conteúdo virtualizado.
3. Ao encontrar, ela **salta direto para a correspondência** e a destaca — não importa o quanto foi preciso scrollar.

## Roadmap

- [x] MVP: interceptação de `Ctrl+F` + busca profunda com auto-scroll
- [x] Overlay de busca próprio (caixa de texto estilo Ctrl+F nativo)
- [x] Navegação entre múltiplas ocorrências (próxima/anterior, contador `n/m`)
- [x] Ignorar acentos e maiúsculas/minúsculas
- [x] Destaque de todas as ocorrências via CSS Custom Highlight API
- [ ] Configurações (velocidade de scroll, cor do destaque, sites habilitados)
- [ ] Publicação na Chrome Web Store / Firefox Add-ons

## Instalação (modo desenvolvedor)

1. Clone este repositório.
2. No Chrome, acesse `chrome://extensions`.
3. Ative o **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** e selecione a pasta `finder-c`.

## Uso

1. Pressione `Ctrl + F` em qualquer página — o overlay do Finder-C abre (se houver texto selecionado, ele já preenche a busca).
2. Digite a palavra. Se ela não estiver renderizada, a extensão **rola a página automaticamente** até encontrá-la.
3. Navegue entre ocorrências com `Enter` / `Shift+Enter` ou os botões ↑ ↓. O contador mostra `n/m`.
4. `Esc` fecha.

## Estrutura

```
finder-c/
├── manifest.json      # Manifest V3 da extensão
├── src/
│   └── content.js     # Content script: busca profunda + auto-scroll
└── README.md
```

## Licença

MIT
