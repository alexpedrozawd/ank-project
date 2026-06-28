# 📚 CARTÃO 06 — FSM (Máquina de Estados Finitos)

**O que é (1 frase):**
É um padrão onde o seu programa só pode estar em **UM** estado específico por vez, e as mudanças entre estados seguem regras rígidas.

**Por que existe (problema que resolve):**
Evita "bugs impossíveis", como um livro tentar virar a página enquanto ainda está fechado, ou um personagem atacar enquanto está morto. Se você não usar estados rígidos, seu código vira um ninho de "ifs" que quebra fácil.

**Mental model (analogia):**
No Tibia, um personagem não pode estar `MORTO` e `CAÇANDO` ao mesmo tempo. Ele tem estados definidos: `VIVO` -> toma muito dano -> `MORTO`. Estando `MORTO`, ele não pode usar feitiços. A Máquina de Estados é o juiz do jogo que garante que as regras da física e da lógica sejam respeitadas.

**Onde encaixa no nosso projeto:**
Vamos usar para controlar as fases do nosso Livro de Ankh: ele começa fechado, abre, carrega as páginas e permite leitura.
