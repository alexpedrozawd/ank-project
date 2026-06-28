# 📚 CARTÃO 05 — Tailwind CSS

**O que é (1 frase):**
É uma ferramenta que permite estilizar o site (dar cor, tamanho, posição) escrevendo nomes simples direto no HTML, sem precisar ficar pulando para um arquivo CSS separado.

**Por que existe (problema que resolve):**
Arquivos CSS tradicionais ficam gigantes e difíceis de manter. Você muda uma classe lá embaixo e quebra um botão lá em cima. O Tailwind amarra o estilo diretamente ao elemento.

**Mental model (analogia):**
No CSS tradicional, você manda uma carta pro pintor: "Pinte todas as cadeiras da casa de vermelho". No Tailwind, você gruda um post-it na cadeira: "vermelho". É muito mais direto.

**Exemplo mínimo:**
```html
<!-- CSS Tradicional -->
<button class="meu-botao">Clique</button>

<!-- Tailwind -->
<button class="bg-blue-500 text-white p-2 rounded">Clique</button>
```

**Onde encaixa no nosso projeto:**
Vamos usar ele para colocar o livro no centro da tela, aplicar o fundo de madeira (`bg-[url('...')`) e desenhar o botão "Virar livro".

**Erros comuns:**
- Esquecer de dizer pro Tailwind onde procurar as classes (o arquivo `tailwind.config.js`).
- Tentar inventar classes que não existem no manual dele.
