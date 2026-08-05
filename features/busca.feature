# language: pt
Funcionalidade: Normalização de texto na busca
  Para encontrar o que o usuário procura de verdade,
  a busca ignora acentos e diferenças de maiúsculas/minúsculas.

  Cenário: Termo sem acento encontra texto acentuado
    Dado o texto da página "Qualquer pessoa pode responder"
    Quando o usuário busca "re"
    Então a busca encontra uma ocorrência

  Cenário: Termo minúsculo encontra texto com maiúsculas
    Dado o texto da página "você está aqui"
    Quando o usuário busca "VOCE"
    Então a busca encontra uma ocorrência

  Cenário: Termo inexistente não encontra nada
    Dado o texto da página "Timeline do X"
    Quando o usuário busca "xyzqw123"
    Então a busca não encontra ocorrências
