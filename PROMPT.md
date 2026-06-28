**[INÍCIO DO PROMPT]**

# Papel
Atue como **web designer sênior** e **dev full stack sênior**. Seu trabalho é executar com qualidade de produção, sem expandir escopo nem improvisar requisitos. Quando uma decisão não estiver coberta por este prompt, pergunte antes de inventar.

# Objetivo
Construir um livro digital folheável chamado **"O livro de Ankh"** baseado no PDF `ank-project.pdf` (20 páginas, A4, criado no Canva por Thiago Pedroza, ~143MB), publicá-lo em `https://alexpedrozawd.github.io/ank-project/`, e integrá-lo como card no portfólio existente em `https://alexpedrozawd.github.io/`. A IA deve fazer todo o trabalho autonomamente e me avisar quando estiver pronto para teste.

# Material de origem
- **PDF**: `/home/a-p/Documentos/ank-project/ank-project.pdf` (143MB, 20 páginas, 595.5×842.25pt = A4, gerado no Canva)
- **Estrutura paginal**:
  - Página 1 = capa frontal (estado fechado, na mesa)
  - Páginas 2-3, 4-5, 6-7, 8-9, 10-11, 12-13, 14-15, 16-17, 18-19 = 9 spreads internos (esquerda + direita)
  - Página 20 = capa traseira (estado fechado, na mesa)
  - Páginas 2, 11 e 19 são em branco intencionalmente (divisores de seção)

# Stack obrigatória (não substitua)
- **Vite + React 18 + TypeScript** (consistência com o portfólio do usuário)
- **Tailwind CSS** (definido pelo usuário; NÃO usar Bootstrap aqui)
- **react-pageflip** (wrapper React do StPageFlip) — engine de folheamento 3D
- **framer-motion** — transições "livro deitado na mesa ↔ livro aberto" e flip da capa
- **GitHub Pages** via GitHub Actions (branch `gh-pages`) — deploy estático
- **Sem backend, sem banco** — tudo client-side, 20 imagens estáticas

Tecnologias proibidas neste projeto: Bootstrap, Next.js, Python no runtime, Java/Spring.

# Arquitetura — dois repositórios

```
1. alexpedrozawd/ank-project (NOVO, público)
   - Diretório local: /home/a-p/Documentos/ank-project/
   - Vite + React + TS + Tailwind
   - 20 imagens WebP em public/pages/
   - Deploy: GitHub Pages, base "/ank-project/"

2. alexpedrozawd/alexpedrozawd.github.io (EXISTENTE)
   - NÃO está clonado localmente — clonar em /home/a-p/Documentos/ se for editar
   - Editar APENAS: frontend/src/components/organisms/InventoryTab/InventoryTab.tsx
   - Substituir o objeto do slot 2 ("Projeto Alpha") pelos dados confirmados abaixo
```

# Especificação visual e UX (requisitos confirmados)

**Estado inicial — livro fechado na mesa:**
- Background: wallpaper de madeira rústica, vibe mesa medieval (gerar/buscar imagem livre de direitos; sugestão: `https://www.transparenttextures.com/` ou imagem WebP local em `public/textures/wood.webp`)
- Livro deitado horizontalmente sobre a mesa, mostrando **somente a capa visível** (página 1 ou página 20, dependendo do estado)
- Sombra projetada sob o livro (CSS `box-shadow` ou `filter: drop-shadow`)
- **Altura do livro fechado: 80% da viewport height (`80vh`)**
- Largura proporcional ao aspect ratio A4 (~0.707), com `max-width: 100vw` pra prevenir overflow em mobile

**Botão "Virar livro":**
- Visível **apenas no estado fechado** (frente OU verso)
- Discreto, posicionado na parte superior do livro
- Paleta alinhada à capa: dourado/azul-marinho (ex.: `bg-amber-600/90 text-slate-900 border-amber-800`)
- Ao clicar: anima rotação 3D 180° no eixo Y do livro inteiro (vira da capa frontal pra traseira ou vice-versa). Usar `framer-motion` com `rotateY` e `transformStyle: preserve-3d`
- IMPORTANTE: se o usuário virar pra capa traseira e depois clicar pra abrir, o livro abre **na última página interna** (spread 18-19), não na primeira

**Estado aberto — folheamento:**
- Animação de transição do "livro deitado" pra "livro aberto" usando `framer-motion` (scale + rotateX + translateY combinados pra simular abertura)
- Dois spreads visíveis simultaneamente (página esquerda + direita), exceto em mobile (modo single-page)
- **Altura do livro aberto: 90% da viewport height (`90vh`)**
- **Largura: máximo possível sem distorcer aspect ratio das imagens** — calcular `min(90vh × aspect_ratio_spread, 100vw - padding)`
- Aspect ratio do spread aberto: 2 × 0.707 = ~1.414 (largura/altura)
- Engine: `react-pageflip` com `showCover: false` (capas são tratadas fora da lib, no estado "fechado")

**Zonas de clique customizadas (CRÍTICO — não é o default da lib):**
- Clique em **qualquer ponto da página esquerda** → folheia pra trás
- Clique em **qualquer ponto da página direita** → folheia pra frente
- Implementar com dois overlays absolutos (`<div className="absolute inset-y-0 left-0 w-1/2 cursor-pointer">`) sobre as páginas, capturando o clique e chamando `pageFlipRef.current.flipPrev()` / `flipNext()`
- Em mobile (single-page): metade esquerda da tela = anterior, metade direita = próxima. Swipe touch também ativo (já vem na lib)

**Estados de borda (interceptar ANTES da lib):**
- Se está no primeiro spread (2-3) e usuário clica esquerda → animação de fechamento → retorna ao estado "fechado mostrando capa frontal"
- Se está no último spread (18-19) e usuário clica direita → animação de fechamento → estado "fechado mostrando capa traseira"
- A partir do estado "fechado mostrando capa traseira", clicar abre direto no último spread (18-19)

**Máquina de estados (implementar com `useReducer` ou Zustand):**
```
estados: "closed-front" | "opening-from-front" | "open" | "closing-to-front"
         | "flipping-cover" | "closed-back" | "opening-from-back" | "closing-to-back"
```

**Responsividade:**
- Mobile pequeno (< 640px): modo single-page automático via `usePortrait: true` do StPageFlip
- Desktop e maiores: spread duplo
- Suportar até 8K (7680×4320): livro tem `max-height: 90vh` mas `max-width` cap (ex.: `min(1600px, 95vw)`) pra não ficar gigantesco. Exportar imagens em resolução suficiente (300 DPI = ~2480×3508 por página, OK até displays 4K em zoom; para 8K real, considerar re-exportar do Canva em maior DPI se o usuário quiser)
- Usar `clamp()` e unidades viewport (`vh`, `vw`, `dvh`) em vez de breakpoints fixos quando possível

# Asset pipeline (executar UMA VEZ)

Gerar as 20 imagens via script one-shot, NÃO ao runtime:

```bash
mkdir -p /home/a-p/Documentos/ank-project/public/pages
cd /home/a-p/Documentos/ank-project

# Renderiza cada página em PNG a 300 DPI
pdftoppm -png -r 300 ank-project.pdf public/pages/page

# Converte para WebP otimizado (qualidade 85)
for f in public/pages/page-*.png; do
  cwebp -q 85 "$f" -o "${f%.png}.webp"
  rm "$f"
done
```

Resultado esperado: `public/pages/page-01.webp` até `page-20.webp`, ~300-500KB cada, total ~6-10MB.

**Otimização adicional**: gerar duas versões (alta e média) e usar `srcset` para dispositivos menores.

# Conteúdo do card no portfólio (confirmado pelo usuário)

Editar `frontend/src/components/organisms/InventoryTab/InventoryTab.tsx`, substituir o objeto do slot id=2:

```typescript
{
  id: 2,
  title: "O livro de Ankh",
  description: "Livro digital folheável com a lore do jogo Tibia, dos Conspiradores. Visual em estilo manuscrito egípcio antigo, com animação 3D de folheamento. Projeto narrativo de Thiago Pedroza.",
  status: "active",
  tags: ["React", "TypeScript", "Tailwind", "StPageFlip"],
  icon: "📜",
  imageUrl: "https://alexpedrozawd.github.io/ank-project/pages/page-01.webp",
  url: "https://alexpedrozawd.github.io/ank-project/",
}
```

# Configuração de deploy

- `vite.config.ts` precisa ter `base: '/ank-project/'`
- GitHub Action em `.github/workflows/deploy.yml` (referenciar o padrão do repo `ixalan-project` se existir; do contrário, usar `actions/configure-pages` + `actions/upload-pages-artifact` + `actions/deploy-pages`)
- Branch de deploy: `gh-pages` (ou Pages do branch `main` apontando pra `dist/`)

# Restrições de execução (NÃO violar)

1. **NÃO commitar nem dar push sem autorização explícita do usuário.** Deixar tudo pronto localmente e reportar status; aguardar GO.
2. **NÃO criar arquivos `.md` de documentação** (README, ARCHITECTURE, etc.) a menos que o usuário peça explicitamente.
3. **NÃO adicionar features além das especificadas** (ex.: zoom, busca interna, índice clicável, dark mode, som de página virando, atalhos de teclado — só implementar se o usuário pedir).
4. **NÃO escrever comentários no código** salvo quando o "porquê" for genuinamente não-óbvio.
5. **NÃO mockar nem inventar** o caminho do PDF, nomes de arquivos, ou paths de assets — verificar no filesystem antes.
6. **Sempre testar localmente** (`npm run dev`) antes de reportar "feito". Validar a abertura/fechamento do livro, o folheamento, o botão "virar livro" e a responsividade em pelo menos 3 viewports (375px, 1280px, 1920px).

# Boas práticas operacionais (token economy, contexto, performance da sessão)

- Use ferramentas dedicadas (Read, Edit) para manipular código; evite uso extensivo do Bash para manipulação de arquivos.
- Implemente toda a aplicação autonomamente.
- Teste a execução após a finalização de cada componente.

**Específico deste projeto — armadilhas conhecidas:**
- O PDF tem **143MB** — NUNCA tente ler diretamente em texto. Sempre via `pdftoppm`.
- O `react-pageflip` por default flipa nos **cantos** — você PRECISA implementar overlays customizados para clique em qualquer ponto da página.
- O StPageFlip **não suporta nativamente** o estado "livro fechado deitado na mesa" — esse estado é uma camada custom em volta da lib, gerenciada por sua máquina de estados.
- Vite + GitHub Pages: precisa `base: '/ank-project/'` no `vite.config.ts` OU as rotas e assets vão quebrar em produção.

# Roteiro de execução (ordem sugerida)

1. Validar PDF e diretório-alvo (`/home/a-p/Documentos/ank-project/`)
2. Gerar as 20 imagens WebP via `pdftoppm` + `cwebp`
3. Scaffold Vite + React + TS + Tailwind no diretório
4. Configurar Tailwind, paths, `base` no `vite.config.ts`
5. Implementar máquina de estados do livro
6. Implementar componente `<ClosedBook>` (livro deitado + botão virar)
7. Implementar componente `<OpenBook>` com `react-pageflip` + overlays de clique
8. Implementar transições `framer-motion` (abrir, fechar, virar capa)
9. Aplicar wallpaper de madeira e responsividade (clamp + viewport units)
10. Testar localmente (3 viewports mínimo: 375px, 1280px, 1920px)
11. Configurar GitHub Actions de deploy
12. Clonar `alexpedrozawd.github.io`, editar `InventoryTab.tsx`, validar build local
13. **PARAR** e avisar o usuário que o projeto está pronto para testes.
14. Após aprovação, fazer o commit/push no repositório.

# Critérios de aceite (Definition of Done)

- [ ] 20 imagens WebP em `public/pages/`, total < 15MB
- [ ] `npm run build` sem warnings críticos
- [ ] Livro deitado na mesa renderiza a 80vh de altura
- [ ] Botão "Virar livro" visível só nos estados fechados, vira de capa-frente ↔ capa-verso
- [ ] Clique na capa abre o livro com animação suave (~600-900ms)
- [ ] Spreads 2-3 até 18-19 navegáveis nos dois sentidos
- [ ] Clique na metade esquerda do spread = anterior; metade direita = próxima
- [ ] No primeiro spread, clicar esquerda fecha o livro mostrando capa frontal
- [ ] No último spread, clicar direita fecha o livro mostrando capa traseira
- [ ] Aspect ratio das páginas preservado em todos os tamanhos de tela
- [ ] Em mobile (< 640px) funciona em modo single-page
- [ ] Em 1920px e 2560px renderiza spread duplo a 90vh sem distorção
- [ ] Card "O livro de Ankh" aparece como slot 2 da aba Inventário do portfólio, com ícone 📜, capa como imageUrl, tags e descrição corretas
- [ ] Nada foi commitado/pushado sem autorização explícita do usuário

**[FIM DO PROMPT]**
