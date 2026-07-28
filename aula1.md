# Introdução ao Javascript

## JavaScript: aplicação
 
JavaScript (não confundir com Java, que é uma linguagem completamente diferente), também chamada de ECMAScript, é a linguagem de páginas da Web dinâmicas. Seu uso possibilita a criação de páginas com:

- Reação instantânea aos comandos do usuário (sem precisar aguardar resposta do servidor);
- Atualizações automáticas de conteúdo;
- Atualizações parciais de conteúdo (sem precisar recarregar a página inteira);
- Validação instantânea de formulários (por exemplo, informando que o nome de usuário solicitado já existe);
- Armazenamento local de informações (que podem opcionalmente ser transmitidas a um servidor);
- Processamento local de informação (ex. uma calculadora que apresenta resultados imediatamente);
- Possibilitar uso de alguns recursos de CSS modernos em navegadores antigos sem suporte oficial (através de polyfills);
- Dentre outros. 
 
É possível desenvolver uma aplicação funcional, completamente local (sem necessidade de servidor), usando JavaScript.
 
Antigamente, JavaScript era utilizado também para validações mais simples de dados (como restringir valores máximos e mínimos para um campo de formulário), criação de menus tipo dropdown, e para controlar a apresentação da página (adaptando-se ao dispositivo), mas funcionalidades modernas de HTML5 e CSS3 substituíram esses usos.

## Noções básicas de JavaScript:
 
Definida a utilidade da linguagem, vamos agora conhecer alguns aspectos básicos para o uso dela.
 
JavaScript depende de um ambiente para a sua execução. Em nosso caso, este ambiente será o cliente navegador. Existem outras formas de executar JavaScript (como o Node.js, que é um ambiente para execução de JavaScript em um servidor remoto, ou o Electron.js, um ambiente para desenvolver aplicações locais, como o VSCode), mas não estudaremos isso no momento.
 
Para adicionar JavaScript em sua página Web, adicione uma tag `<script>` em seu código. Tal qual CSS, que pode ser escrito diretamente no arquivo HTML com a tag `<style>` ou lido de um arquivo externo indicado por uma tag `<link>`, JavaScript também pode ser adicionado tanto no mesmo arquivo HTML quanto em um arquivo externo.
 
Entretanto, no caso de JavaScript, não usamos a tag `<link>`. Em vez disso, tanto scripts externos quanto internos precisam ser adicionados através de tags `<script>`. 
 
Para adicionar um script externo chamado `scripts.js`, salvo na mesma pasta que seu HTML, adicionamos, dentro do `<head>` do HTML: 
 
```html
<script src="scripts.js" defer></script> <!-- anexa scripts.js a este arquivo HTML -->
```

Não é permitido abrir e fechar uma tag `<script>` ao mesmo tempo, no formato `<script />`. Mesmo quando estamos indicando um link externo para o JavaScript, é necessário abrir e fechar a tag separadamente:
 
O atributo `defer` indica que a execução do script deve ser deferida até que o carregamento do arquivo HTML esteja completo e o navegador tenha terminado de renderizar a página. Isto é importante quando criamos scripts que acessam elementos do `<body>`, visto que, do contrário, o script poderia iniciar sua execução antes que os elementos do `<body>` efetivamente existam (pois ainda não foram baixados ou renderizados), ocasionando erros.
 
Alternativamente, caso seu script não interaja diretamente com elementos do `<body>`, o atributo `async` faz com que seu script possa ser carregado e iniciado em paralelo com o carregamento do HTML: 
   
```html
<script src="scripts.js" async></script>
```
 
Para adicionar um script diretamente ao HTML, crie uma tag `<script>`, onde desejar, no HTML:

```html
<script> /* Seu código JavaScript aqui */ </script> 
```

Adicionar scripts diretamente no HTML geralmente não é recomendado (tal qual adicionar CSS diretamente ao HTML), pois quebra a separação entre apresentação e conteúdo. Entretanto, quando scripts "locais" (no mesmo arquivo HTML) forem necessários, recomenda-se colocar a tag `<script>` logo antes de `</body>`, garantindo que a página está completamente carregada antes da leitura do script.
 
As descrições a seguir não são necessariamente completas, apenas contemplam o necessário para o entendimento básico da linguagem neste momento. 

## Modelo de execução:
 
JavaScript é uma linguagem baseada em eventos. Funções contidas em scripts podem ser executadas em resposta a:
- ações do usuário, como clicar ou passar o mouse sobre algo, pressionar uma tecla;
- recebimento de informação solicitada ao servidor;
- um tempo limite definido pelo programador sendo atingido;
- dentre diversos outros.

## Comentários: 

Comentários em JavaScript podem ser escritos de duas formas:

```javascript
/* comentário de segmento. Pode ser concluído antes do fim da linha ou ocupar várias linhas */
	
let x = 2; //comentário de uma linha. comenta todo o restante da linha. 
let y = 3; //O comentário de linha não se estende para as linhas seguintes.
//Atente para direção da barra, não confundir com barra invertida: \\
console.log(x /* comentário de segmento dentro da linha */ + y);
```

O estilo de comentário em JavaScript (assim como diversas outras estruturas da linguagem, como veremos no futuro) é idêntico ao utilizado na linguagem C.

## Ponto-e-vírgula:

JavaScript utiliza ponto-e-vírgula (`;`) para separar comandos. É possível suprimir o ponto-e-vírgula, em alguns casos, quando os comandos estão em linhas separadas. 

```javascript
let a = 3
let b = 4
//O código acima produz o mesmo efeito que:
let a = 3; let b = 4;
```

Entretanto, como a adição automática do ponto-e-vírgula por parte do interpretador de JavaScript só ocorre quando a interpretação não for possível sem ponto-e-vírgula, o comportamento de código sem ponto-e-vírgula não é completamente óbvio em alguns casos, possibilitando a criação de bugs difíceis de detectar:

```javascript
let y = x + f
(a+b).toString() 
/* O código acima produz o mesmo efeito que o abaixo. Note que não ocorre inserção automática de ponto-e-vírgula neste caso, pois o código é válido sem o ponto-e-vírgula: */
let y = x + f(a+b).toString(); 
```

Portanto, o uso de ponto-e-vírgula após cada comando é fortemente recomendado, e (exceto quando explicitamente especificado) será cobrado em aulas.

## Regras para identificadores:

Identificadores são nomes de elementos, como variáveis e funções. Os nomes são sensíveis à diferença entre maiúsculas e minúsculas e podem conter uma ou mais letras, números e/ou os caracteres `$` e `_` mas não podem começar com um número.

```javascript
//Abaixo, declaro 5 variáveis diferentes e as inicializo com valores diferentes.
let abc=8; let ab1=1; let _ab1=5; let Ab1=3; let AB1=7; 
```

Há nomes reservados em JavaScript, que não podem ser utilizados para criar identificadores, pois possuem alguma função específica predefinida pela linguagem:
 
```text
break       case        catch       class       const
continue    debugger    default     delete      do
else        export      extends     finally     for
function    if          import      in          instanceof
new         return      super       switch      this
throw       try         typeof      var         void
while       with        yield
```
 
## Variáveis e tipos de dados:

JavaScript suporta, dentre outros, os tipos de dados: numérico de ponto flutuante (número com vírgula), strings (sequências de caracteres) e booleanos (bit, verdadeiro/falso).

Em JavaScript, variáveis (identificadores que armazenam informação) não possuem tipo predefinido, portanto podem armazenar qualquer um dos tipos de dados e o tipo pode ser alterado mesmo depois da criação da variável. 

Uma das formas de criar uma variável consiste no uso da palavra-chave `let` vista nos exemplos anteriores:

```javascript
let qtd = 3;               //cria variável qtd e atribui a ela um número inteiro.
qtd = 74548648;            //atualiza qtd, armazenando um novo número inteiro.
let nome = "Luis Alfredo"; //cria variável nome e atribui uma string;
let qualquer = 6.354e48;   /* cria variável chamada qualquer e atribui a ela um número em
                              notação científica (6,354x10^48) */
qualquer = "agora sou uma string"; //atualiza o valor de qualquer, mudando seu tipo.
```

Veremos outras formas de criar variáveis, e outros tipos de dados no futuro.

## Primeiro programa:

Agora que conhecemos as bases necessárias, veremos como apresentar uma mensagem ao usuário de três formas diferentes em JavaScript. Crie um arquivo `index.html` e um arquivo `scripts.js`. 

Em `index.html`, escreva: 

```html
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="scripts.js" defer></script> <!-- anexa scripts.js a este arquivo HTML -->
</head>

<body>
    <div id="placeholder">
        <!-- Conteúdo será inserido pelo JavaScript! -->
    </div>
</body>
</html>
```

Em `scripts.js`, escreva:	

```javascript
let autor = "Luis Alfredo";         //seu nome aqui.
let mensagem1 = "Olá! Sou " + autor; //sua mensagem aqui.
let mensagem2 = "JS pode manipular seu HTML!"; //sua mensagem aqui.
let mensagem3 = "Estou no log do console!"; //sua mensagem aqui.

/* A linha abaixo escreve sua mensagem no console do inspetor 
de elementos do navegador */
console.log(mensagem1);

/* A linha abaixo escreve sua mensagem como um alerta pop-up no navegador. 
Este não é um método recomendado de interação com o usuário em páginas modernas. */
window.alert(mensagem2); 

/* A linha abaixo escreve sua mensagem no div="placeholder" do HTML
no navegador. */
document.getElementById("placeholder").innerHTML = mensagem3; 

/* Bônus: altera a cor de fundo da página. Aprenderemos mais sobre 
manipulação de CSS via JavaScript no futuro */
document.body.style.background = "linear-gradient(90deg, #eff 0% , #898 100% )"; 
```

Ao concluir, explore e altere este exemplo para começar a entender o comportamento da linguagem em seu navegador. Note que, embora acessar o console em um telefone celular possa não ser viável, as outras duas mensagens devem funcionar corretamente, possibilitando o teste deste exemplo mesmo sem computador.

---

# JavaScript: Variáveis, Tipos de Dados e Operadores

## Relembrando: Regras para identificadores:

Identificadores são nomes de elementos, como variáveis e funções. Os nomes são sensíveis à diferença entre maiúsculas e minúsculas e podem conter uma ou mais letras, números e/ou os caracteres `$` e `_` mas não podem começar com um número.

```javascript
//Abaixo, declaro 5 variáveis diferentes e as inicializo com valores diferentes.
let abc=8; let ab1=1; let _ab1=5; let Ab1=3; let AB1=7; 
```

Há nomes reservados em JavaScript, que não podem ser utilizados para criar identificadores, pois possuem alguma função específica predefinida pela linguagem:
 
```text
break       case        catch       class       const
continue    debugger    default     delete      do
else        export      extends     finally     for
function    if          import      in          instanceof
new         return      super       switch      this
throw       try         typeof      var         void
while       with        yield
```
 
## Tipos de dados:

JavaScript suporta diversos tipos de dados primitivos: 

### Numérico: 

Internamente, JavaScript opera apenas com números de ponto flutuante (números com vírgula e expoente, dentro do conjunto dos números reais) de 64 bits. O maior número que pode ser representado (tanto positivo quanto negativo), com arredondamentos, é aproximadamente `1,798 x 10^308`.

Entretanto, não é possível representar de forma exata o número acima. O maior número que pode ser representado de forma exata (tal que seja possível subtrair 1 e encontrar a resposta correta), é `9.007.199.254.740.992`. Para números inteiros que ultrapassam esse limite, o JavaScript moderno (ES2020+) introduziu o tipo BigInt, que pode ser criado adicionando um n ao final do número (ex: 9007199254740992n)."

Como números inteiros são tratados da mesma forma que os números de ponto flutuante, não há forma especial de indicar que um número é inteiro em JavaScript.

Além dos limites indicados acima, JavaScript suporta os valores especiais:
- `+Infinity` (infinito positivo, ocorre quando o resultado for maior que o valor máximo positivo suportado), 
- `-Infinity` (infinito negativo, ocorre quando o resultado for maior que o valor máximo negativo suportado), e
- `NaN` (Not a Number, ocorre quando for impossível representar o valor como número real, como ao calcular a raiz quadrada de um número negativo).

### Strings: 

Strings em JavaScript são sequências de um ou mais caracteres UTF-16, o que possibilita que as mesmas contenham caracteres em qualquer idioma.

Strings são escritas dentro de `'aspas simples'` ou de `"aspas duplas"`. Para escrever aspas simples dentro de uma string iniciada com aspas simples (ou aspas duplas dentro de uma string iniciada por aspas duplas), é necessária uma barra invertida antes da aspa de dentro do texto: 

```javascript
'it\'s a string'; //necessária \ pois, do contrário, a string terminaria antes do 's

//Alternativamente, use o outro tipo de aspas:
"it's a string"; //a barra invertida não precisa ser utilizada neste caso, somente se a aspa usada na abertura da string for a mesma contida no texto.
```

O uso da barra invertida indica uma sequência de escape. Sequências de escape são usadas para representar caracteres que não possam ser escritos diretamente. A tabela ao lado apresenta algumas sequências de escape. Note que para escrever `\` são necessárias duas barras invertidas, pois a `\` indica o início de uma sequência de escape.

A tabela anterior apresenta também uma representação `\uXXXX`. Esta é uma sequência de escape especial que permite representar qualquer caractere UTF-16 (todo caractere suportado possui um valor numérico entre 0000 e 9999).

### Booleanos:

Booleanos são valores lógicos de um bit, capazes de representar uma entre duas possibilidades apenas: `true` (verdadeiro) ou `false` (falso). Booleanos ocorrem, por exemplo, como resultado de comparações:

```javascript
if (a == 4)     //Se a for igual a 4
    b = b + 2;  //adicione 2 a b;
else            //senão
    c = c + 3;  //adicione 3 a c.
```

### Template Literals (Template Strings):

A partir do ES6 (2015), o JavaScript introduziu uma forma moderna e muito mais prática de trabalhar com strings: os *Template Literals*. Em vez de aspas simples (`'`) ou duplas (`"`), eles utilizam **acento grave** (`` ` ``).

Eles resolvem dois grandes inconvenientes das strings tradicionais: a concatenação verbosa e a dificuldade de criar strings com múltiplas linhas.

**1. Interpolação de Variáveis (String Interpolation):**
No lugar de usar o operador `+` para "juntar" strings e variáveis, você pode embutir expressões JavaScript diretamente dentro da string usando a sintaxe `${ ... }`.

```javascript
let nome = "Luis";
let idade = 26;

// Forma tradicional (concatenação):
let mensagemAntiga = "Olá, meu nome é " + nome + " e tenho " + idade + " anos.";

// Forma moderna (Template Literal):
let mensagemNova = `Olá, meu nome é ${nome} e tenho ${idade} anos.`;

// Você também pode avaliar expressões matemáticas dentro das chaves:
let proximoAno = `No ano que vem terei ${idade + 1} anos.`;
```

**2. Strings de Múltiplas Linhas:**
Com aspas tradicionais, criar uma string com várias linhas exigia o uso de quebras de linha manuais (`\n`) e muita concatenação. Com crases, basta pressionar "Enter" no seu código: a formatação e os espaços são respeitados automaticamente.

```javascript
// Forma tradicional:
let textoAntigo = "Linha 1\n" +
                  "Linha 2\n" +
                  "Linha 3";

// Forma moderna:
let textoNovo = `Linha 1
Linha 2
Linha 3`;
```

**Dica de Ouro para o `console.log`:**
Ao imprimir mensagens no console para testar seu código, em vez de concatenar tudo com `+`, a prática mais limpa (e que evita bugs de conversão de tipo) é passar os valores separados por vírgula. O próprio `console.log` formata e espaça os valores automaticamente:

```javascript
// Em vez de: console.log("Nome: " + nome + " | Idade: " + idade);
console.log("Nome:", nome, "| Idade:", idade);
```

### Outros valores:

- `undefined`: Quando uma variável ainda não possui nenhuma informação armazenada, seu valor é `undefined`.
- `null`: Quando uma variável teve seu valor intencionalmente removido, seu valor é nulo: `null`.

## Conversão entre tipos:

JavaScript executa conversão automática de tipos quando necessário. Os valores a seguir são avaliados como falsos. Qualquer outro valor será avaliado como verdadeiro:

```javascript
undefined   //sem valor definido
null        //nulo
0           //zero
-0          //zero negativo
NaN         //Não é número
""          //string vazia
```

## Declarando e inicializando variáveis:

Para criar uma variável que armazena uma informação dos tipos indicados acima (e outros) em JavaScript, podem se utilizar os comandos `let`, `const` ou `var`.

- `let` cria uma variável local, que só tem valor e significado dentro do escopo (conjunto de chaves `{ }`) em que foi criada. 
- `const` cria uma constante local, que só tem valor e significado dentro do escopo (conjunto de chaves `{ }`) e é um valor armazenado que não pode ser alterado posteriormente.  
- `var` cria uma variável global, válida em todo o seu programa, ou, quando criada dentro de uma função, toda a sua função. O comando `var` é a forma antiga de criar variáveis na linguagem e seu uso não é mais recomendado, pois o comportamento de `var` é confuso em algumas situações, o que pode ocasionar bugs:

```javascript
var x = "Olá";
var y = 4;

if (y > 3) {
    var x = "Até mais"; 
}

console.log(x); // "Até mais"
```

Note que, acima, criar uma nova variável com o mesmo nome de uma já existente em um escopo aparentemente diferente (dentro das chaves), em vez de gerar um erro, substitui o valor da variável previamente existente. Com `let` isto não ocorre, pois a nova variável `x` seria diferente da existente (mais local) e deixaria de existir após o fechamento da chave.

Portanto, `let` permite reutilizar nomes de variáveis em escopos diferentes, e impede a tentativa de reutilizar nomes de variáveis no mesmo escopo (visto que isto pode ocasionar problemas como visto usando `var`).

Também é possível, embora não recomendado, criar e utilizar variáveis não declaradas, ao simplesmente estabelecer um valor para um identificador que não foi declarado anteriormente.

## Operadores:

O código abaixo exemplifica o uso de operadores aritméticos, lógicos, de comparação, dentre outros:

```javascript
/* O igual ( = ) é o operador de atribuição: */
let x = 4;  //atribui o valor 4 à variável x. 
let y = 7;  //atribui o valor 7 à variável y.
let z;      //cria z mas não atribui valor.

/* Operadores aritméticos: executam operações aritméticas
+ soma                           - subtração
* multiplicação                  / divisão           % resto da divisão inteira
*/
let var1 = x + 3 - 15 / 4;     //calcula a expressão e atribui o resultado 3,25 a var1.
let abc = ( x + 3 - 15 ) / 4;  //calcula a expressão e atribui o resultado -2.0 a abc.
z = y % x;                     //calcula a expressão e atribui o resultado 3 a z.

/* Operadores lógicos: executam operações lógicas (álgebra booleana):
&&  (dois ampersands)       operação E / AND 
||  (duas barras retas)     operação OU / OR
!   (ponto de exclamação)   operação de negação / NOT
Não confundir com os operadores | e & (um ampersand e uma barra reta), estudados posteriormente.
*/
let var_b1 = 1;
let var_b2 = 0;
let ba = var_b1 && var_b2;         //calcula var_b1 E var_b2 e atribui o resultado 0 a ba.
let bo = var_b1 || var_b2;         //calcula var_b1 OU var_b2 e atribui o resultado 1 a bo.
let bn = !var_b2;                  //calcula NÃO var_b2 e atribui o resultado 1 a bn.
let bc = !var_b1 && ( var_b2 || var_b1 );     //calcula a expressão e atribui 0 a bc.

// Operadores de incremento/decremento: ++ e --. Incrementam ou decrementam variável em 1 unidade.

y++; //incrementa o valor da variável y criada anteriormente, que era 7, para 8.

// Operadores compostos: Executam uma operação aritmética e uma operação de atribuição em um único comando:

y += x;  //similar a y = y + x, soma x com y e atribui o novo resultado (12) a y.
y -= x;  //similar a y = y - x, subtrai x de y e atribui o novo resultado (8) a y.
y *= x;  //similar a y = y * x, multiplica x com y e atribui o novo resultado (32) a y.
y /= x;  //similar a y = y / x, divide y por x e atribui o novo resultado (8) a y. 

/* Operadores relacionais: comparam valores e retornam verdadeiro ou falso. Úteis em condicionais e loops, que serão vistos a seguir:

==  igualdade. Retorna verdadeiro se os valores comparados forem iguais. Este operador converte os valores antes da comparação se necessário.
Não confundir com o operador de atribuição ( = ) nem com o de igualdade estrita;
=== igualdade estrita: Retorna verdadeiro somente se os valores forem iguais e do mesmo tipo. Exemplo: */
console.log("0" == 0); //verdadeiro pois ambos representam zero
console.log("0" === 0); //falso pois um é um número zero e o outro é uma string cujo texto é o número zero

/*
!=  diferença. Retorna verdadeiro se os valores comparados forem diferentes. Não confundir com =! (atribuição com negação)
!== diferença estrita. Exemplo:*/
    
console.log("1" != 1); //falso pois ambos representam um.
console.log("1" !== 1); //verdadeiro pois um é um número um e o outro é uma string cujo texto é o número um.

/*
>   maior que. Retorna verdadeiro se o valor à esquerda for maior que o à direita.
<   menor que. Retorna verdadeiro se o valor à esquerda for menor que o à direita.
>=  maior ou igual. Retorna verdadeiro se o valor à esquerda for maior ou igual ao da direita.
<=  menor ou igual. Retorna verdadeiro se o valor à esquerda for menor ou igual ao da direita.
*/

console.log("x = "+x+"\ny = "+y); //imprime os valores atuais de x e y.

//Os condicionais abaixo executam seu respectivo comando caso o resultado da condição seja verdadeiro:
//Estudaremos mais sobre condicionais no futuro.

//como x=4 e y=8, a condição não é verdadeira e console.log() abaixo não será executado.
if( y == x ) console.log("x igual a y\n");
   
//a condição é verdadeira, o console.log() abaixo será executado.
if( y != x ) console.log("x diferente de y\n");   

//a condição não é verdadeira, o console.log() abaixo não será executado.
if( y < x )  console.log("y menor que x\n");

//a condição é verdadeira, o console.log() abaixo será executado.
if( y >= x ) console.log("y maior que, ou igual a x\n"); 
```

---

# JavaScript: Condicionais

```javascript
//Condicionais: if, if else, if else if, aninhamento de if, condicional ternário

/*if: executa um comando ou bloco de comandos se a variável ou expressão dentro do parêntese tiver resultado verdadeiro (diferente de zero).
Note que é comum, mas não obrigatório, que a expressão seja uma comparação explícita.*/

let a = 0; //declara a e define valor inicial igual a zero.

//o comando abaixo não será executado porque a precisaria ser diferente de zero:
if (a) console.log("a é verdadeiro");
  
a = 2; //atribui novo valor (2), diferente de zero, a a.
if (a) console.log("a é verdadeiro");    //este console.log será executado.

if (a) { //todo o bloco abaixo será executado pois a é diferente de zero.

    /* Chaves são opcionais quando há apenas um comando, mas obrigatórias
        quando uma sequência de comandos roda dentro de um if: */

    console.log("a maior ou igual a 1.");
    a = 5; console.log("valor de a foi atualizado para " + a);
}

/* if-else: executa um comando ou bloco se a condição for verdadeira e outro comando ou bloco
se a condição for falsa. */
//Exemplo: se a diferente de zero imprima "a diferente de zero", senão imprima "a igual a zero":
if (a) console.log("a maior ou igual a 1\n"); else console.log("a igual a zero");

let b = 2, c = 4, d = 0;
//Em vez de uma variável, pode-se avaliar uma expressão para decidir se a condição é verdadeira. 
//O exemplo abaixo executa o console.log() se a for igual a b:
if (a == b) console.log("a igual a b. Ambos valem " + a);  

//O exemplo abaixo console.log se a for menor que c e maior que d.
if (a <= c && a > d) console.log("a menor que c e maior que d"); 

//É possível selecionar uma condição numa sequência usando if-else-if.

let val1;
if (val1 < 0)       { console.log("val1 é negativo"); } 
else if (val1 == 0) { console.log("val1 tem valor zero"); }
else if (val1 > 0)  { console.log("valor é positivo maior que zero"); }

/* Não coloque ponto-e-vírgula após fechar o parêntese do if. Tal operação indicaria que nada deve ser executado mesmo quando o resultado da análise da condição for verdade: */

a = 0;                              //Atribui valor zero a a.
/* No exemplo abaixo, a é avaliado mas nenhuma operação é executada a partir do resultado
    do condicional, e console.log() sempre será executado independentemente do valor de a: */
if (a); console.log("algum texto aqui\n\n"); 

//Condicionais podem ser aninhados:
if ( a != b){
    if ( b > d ){ //executa somente se a condição anterior também for verdadeira.
        b = 0;
        console.log("b atualizado para zero\n"); 
    }
}

//Para pequenos condicionais ou condicionais cujo resultado deve ser armazenado numa variável, o operador condicional ternário ?: pode ser utilizado:

let idade = 26;
let alcool = (idade >= 18) ? "Sim" : "Não";
console.log("Autorizado a beber álcool? " + alcool);

//O condicional ternário também é útil para tratar valores nulos ou não definidos:
let nome; //tente inicializar a variável com uma string aqui.
console.log("Olá, "+ ( nome ? nome : "desconhecido") + "!" );
```