# Ank — O Livro de Ankh

Livro digital folheável em 3D baseado no lore dos Conspiradores (jogo Tibia), criado por Thiago Pedroza a partir do documento original de 20 páginas em formato A4 (`ank-project.pdf`).

## Stack e Arquitetura

- **Frontend**: React 19 + TypeScript + Vite 8
- **Estilos & 3D**: Tailwind CSS v4 + Framer Motion 12
- **Folheamento**: `react-pageflip` 2.0.3 (`st-page-flip`)
- **Assets Estáticos**: 20 páginas em WebP otimizado (300 DPI, q=85) em `public/pages/`
- **Áudio**: Trilha sonora ambiente em loop (`public/ankh-soundtrack.mp3`)
- **Deploy**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`), base path `/ank-project/`

## Estrutura do Código (`src/`)

```
src/
├── main.tsx                  # Ponto de montagem React 19
├── App.tsx                   # Cenário da mesa de madeira rústica e container
├── index.css                 # Import Tailwind v4 e utilitários de perspectiva 3D
└── components/
    ├── BookContainer.tsx     # FSM do livro, áudio, redimensionamento A4 e header
    ├── ClosedBook.tsx        # Livro fechado na mesa, hover tátil e giro 180°
    └── OpenBook.tsx          # Livro aberto com react-pageflip e setas de navegação
```

## Máquina de Estados (FSM)

Estados gerenciados em `BookContainer`:
- `closed`: Livro deitado na mesa (exibe capa frontal `page-01` ou verso `page-20`).
- `flipping`: Transição de rotação 180° no eixo Y para alternar a capa visível.
- `opening`: Transição de abertura 3D suave simulando elevação e abertura da capa.
- `open`: Livro aberto e interativo via `react-pageflip` (spread duplo em desktop, folha única em <640px).
- `closing`: Retorno animado ao estado fechado na mesa.

## Mapeamento de Páginas

| Página | Função | Modo de Visualização |
| --- | --- | --- |
| 01 | Capa Frontal | `ClosedBook` (mesa) |
| 02 - 19 | Miolo / Conteúdo Interno | `OpenBook` (spreads duplos; págs 02, 11 e 19 são divisores em branco) |
| 20 | Capa Traseira | `ClosedBook` (mesa, após virar) |

## Comandos Operacionais

```bash
npm run dev      # Servidor local de desenvolvimento
npm run build    # Checagem de tipo (tsc -b) e build de produção (Vite)
npm run preview  # Pré-visualização do build de produção
```

Deploy automático na branch `main` dispara o workflow do GitHub Actions publicando em `https://alexpedrozawd.github.io/ank-project/`.
