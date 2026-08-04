
# JavaScript: Consumo de APIs e Assincronismo (Fetch)

Nas páginas web modernas, é muito comum precisarmos buscar informações de um servidor externo sem recarregar a página inteira. Fazemos isso consumindo APIs, que geralmente nos retornam dados no formato JSON.

## A função `fetch()` e o Assincronismo

O JavaScript no navegador é **assíncrono e orientado a eventos**. Isso significa que, se pedirmos para o JavaScript baixar um arquivo grande de um servidor, ele não vai "congelar" a página esperando o download terminar. Ele inicia o download em segundo plano e continua executando o resto do seu código.

Para lidar com isso, o JavaScript moderno utiliza o conceito de **Promises** (Promessas). Uma Promise é exatamente o que o nome diz: a promessa de que, *em algum momento no futuro*, um valor será retornado (seja o sucesso da operação, seja um erro).

A função `fetch()` é a forma nativa e moderna de fazer requisições HTTP. Ela retorna uma Promise, e nós encadeamos métodos `.then()` para dizer ao JavaScript o que fazer quando os dados chegarem.

### Exemplo 1: Busca de CEP (ViaCEP)

Vamos criar um formulário onde, ao digitar um CEP e clicar em buscar, o JavaScript consulta a API gratuita dos Correios (ViaCEP) e preenche o endereço automaticamente.

**index.html**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exemplo API ViaCEP</title>
    <script src="scripts.js" defer></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <form action="#" onsubmit="return false;"> <!-- onsubmit="return false" impede o recarregamento da página ao dar Enter -->
        <label>CEP:</label>
        <input name="cep" type="text" id="cep" minlength="8" maxlength="9" placeholder="Ex: 01001000"/>
        <!-- Note que não usamos mais o onclick inline aqui, mantendo a separação de responsabilidades -->
        <input type="button" value="Buscar CEP" id="btncep">
        
        <p>Endereço encontrado:</p>
        <label>Rua:</label>
        <input name="logradouro" type="text" id="logradouro" readonly />
        
        <label>Complemento:</label>
        <input name="complemento" type="text" id="complemento" readonly />
        
        <label>Bairro:</label>
        <input name="bairro" type="text" id="bairro" readonly />
        
        <label>Cidade:</label>
        <input name="localidade" type="text" id="localidade" readonly />
        
        <label>Estado (UF):</label>
        <input name="uf" type="text" id="uf" size="2" readonly />
    </form>
</body>
</html>
```

**scripts.js**
```javascript
const btnCep = document.getElementById("btncep");

btnCep.addEventListener("click", buscaCEP);

function buscaCEP(){
    // Obtém CEP do HTML e remove quaisquer caracteres não numéricos (traços, espaços)
    let cep = document.getElementById("cep").value.replace(/\D/g, '');
    
    // Verificação simples para evitar requisições inválidas
    if (cep.length !== 8) {
        alert("Por favor, digite um CEP válido de 8 dígitos.");
        return;
    }

    // fetch() retorna uma Promise. O .then() captura a resposta do servidor.
    fetch(`https://viacep.com.br/ws/${cep}/json`)  
        .then(resp => resp.json()) // Converte a resposta bruta em um objeto JavaScript (JSON)
        .then(json => {
            // Verifica se a API retornou erro (ex: CEP inexistente)
            if (json.erro) {
                alert("CEP não encontrado!");
                return;
            }

            // Object.entries(json) transforma o objeto em um array de pares [chave, valor]
            // Ex: [['logradouro', 'Praça da Sé'], ['localidade', 'São Paulo'], ...]
            for(let [campo, valor] of Object.entries(json)) {
                // Se existir um input no HTML com o ID igual à chave do JSON, preencha-o:
                if(document.getElementById(campo)){ 
                    document.getElementById(campo).value = valor; 
                }
            }
        })
        .catch(erro => {
            console.error("Erro na requisição:", erro);
            alert("Ocorreu um erro ao buscar o CEP. Verifique sua conexão.");
        });
}
```

### Exemplo 2: Selects em Cascata (API do IBGE)

Um caso de uso muito comum é popular menus suspensos (`<select>`) dinamicamente. Abaixo, usamos a API oficial do IBGE para carregar os Estados do Brasil e, ao selecionar um Estado, buscar as suas respectivas Cidades.

**index.html**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estados e Cidades (IBGE)</title>
    <script src="scripts.js" defer></script>
</head>
<body>
    <label for="uf">Selecione o Estado:</label>
    <select name="uf" id="uf">
        <option value="0">Carregando estados...</option>
    </select>

    <label for="cidade">Selecione a Cidade:</label>
    <select name="cidade" id="cidade" disabled>
        <option value="0">Selecione um estado primeiro</option>
    </select>
</body>
</html>
```

**scripts.js**
```javascript
const apiLinkIBGE = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
const ufSelect = document.getElementById("uf");
const cidadeSelect = document.getElementById("cidade");

// window.onload garante que o DOM e a página estejam totalmente prontos antes de executar
window.onload = function(){ 
    fetch(apiLinkIBGE)      
        .then(resp => resp.json())  
        .then(json => {             
            // Limpa o select e adiciona a opção padrão
            ufSelect.innerHTML = "<option value='0'>Selecione o Estado</option>";
            
            // Itera sobre a lista de estados usando Arrow Function
            json.forEach(estado => {
                // Usando Template Literal para injetar o HTML de forma limpa
                ufSelect.innerHTML += `<option value="${estado.id}">${estado.nome}</option>`;
            });
        });
}

// Quando o usuário muda o Estado, buscamos as cidades daquele estado
ufSelect.addEventListener("change", function(){
    const estadoId = ufSelect.value;
    
    // Limpa o select de cidades e o desabilita enquanto carrega
    cidadeSelect.innerHTML = "<option value='0'>Carregando cidades...</option>";
    cidadeSelect.disabled = true;

    // Se o usuário voltou para a opção "0" (Selecione o Estado), não faz a requisição
    if (estadoId === "0") {
        cidadeSelect.innerHTML = "<option value='0'>Selecione um estado primeiro</option>";
        return;
    }

    // Faz a requisição para o endpoint de municípios do estado selecionado
    fetch(`${apiLinkIBGE}/${estadoId}/municipios`)
        .then(resp => resp.json())
        .then(json => {
            cidadeSelect.innerHTML = "<option value='0'>Selecione a Cidade</option>";
            cidadeSelect.disabled = false; // Reabilita o campo
            
            json.forEach(cidade => {
                cidadeSelect.innerHTML += `<option value="${cidade.id}">${cidade.nome}</option>`;
            });
        })
        .catch(erro => {
            console.error("Erro ao buscar cidades:", erro);
            cidadeSelect.innerHTML = "<option value='0'>Erro ao carregar</option>";
        });
});
```