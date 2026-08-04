# Política de Segurança

## Versões suportadas

| Versão | Suportada          |
| ------ | ------------------ |
| 0.2.x  | :white_check_mark: |
| < 0.2  | :x:                |

## Relatando uma vulnerabilidade

**Não abra uma issue pública para vulnerabilidades de segurança.**

Use o recurso [Private vulnerability reporting](https://github.com/ElberBrgs/better-ctrl-f/security/advisories/new) do GitHub para relatar de forma privada. Você receberá uma resposta em até 7 dias.

## Escopo

O Better Ctrl+F é uma extensão de navegador que roda inteiramente no cliente. Pontos relevantes de segurança:

- A extensão **não coleta, armazena ou transmite nenhum dado** do usuário.
- Todo o processamento de busca acontece localmente, na aba ativa.
- O overlay é renderizado em Shadow DOM fechado, isolado do DOM da página.
- As permissões solicitadas (`activeTab`, `scripting`, `<all_urls>`) existem apenas para permitir o content script em qualquer página.
