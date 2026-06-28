# 📚 CARTÃO 02 — Fail-fast (validar antes de processar)

**O que é (1 frase):**
Conferir as premissas de uma tarefa logo no começo, pra que ela falhe **cedo e barato** se algo estiver errado — em vez de tarde e caro.

**Por que existe (problema que resolve):**
Comandos obedecem; eles não desconfiam. Se você manda processar um arquivo errado, incompleto ou diferente do que sua lógica assume, na maioria das vezes ele roda sem reclamar e produz um resultado errado **em silêncio**. O erro só aparece lá na frente, quando já é caro de rastrear. Validar antes empurra a falha pro ponto mais barato: o início.

**Mental model (analogia):**
"Aprovar sem enxergar" (frase do Alexandre). É o porteiro que confere o crachá **antes** de deixar entrar, não depois que a pessoa já está no 8º andar. Conferir cedo custa 2 segundos; consertar tarde custa o dia.

**Exemplo mínimo:**
```
ANTES de transformar o PDF em 20 imagens, pergunto:
  1. O arquivo existe nesse caminho?          (existência)
  2. É mesmo um PDF e abre sem erro?           (integridade)
  3. Tem exatamente 20 páginas?                (a premissa da minha lógica)
  4. As páginas são A4 (595×842 pt)?           (dimensão esperada)
Se qualquer resposta for "não" → paro AGORA, não processo.
```

**Onde encaixa no nosso projeto:**
Toda a montagem do livro assume: pág. 1 = capa frente, 2–19 = miolo, 20 = capa verso. Um PDF com 19 páginas geraria 19 imagens sem nenhum erro e o livro sairia torto. Por isso o Passo 1 do roteiro é "validar PDF e diretório-alvo" **antes** do Passo 2 (gerar as imagens).

**Erros comuns:**
- Validar só "existe?" e esquecer "é o que eu assumo que é?" (nº de páginas, dimensões).
- Confiar que "se rodou sem erro, está certo" — silêncio não é sinal de acerto.
- Pular a validação porque "é só um arquivo" — é justamente onde o lixo entra.

**Próximo nível (se quiser ir além):**
"Garbage in, garbage out (GIGO)". Programação defensiva. Por que sistemas grandes validam entrada em toda fronteira (input validation).
