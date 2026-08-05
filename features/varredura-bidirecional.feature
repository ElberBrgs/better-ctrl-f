# language: pt
Funcionalidade: Varredura bidirecional da página
  O termo buscado pode estar acima OU abaixo da posição atual de scroll.
  Em páginas virtualizadas (como o X), o conteúdo que ficou para trás também
  sai do DOM — então a busca profunda cobre as duas direções.

  Cenário: Usuário no topo da página varre apenas para baixo
    Dado que o usuário está na posição de scroll 0
    Quando as fases da varredura são planejadas
    Então há 1 fase, começando em 0 e sem limite final

  Cenário: Usuário no meio da página tem as duas direções cobertas
    Dado que o usuário está na posição de scroll 3000
    Quando as fases da varredura são planejadas
    Então há 2 fases
    E a fase 1 começa em 3000 e não tem limite final
    E a fase 2 começa em 0 e termina em 3000

  Cenário: A varredura para cima nunca passa da posição de origem
    Dado que o usuário está na posição de scroll 12345
    Quando as fases da varredura são planejadas
    Então a fase 2 termina em 12345
