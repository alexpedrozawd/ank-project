# 📚 CARTÃO 07 — Props no React (Gravidade e Cordas)

**O que é (1 frase):**
Props (propriedades) são a forma do Componente Pai passar dados ou funções (comandos) para os seus Componentes Filhos.

**Por que existe (problema que resolve):**
Garante que o fluxo de dados seja previsível (sempre de cima para baixo). O filho não precisa conhecer quem é o pai (não precisa importar o pai), ele só precisa saber usar a "ferramenta" que o pai entregou pra ele.

**Mental model (analogia):**
A gravidade (os dados) no React só desce. O Pai joga os dados (Props) para o Filho, e o Filho recebe isso pronto. 
Se o Filho precisar avisar o Pai, o Pai precisa descer uma **corda** (uma função) como Prop. O Filho então "puxa a corda" (roda a função) e o sino toca lá em cima no Pai.

**Exemplo mínimo:**
```tsx
// Pai passando a corda (Prop)
<Botao puxaCorda={soarAlarme} texto="Clica em mim!" />

// Filho recebendo e usando a corda
function Botao({ puxaCorda, texto }) {
  return <button onClick={puxaCorda}>{texto}</button>
}
```

**Onde encaixa no nosso projeto:**
O `<ClosedBook>` (filho) vai ter um botão "Virar". Ele vai receber uma Prop do `App.tsx` (pai) chamada `onFlip`. Quando clicado, ele puxa a corda `onFlip` e o pai troca o estado.

**Erros comuns:**
- O filho tentar importar o pai para rodar uma função dele diretamente (gera ciclo infinito).
- O pai esquecer de passar a função.
