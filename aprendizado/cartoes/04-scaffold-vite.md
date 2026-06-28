# 📚 CARTÃO 04 — Scaffold (Vite e NPM)

**O que é (1 frase):**
Scaffold é o ato de montar o "esqueleto" e a estrutura inicial de um projeto. O Vite cria as pastas e a base, e o `npm install` baixa os "músculos" (bibliotecas) da internet.

**Por que existe (problema que resolve):**
Criar um projeto React do zero manualmente exige criar dezenas de arquivos complexos de configuração. O Scaffold automatiza isso em 2 segundos.

**Mental model (analogia):**
O `create-vite` é o engenheiro que sobe o esqueleto do prédio (vigas, andares vazios) e entrega a planta (`package.json`). O `npm install` é o caminhão de entrega que lê a planta e traz todo o cimento, encanamento e móveis necessários (`node_modules`) pra rechear o prédio.

**Exemplo mínimo:**
```bash
npx create-vite@latest meu-projeto --template react-ts
cd meu-projeto
npm install
```

**Onde encaixa no nosso projeto:**
Foi a fundação que usamos para criar a base do "Livro de Ankh".

**Erros comuns:**
- Esquecer de rodar `npm install` e tentar ligar o projeto (é como tentar morar num prédio só no esqueleto).
- Apagar a pasta `node_modules` com medo do tamanho (se apagar, é só rodar `npm install` de novo).
