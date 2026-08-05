# language: pt
Funcionalidade: Busca profunda nunca prende a página em scroll infinito
  Em feeds com scroll infinito (como o X), quando o termo não existe,
  a busca profunda deve parar de rolar a página e informar "não encontrado"
  — por limite de passos, de tempo, estagnação ou cancelamento do usuário.

  Cenário: Para ao atingir o limite de passos de scroll
    Dado uma busca profunda com limite de 60 passos e 15000 ms
    Quando 60 passos de scroll são executados sem encontrar o termo
    Então a busca profunda para com o motivo "limite_passos"

  Cenário: Para ao esgotar o tempo máximo
    Dado uma busca profunda com limite de 60 passos e 15000 ms
    Quando o tempo decorrido atinge 15001 ms
    Então a busca profunda para com o motivo "tempo_esgotado"

  Cenário: Para quando o usuário cancela (Esc, fechar ou nova busca)
    Dado uma busca profunda com limite de 60 passos e 15000 ms
    Quando o usuário cancela a busca no passo 5
    Então a busca profunda para com o motivo "cancelado"

  Cenário: Para quando a altura da página estagna em feed infinito
    Dado uma busca profunda tolerando 3 passos sem crescimento
    Quando a altura da página evolui para 5000, 8000, 8000, 8000, 8000
    Então a estagnação é detectada

  Cenário: Não para enquanto a página continua crescendo
    Dado uma busca profunda tolerando 3 passos sem crescimento
    Quando a altura da página evolui para 5000, 8000, 11000, 14000
    Então a estagnação não é detectada
