# 📚 CARTÃO 03 — WebP e Asset Pipeline

**O que é (1 frase):**
WebP é um formato de imagem focado na web que entrega a mesma qualidade do PNG ou JPG, mas pesando muito menos. Um "asset pipeline" é o processo automático que converte nossos arquivos originais (ex: PDF) no formato final pro site (ex: WebP).

**Por que existe (problema que resolve):**
Imagens grandes demoram pra baixar e travam a navegação no celular. Além disso, navegadores não abrem 143MB de PDF de forma instantânea ou em forma de livro 3D deitado na mesa.

**Mental model (analogia):**
O PDF de 143MB é como a tora pesada e bruta de uma árvore. O navegador seria alguém tentando carregar a tora inteira nas costas de uma vez. Nosso script no terminal (`pdftoppm` + `cwebp`) é a serraria: ele corta a tora em 20 pranchas leves de madeira (WebP), prontas para construir nosso livro, de modo que o usuário final só carrega a prancha que está olhando.

**Exemplo mínimo:**
```bash
# De PDF para PNG
pdftoppm -png arquivo.pdf saida/
# De PNG para WebP (comprimido)
cwebp -q 85 imagem.png -o imagem.webp
```

**Onde encaixa no nosso projeto:**
Vamos converter as 20 páginas do "O livro de Ankh" para 20 arquivos `.webp` levinhos, para podermos usar a nossa engine 3D e animar as viradas de página com perfeição, sem estourar o 4G do usuário.

**Erros comuns:**
- Esquecer de remover as imagens `.png` geradas no processo intermediário (ocupam espaço inútil).
- Tentar rodar conversão pesada "em tempo real" via JavaScript no site do usuário.
