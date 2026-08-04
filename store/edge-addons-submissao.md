# Submissão — Microsoft Edge Add-ons

Material pronto para colar no [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge) ao cadastrar o Better Ctrl+F.

## Checklist de arquivos

| Item da loja | Arquivo |
| --- | --- |
| Pacote da extensão (.zip) | `dist/better-ctrl-f-0.2.1.zip` |
| Logo da loja (300×300) | `store/logo-300x300.png` |
| Screenshot 1 — busca com salto direto | `store/screenshot-1-busca.png` |
| Screenshot 2 — múltiplas ocorrências (n/m) | `store/screenshot-2-multiplas.png` |
| Política de privacidade (URL) | https://github.com/ElberBrgs/better-ctrl-f/blob/main/PRIVACY.md |

> Screenshots atuais: 1070×769. Se a loja exigir exatamente 1280×800 ou 640×400, redimensione com qualquer editor (ou peça uma recaptura).

## Campos do cadastro

**Nome da extensão**

```text
Better Ctrl+F
```

**Categoria sugerida**

```text
Produtividade (Productivity)
```

**Descrição curta (pt-BR)**

```text
Ctrl+F sem limites: encontre qualquer texto na página, mesmo em feeds com scroll infinito como o X (Twitter). A página rola sozinha até a palavra aparecer.
```

**Descrição completa (pt-BR)**

```text
O Ctrl+F nativo do navegador só encontra o texto que já está renderizado na tela. Em páginas com scroll infinito — X/Twitter, feeds de redes sociais, dashboards longos — o conteúdo fora da área visível literalmente não existe para a busca, e você precisa rolar manualmente até a palavra aparecer.

O Better Ctrl+F resolve isso:

• BUSCA PROFUNDA — se a palavra não está visível, a página rola automaticamente, carregando o conteúdo, até ela ser encontrada. Quando encontra, o Better Ctrl+F salta direto para a ocorrência.
• CAIXA DE BUSCA PRÓPRIA — pressione Ctrl+F e digite; se houver texto selecionado na página, ele já preenche a busca.
• NAVEGAÇÃO ENTRE OCORRÊNCIAS — Enter / Shift+Enter ou botões, com contador n/m.
• DESTAQUE VISUAL — todas as ocorrências em amarelo, a atual em azul.
• IGNORA ACENTOS E MAIÚSCULAS — "voce" encontra "você".

Privacidade em primeiro lugar: a extensão não coleta, não armazena e não transmite nenhum dado. Toda a busca acontece localmente, no seu navegador. Código aberto (MIT): https://github.com/ElberBrgs/better-ctrl-f
```

**Descrição curta (en-US)** — opcional, para alcance internacional

```text
Ctrl+F without limits: find any text on the page, even on infinite-scroll feeds like X (Twitter). The page scrolls itself until the word appears.
```

**Justificativa das permissões** (formulário de submissão)

```text
activeTab / scripting: necessárias para injetar o script de busca na aba em uso quando o usuário aciona Ctrl+F.

host_permissions (<all_urls>): a funcionalidade principal da extensão é melhorar a busca em QUALQUER página que o usuário visitar — não existe uma lista fixa de sites. O acesso é usado exclusivamente para ler o conteúdo de texto da página e localizar o termo buscado, localmente. Nenhum dado é coletado ou transmitido.
```

**URL de suporte**

```text
https://github.com/ElberBrgs/better-ctrl-f/issues
```

## Passo a passo da submissão

1. Crie uma conta gratuita de desenvolvedor no [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge) (se ainda não tiver).
2. **Criar nova extensão** → envie `dist/better-ctrl-f-0.2.1.zip`.
3. Preencha **Disponibilidade** (mercados: todos; visibilidade: pública).
4. Em **Propriedades**: categoria Produtividade, URL da política de privacidade (link acima), URL de suporte.
5. Em **Listagem da loja** (idioma português): cole nome, descrições, envie logo e screenshots.
6. Adicione a listagem em inglês se quiser alcance global.
7. **Publicar** → a revisão da Microsoft leva normalmente até 7 dias úteis.
