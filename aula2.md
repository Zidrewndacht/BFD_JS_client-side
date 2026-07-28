# JavaScript: getElementById() e addEventListener()

Assista minhas videoaulas em https://tinyurl.com/playlist-js-las para auxiliar seu aprendizado.

Como vimos anteriormente, em JavaScript, temos uma série de formas diferentes de interagir com o usuário. Uma das mais importantes é a manipulação de elementos do HTML sendo exibido ao usuário. 
Todo elemento do HTML que contenha uma ID pode ter suas características e dados acessados pelo comando `document.getElementById("id-do-elemento")`. Lembre-se que IDs são de uso único no HTML. Reutilizar a mesma ID mais de uma vez impediria o JavaScript de identificar corretamente o elemento por sua ID.
Existem outras formas de acessar um elemento, como por sua classe (`document.getElementsByClassName("classe")`, que retorna um array contendo todos os elementos de uma dada classe, estudaremos mais sobre arrays e sobre essa função no futuro) ou por um conjunto de seletores (`document.querySelector("seletor0 seletor1")`, que encontra o primeiro elemento que atenda a todos os seletores fornecidos).
Normalmente, quando utilizamos `getElementById`, desejamos acessar alguma característica ou informação contida no elemento. Alguns exemplos:

```javascript
document.getElementById('mensagem').innerHTML="Olá" /* substitui o conteúdo em HTML do elemento com id “mensagem” por “Olá”. */

document.getElementById('sobre').style.right="calc(45px - 100vw)"; /* ajusta no elemento com ID "sobre" a propriedade right: do CSS, substituindo seu valor por calc(45px - 100vw); */

document.getElementById('sobre').classList.add("aberto"); /* add a classe “aberto” do elemento com ID “sobre”, caso exista. Útil para alterar várias características do CSS simultaneamente, fazendo com que o navegador passe instantaneamente a usar o CSS desta classe no elemento selecionado. */

document.getElementById('sobre').classList.remove("aberto"); /* remove a classe adicionada acima */

let tempc = document.getElementById("entrada-tempc").value; /* define a variável tempc com o valor atualmente inserido no elemento com ID entrada-tempc. O tipo de dado depende do tipo de informação armazenada no elemento. O HTML do elemento pode conter “input type=‘number’” para restringir a variável a valores numéricos, por exemplo. */
```

## Funções e addEventListener():
Podemos acessar elementos do HTML, tanto para leitura quanto para escrita, usando `getElementById`. Entretanto é necessária uma forma de utilizar interações do usuário para disparar as alterações definidas pelo `getElementById`.
A forma mais simples, embora menos recomendada, é adicionar o atributo `onclick` em um elemento do HTML para que, quando este for clicado, uma função especificada seja executada:

```html
<button id="calcular" onclick="square()"> Calcular 5² </button>
```

Uma função em JavaScript é uma sequência de operações (inclusive possíveis chamadas a outras funções) e é geralmente declarada da forma a seguir:

```javascript
function perim(a, b) {	
    return 2 * a + 2 * b;
}
```

onde `perim` é o nome da função, `a` e `b` são argumentos de entrada da função (podem ser qualquer nome de variável: estas são variáveis locais usadas dentro da função, que recebem dados de fora da função). O comando `return` indica o que a função retorna como resultado, no caso acima, o resultado da fórmula apresentada. Para utilizar a função:

```javascript
let valor = perim(5, 4);  /* Executa a função perim e define ‘valor’ como o
resultado (return) da mesma quando os argumentos de entrada são a=5 e b=4. */
```

Argumentos de entrada e retorno são opcionais em funções, uma função pode não precisar de um deles, ou nenhum, conforme sua aplicação e a forma como está implementada.
Note que adicionar `onclick=` a elementos diretamente no código HTML não é recomendado porque quebra a separação entre conteúdo (HTML), formatação (CSS) e lógica (JavaScript). Em vez disso, pode-se definir o evento ao clicar no botão diretamente no arquivo de scripts, sem alterar o HTML, através da função `addEventListener()`. O código a seguir cria o “ouvinte de evento” (que fica a espera de um evento e executa a função especificada quando o evento ocorrer):

```javascript
document.getElementById("calcula-ret").addEventListener("click", calcret);
```

onde `getElementById("calcula-ret")` seleciona o elemento da mesma forma vista anteriormente, `"click"` é o tipo de evento que estamos definindo (clicar no elemento com `id="calcular"`) e `calcret` é o nome da função. Note que desta vez a função não recebe argumentos. Acompanhando o código acima, devemos definir a função `calcret`:

```javascript
function calcret(){
    let ladoa = document.getElementById("entrada-lado-a").value;
    let ladob = document.getElementById("entrada-lado-b").value;

    let area = ladoa * ladob;
    let perim = 2*ladoa + 2*ladob;
    
    document.getElementById("result-area").value = area.toFixed(1);
    document.getElementById("result-perim").value = perim.toFixed(1);
}
```

Existem diversos ouvintes de evento disponíveis para `addEventListener`, referentes a eventos do usuário, da rede, do navegador, entre outros. Alguns exemplos adicionais de eventos do usuário:
- `"keydown"`: Ocorre no instante em que qualquer tecla é pressionada;
- `"keyup"`: Ocorre no instante em que qualquer tecla previamente pressionada é solta;
- `"dblclick"`: ocorre quando o elemento recebe um clique duplo;
- `"select"`: ocorre quando algum texto do elemento está sendo selecionado;
- `"change"`: ocorre quando o valor do elemento muda;

A lista de eventos possíveis pode ser encontrada em: https://developer.mozilla.org/pt-BR/docs/Web/Events

O exemplo a seguir cria uma calculadora de graus Celsius para Fahrenheit que atualiza instantaneamente a cada alteração no valor de entrada:

**index.html:**
```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />    
    <script src="scripts.js" defer></script> 
</head>
<body>
    <div class="wrapper" id="ftoc-wrapper">
        <h1>Conversor Fahrenheit para Celsius</h1>
        <label >Temperatura em Celsius:</label>
        <input type="number" id="entrada-tempc" >
        <label >Temperatura em Fahrenheit:</label>
        <input type="text" id="result-tempf" disabled></input>
        <button class="calcula-btn" id="calcula-tempc">Calcular</button>
    </div>
</body>
</html>
```

**scripts.js:**
```javascript
function ctof() { /* calcula °F a partir de °C lido de input id=“entrada-tempc”: */
    let tempc = document.getElementById("entrada-tempc").value;
    if (tempc < -273.15){ /* se temperatura for abaixo de zero absoluto, não calcule: */
        document.getElementById("result-tempf").value="Valor inexistente abaixo de 0 K!";
    } else { /* senão, calcule e preencha o valor do elemento input id=“result-tempf” */
        let tempf = ((tempc / 5) * 9 + 32);
        document.getElementById("result-tempf").value=tempf.toFixed(1);
  /* .toFixed(1) arredonda o valor para uma casa decimal */
    }
}
/* Executa a função ctof sempre que houve alteração em entrada-tempc: */
document.getElementById("entrada-tempc").addEventListener('change', ctof);
```

---

## Revisão if() e operadores lógicos: Calculadora de ano bissexto:

Um dos exercícios solicitados anteriormente pedia o desenvolvimento de uma calculadora de ano bissexto. Para resolvê-lo, podemos utilizar condicionais e operadores lógicos, conforme a seguir:

```javascript
function bissexto(){	
    let ano = document.getElementById("entrada-bis").value;
/* Sendo E = &&, OU = || e NÃO = !
 * e sendo o operador de “resto da divisão inteira” = %
 *
 * se ano dividido por 100 tiver resto 0, OU 
 * ano dividido por 4 tiver resto 0 E ano dividido por 400 NÃO tiver resto 0
 * então o ano é bissexto.
 */
    if (ano % 400 === 0 || ano % 4 === 0 && ano % 100 !== 0){
        document.getElementById("result-bis").value="O ano é bissexto";
    } else { //senão o ano não é bissexto:
        document.getElementById("result-bis").value="O ano não é bissexto";
    }
}
```

O código HTML a seguir corresponde ao JavaScript apresentado acima (para ambos os exercícios, do ano bissexto e das tabuadas):

```html
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />    
    <link rel="stylesheet" href="style.css" /> 
    <script src="scripts.js" defer></script> 
</head>

<body>    
    <div class="content">
        <div class="wrapper">
            <h1>Gerador de tabuada</h1>
            <label>Valor tabuada:</label>
            <input type="number" id="valor-tabuada" value="1">
            <button class="calcula-btn" id="cria-tab">Gerar</button>
            <button class="calcula-btn" id="cria-todas">Gerar 2 a 10</button>
            <div id="result-wrapper"> Resultados aparecerão aqui. </div>
        </div>
        
        <div class="wrapper" >
            <h1>Calculadora ano bissexto</h1>
            <label >Ano:</label>
            <input type="number" id="entrada-bis">
            <label >Resultado:</label>
            <input type="text" id="result-bis" disabled></input>
            <label >Resultado instantâneo.</label>
        </div>
    </div>
</body> 
</html>
```

---

# JavaScript: Loop While()

Assista minhas videoaulas em https://tinyurl.com/playlist-js-las para auxiliar seu aprendizado.

O loop while (“enquanto”) repete um comando ou sequência de comandos, enquanto a condição indicada nos parênteses for verdadeira:

```javascript
while (expr){
    comando();
}
```

onde `expr` é uma expressão que será avaliada. Caso o resultado de `expr` seja um valor avaliado como “verdade”, o conteúdo dentro das chaves (como a função `comando()` no exemplo acima) será executado e, depois, `expr` será novamente avaliada. A operação se repetirá enquanto `expr` for verdadeira.
O exemplo abaixo demonstra uma função que produz uma tabuada, linha a linha, usando loop while para repetir o processo (com um multiplicador diferente) a cada linha:

```javascript
function calctab(ntab){ //calcula a tabuada ntab e gera innerHTML correspondente
    let multi = 1; //valor inicial da tabuada
    let tabuada = "";    //armazena a tabuada criada a seguir:
    while(multi<=9){    //repete a escrita de cada linha da tabuada, de 1 a 9
        tabuada += `${ntab} x ${multi} = ${ntab * multi} <br />`;
        multi++;    //incrementa multi em 1 para a próxima linha da tabuada.
    }
    return tabuada; //entrega string contendo a tabuada.
}
```

## createElement() e appendChild():

Podemos criar novos elementos no HTML utilizando `document.createElement()`, e tornar este novo elemento um filho de um elemento existente utilizando `appendChild()`:
Com essas funções, podemos utilizar a função `calctab()` criada acima, para produzir novos elementos `<div>` no HTML, contendo suas respectivas tabuadas:

```javascript
function criaDivTab(n) {   //cria div com tabuada de n solicitada
    let htmltab = calctab(n);   //armazena em htmltab a string da tabuada.
    tabdiv = document.createElement("div"); //cria div;
    tabdiv.className = "result-tab";//define a classe do div como result-tab (para ajustes no CSS);
    tabdiv.id = "result-tab-"+n;    //define id do div;
    tabdiv.innerHTML = htmltab;     //define conteúdo do div como a string da tabuada;

    document.getElementById("result-wrapper").appendChild(tabdiv);  
        //torna o novo div um filho de #result-wrapper
}
```

Para utilizar a função `criaDivTab()` que criamos, podemos ler o valor de um campo numérico de entrada disponível para o usuário, e, a partir de um evento (como pressionar um botão que podemos chamar de “gerar tabuada”), executar a função, enviando como argumento o valor da tabuada solicitada pelo usuário:

```javascript
function cria1tab() {
    document.getElementById("result-wrapper").innerHTML=""; //limpa o div de resultados (do contrário a cada novo clique, uma nova tabuada aparecerá próxima da anterior);
    let n = document.getElementById("valor-tabuada").value; //coleta n do usuário
    criaDivTab(n);//executa a função com o n solicitado (criando o div com a tabuada)
}

document.getElementById("cria-tab").addEventListener("click", cria1tab);
```

Se quisermos criar múltiplas tabuadas com um único clique, podemos disponibilizar no HTML mais um botão “gerar 2 a 10”, por exemplo, que, ao ser clicado, chama a função `criaDivTab()` quantas vezes forem necessárias para produzir todas as tabuadas de 2 até 10:

```javascript
function criatodas(){
    document.getElementById("result-wrapper").innerHTML="";//limpa o div de resultados (do contrário a cada novo clique, 9 novas tabuadas aparecerão próximas das anteriores);
    let n = 2; //defina o n como 2 para a primeira tabuada
    while(n <= 10) {	//enquanto n for menor ou igual a 10:
        criaDivTab(n);	//gere novo div contendo a tabuada correspondente
        n++; //incrementa multi em 1 para a próxima linha da tabuada.
    }
}

document.getElementById("cria-todas").addEventListener("click", criatodas);
```

---

# JavaScript: Loop for(;;)

Assista minhas videoaulas em https://tinyurl.com/playlist-js-las para auxiliar seu aprendizado.

O loop for(;;) repete um comando ou sequência de comandos, enquanto a condição indicada nos parênteses for verdadeira:

```javascript
for (expr1 ; expr2 ; expr3){
    comando();
}
```

onde `expr1` é uma expressão que executa antes de iniciar o loop, `expr2` é avaliado no início de cada repetição e termina o loop caso produza resultado falso e `expr3` executa ao final de cada repetição. O funcionamento é equivalente ao código visto loop while() a seguir:

```javascript
expr1;
while(expr2){
    comando();
    expr3;
}  
```

Os argumentos do loop for são opcionais (é comum suprimir o primeiro argumento, `expr1`, quando não é necessário criar uma nova variável local ao iniciar o loop, por exemplo), mas os ponto-e-vírgula são obrigatórios. 
Além do loop `for(;;)` existem os loops `for(...in...)` e `for(...of...)`, mas só estudaremos o loop `for` comum (acima) desta vez.
É possível adaptar o código apresentado na aula anterior (usando loop while) para que utilize o loop `for(;;)`. É comum que o código usando loop `for(;;)` seja mais “compacto”, visto que mais informação acaba ficando na mesma linha:

```javascript
function calctab(ntab){ //calcula a tabuada ntab e gera innerHTML correspondente
    let tabuada="";    //armazena a tabuada criada a seguir:
    for(let multi=1; multi<=9; multi++){
        tabuada = tabuada + (ntab + " x " + multi + " = " + ntab*multi + "<br />");
    }
    return tabuada; //entrega string contendo a tabuada.
}

function criaDivTab(n) {   //cria div com tabuada de n solicitada
    let htmltab = calctab(n);   //armazena em htmltab a string da tabuada.
    tabdiv = document.createElement("div");
    tabdiv.className = "result-tab";
    tabdiv.id = "result-tab-"+n;    
    tabdiv.innerHTML = htmltab;  
    document.getElementById("result-wrapper").appendChild(tabdiv);  
}

function criatodas(){
    document.getElementById("result-wrapper").innerHTML="";
    for(let n = 2; n <= 10; n++) { criaDivTab(n); }
}
```

## Criando abas com JavaScript e CSS:

Podemos criar uma página contendo múltiplas abas, sem tempo de carregamento na troca de abas (pois todas as abas são previamente carregadas) manipulando o CSS da página dinamicamente através de JavaScript.
No HTML, criamos uma série de botões com IDs enumerados, onde cada botão será uma aba:

```html
<div class="tabs">
    <button id="btn-0" class="tab ativa">Gerador de tabuada</button>
    <button id="btn-1" class="tab">Calculadora de ano bissexto</button>
    <button id="btn-2" class="tab">Conversor °F para °C</button>
    <button id="btn-3" class="tab">Calculadora área/perímetro</button>
</div>
```

Em seguida, crie um div para o conteúdo de cada aba, em seu HTML:

```html
<div class="content">
    <div class="wrapper" id="wrapper-0">
<!-- Conteúdo gerador de tabuada aqui. Exemplo: -->
        <h1>Gerador de tabuada</h1>
        <label>Valor tabuada:</label>
        <input type="number" id="valor-tabuada" value="1"></input>
        <button class="calcula-btn" id="cria-tab">Gerar</button>
        <button class="calcula-btn" id="cria-todas">Gerar 2 a 10</button>
        <div id="result-wrapper"></div>
    </div>
    <div class="wrapper" id="wrapper-1">
<!-- Conteúdo calculadora ano bissexto aqui -->
    </div>
    <div class="wrapper" id="wrapper-2">
 <!-- Conteúdo Conversor °F para °C aqui -->
    </div>
    <div class="wrapper" id="wrapper-3">
 <!--Conteúdo Calculadora área/perímetro aqui-->
    </div>
</div>
```

Exibir a página acima no navegador normalmente colocaria todas as calculadoras correspondentes, uma após a outra. Podemos usar o código JavaScript a seguir para que apenas uma das calculadoras seja exibida, conforme a aba selecionada pelo usuário: 

```javascript
function seleciona(aba){
    //Primeiro des-seleciona todas as abas:
    const lista = document.getElementsByClassName("wrapper"); /*encontra cada uma das abas*/
    lista.forEach((wrapper, i) => {
        wrapper.style.display = "none";
        /* Configura exibição do wrapper de conteúdo como "none", escondendo o elemento: */
        /* Remove classe 'ativa' do botão. Esta classe será utilizada no CSS para que o estilo do botão selecionado seja diferente dos outros botões. */
        document.getElementById("btn-" + i).classList.remove("ativa");
    }

    /* Configura exibição do wrapper de conteúdo como "grid", exibindo-o como um elemento com layout de grade (pois este é o layout usado no CSS para os elementos wrapper desta aplicação): */
    document.getElementById("wrapper-" + aba).style.display="grid";

    /* Adiciona classe 'ativa' ao botão. Esta classe será utilizada no CSS para que o estilo do botão selecionado seja diferente dos outros botões. */
    document.getElementById("btn-" + aba).classList.add("ativa");
}
```

A função criada acima precisa ser chamada através de uma interação do usuário, no caso, ao clicar em uma das abas (indicando que o conteúdo desta aba deve ser exibido). Para isto, criamos ouvintes de eventos sobre cada botão de forma a executar a função, com o valor da aba correspondente. Note que isso requer passagem de parâmetros para a função dentro da criação do ouvinte de eventos, o que não é suportado diretamente.
Portanto, precisamos criar uma função anônima, a qual chamará nossa função e passará o parâmetro correspondente:

```javascript
//A passagem de parâmetros dentro de event listener deve ser feita da forma a seguir:
document.getElementById("btn-0").addEventListener("click", function(){seleciona("0")});
document.getElementById("btn-1").addEventListener("click", function(){seleciona("1")});
document.getElementById("btn-2").addEventListener("click", function(){seleciona("2")});
document.getElementById("btn-3").addEventListener("click", function(){seleciona("3")});

// Passar parâmetros ‘diretamente’ como no exemplo abaixo não é suportado pelo addEventListener!
document.getElementById("btn-0").addEventListener("click", seleciona("0"));
```

Por fim, para garantir que a primeira aba venha selecionada ao carregar a página, adicione ao fim do script:

```javascript
seleciona(0);   //inicia com primeira aba selecionada;
```

# Arrow Functions e a Sintaxe Moderna de Callbacks

As **arrow functions** (funções de flecha) são uma forma mais concisa de escrever funções em JavaScript, introduzidas no padrão ES6 (2015). Elas são especialmente úteis quando precisamos passar funções como argumento para outras funções — o que chamamos de **callbacks**.

A sintaxe básica substitui a palavra-chave `function` por uma "flecha" (`=>`) entre os parâmetros e o corpo da função:

```javascript
// Função tradicional:
function soma(a, b) {
    return a + b;
}

// Arrow function equivalente:
const soma = (a, b) => {
    return a + b;
};
```

Quando o corpo da função tem **apenas uma linha** com `return`, podemos simplificar ainda mais, removendo as chaves e o `return`:

```javascript
const soma = (a, b) => a + b;
```

Se a função tem **apenas um parâmetro**, os parênteses também são opcionais:

```javascript
const dobro = x => x * 2;
```

Se a função **não tem parâmetros**, usamos parênteses vazios:

```javascript
const saudacao = () => "Olá!";
```

## Substituindo a "gambiarra" do addEventListener

Na seção anterior sobre a criação de abas, precisamos passar um parâmetro para a função `seleciona()` dentro do `addEventListener`. Como o `addEventListener` espera receber uma **referência a uma função** (e não o resultado da execução de uma função), usamos uma função anônima tradicional como intermediária:

```javascript
// Forma anterior (funciona, mas é verbosa):
document.getElementById("btn-0").addEventListener("click", function(){ seleciona("0") });
document.getElementById("btn-1").addEventListener("click", function(){ seleciona("1") });
document.getElementById("btn-2").addEventListener("click", function(){ seleciona("2") });
document.getElementById("btn-3").addEventListener("click", function(){ seleciona("3") });
```

Com arrow functions, essa mesma lógica fica significativamente mais limpa e legível:

```javascript
// Forma moderna com arrow functions:
document.getElementById("btn-0").addEventListener("click", () => seleciona("0"));
document.getElementById("btn-1").addEventListener("click", () => seleciona("1"));
document.getElementById("btn-2").addEventListener("click", () => seleciona("2"));
document.getElementById("btn-3").addEventListener("click", () => seleciona("3"));
```

O comportamento é **exatamente o mesmo**: ao clicar no botão, a arrow function é executada e, por sua vez, chama `seleciona("0")`. A diferença é puramente sintática — escrevemos menos código e a intenção fica mais clara.

### Por que não podemos passar o parâmetro diretamente?

```javascript
// ⚠️ CÓDIGO INCORRETO — NÃO FAÇA ISSO:
document.getElementById("btn-0").addEventListener("click", seleciona("0"));
```

No exemplo acima, `seleciona("0")` é **executado imediatamente** no momento em que o navegador lê essa linha. O `addEventListener` receberia o *retorno* da função (que neste caso é `undefined`), e não a função em si. Por isso precisamos da arrow function como "embrulho": ela **não executa nada agora**, apenas diz ao navegador: "quando o clique acontecer, execute isto aqui dentro".

### Aplicação em loops

Podemos ir além e usar um loop para criar todos os ouvintes de uma vez, sem repetir código:

```javascript
for (let i = 0; i <= 3; i++) {
    document.getElementById("btn-" + i).addEventListener("click", () => seleciona(String(i)));
}
```

> **Atenção:** note o uso de `let` (e não `const` ou `var`) na variável `i` do loop. A palavra-chave `let` cria um novo escopo a cada iteração do loop, o que garante que a arrow function capturará o valor correto de `i`. Se usássemos `var`, todas as funções capturariam o valor final de `i` (neste caso, `4`), resultando em um bug clássico do JavaScript.
