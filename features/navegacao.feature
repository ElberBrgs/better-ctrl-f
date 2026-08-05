# language: pt
Funcionalidade: Navegação entre ocorrências
  O usuário navega entre as ocorrências encontradas
  com wrap-around nos extremos.

  Cenário: Próximo após a última volta para a primeira
    Dado 5 ocorrências encontradas
    Quando o usuário navega para o índice 5
    Então a ocorrência atual é a de índice 0

  Cenário: Anterior à primeira vai para a última
    Dado 5 ocorrências encontradas
    Quando o usuário navega para o índice -1
    Então a ocorrência atual é a de índice 4
