
# JavaScript: Validação de Formulários (HTML5 e JS)

A validação de dados é uma etapa crucial no desenvolvimento Web. Ela garante que as informações enviadas ao servidor estejam no formato correto, evitando erros de processamento e melhorando a segurança. A validação ocorre em duas frentes: no **HTML5** (nativa e instantânea) e no **JavaScript** (lógica customizada).

## Validação nativa do HTML5

O HTML5 introduziu atributos que permitem ao próprio navegador barrar o envio de formulários incorretos, sem precisar de uma única linha de JavaScript. Alguns dos mais úteis incluem:

- `required`: Torna o preenchimento do campo obrigatório.
- `type`: Define o tipo de dado (ex: `type="email"` exige um `@` e um domínio; `type="number"` restringe a entrada de letras).
- `minlength` e `maxlength`: Limitam a quantidade mínima e máxima de caracteres.
- `min` e `max`: Limitam valores numéricos ou datas.
- `pattern`: Permite definir uma **Expressão Regular (Regex)** que o texto deve seguir obrigatoriamente.

### Expressões Regulares (Regex) no atributo `pattern`
Uma Regex é uma sequência de caracteres que forma um padrão de busca. No HTML, usamos o atributo `pattern` para forçar o usuário a digitar exatamente no formato exigido.

```html
<!-- Exige apenas letras maiúsculas, minúsculas e números (sem espaços ou símbolos) -->
<input type="text" id="uid" pattern="[A-Za-z0-9]+" required />

<!-- Exige senha com no mínimo 8 caracteres, contendo pelo menos 1 número, 1 letra maiúscula e 1 minúscula -->
<input type="password" id="pwd" 
       pattern="(?=(.*[0-9]))((?=.*[A-Z])(?=.*[a-z]))^.{8,}$" required/>
```
*Nota: A barra `/` não é usada no atributo `pattern` do HTML, apenas o conteúdo da expressão.*

## Validação Customizada com JavaScript

Embora o HTML5 seja poderoso, ele não consegue validar lógicas complexas, como:
- Verificar se o campo "Confirmar Senha" é idêntico ao campo "Senha".
- Validar matematicamente se os dígitos de um CPF são reais.
- Consultar um banco de dados para saber se um nome de usuário já existe.

Para isso, usamos a **API de Constraint Validation** do JavaScript. O método principal é o `setCustomValidity('mensagem')`.
- Se você passar uma string vazia `''`, o campo é considerado **válido**.
- Se você passar qualquer texto, o campo é considerado **inválido** e o navegador bloqueará o envio do formulário, exibindo a mensagem que você definiu.

Para que a validação ocorra em tempo real (enquanto o usuário digita), utilizamos o evento `input`.

### Exemplo Prático: Formulário de Cadastro

Abaixo temos um formulário completo que mistura validação nativa do HTML com lógica customizada em JS (máscara de CPF, validação matemática do CPF e confirmação de senha).

**index.html**
```html
<!DOCTYPE html> 
<html lang="pt-br">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Formulário elaborado</title>
	<link rel="stylesheet" href="style.css">
	<script src="validate.js" defer></script>
</head>
<body>
<!-- O action="javascript:..." é apenas um placeholder para este exemplo não recarregar a página -->
<form action="javascript:alert('Formulário aprovado para envio!')" method="post" id="formcad">
    <p>Dados de login:</p>
    <label for="uid">Usuário*:</label> 	            
        <input type="text" name="uid" id="uid" pattern="[A-Za-z0-9]+" required />
    
    <label for="tel">Telefone:</label>	            
        <input type="tel" name="tel" id="tel" minlength="14" maxlength="15"/>
    
    <label for="email">E-mail*:</label>	            
        <input type="email" name="email" id="email" required />
    
    <label for="pwd">Senha*:</label>	            
        <input type="password" name="pwd" id="pwd" 
               pattern="(?=(.*[0-9]))((?=.*[A-Z])(?=.*[a-z]))^.{8,}$" required/>
               
    <label for="pwd2">Confirmar senha*:</label>     
        <input type="password" name="pwd2" id="pwd2" required />
    
    <p>Dados pessoais e de contato:</p>
    <label for="nome">Nome completo*:</label>       
        <input type="text" name="nome" id="nome" required />
        
    <label for="cpf">CPF*:</label>                  
        <input type="text" name="cpf" id="cpf" maxlength="14" required/>

    <p>Gênero:</p>
    <!-- Note que o 'for' do label aponta para o 'id' do input, não para o 'name' -->
    <label for="masc">Masculino <input type="radio" name="gen" value="masc" id="masc"/></label>
    <label for="fem">Feminino <input type="radio" name="gen" value="fem" id="fem"/></label>  
    <label for="out">Outro <input type="radio" name="gen" value="out" id="out"/></label>  

    <label for="nasc">Data de nascimento*:</label>  
        <input type="date" name="nasc" id="nasc" required />
        
    <label for="idade">Idade calculada:</label>               
        <input type="text" name="idade" id="idade" disabled />
        
    <label for="cor">Cor preferida:</label>          
        <input type="color" name="cor" id="cor"/>
        
    <br><br>
    <label for="lic">
        <input type="checkbox" name="lic" id="lic" required /> 
        Aceito os <b>Termos de uso</b> e a <b>Política de Privacidade</b>
    </label>

    <br><br>
    <input type="reset" value="❌ Limpar"/>
    <input type="submit" value="✔️ Enviar"/>
</form>
</body>
</html>
```

**validate.js**
```javascript
const pwd = document.getElementById("pwd");
const pwd2 = document.getElementById("pwd2");
const cpf = document.getElementById("cpf");
const nasc = document.getElementById("nasc");

// Função genérica de validação chamada a cada tecla digitada
function validate(item){
    item.setCustomValidity(''); // Limpa erros de validação anteriores
    item.checkValidity();       // Refaz a checagem de validação nativa do HTML

    // Lógica Customizada 1: As senhas conferem?
    if (item === pwd2){
        if (item.value === pwd.value || item.value === '') { 
            item.setCustomValidity(''); 
        } else { 
            item.setCustomValidity('As senhas não batem.'); 
        }
    }
	
    // Lógica Customizada 2: O CPF é matematicamente válido?
    if (item === cpf){
        // Remove pontos e traços para deixar apenas os números
        let numCPF = cpf.value.replace(/\D/g, ""); 
        
        // Só valida se o usuário já tiver digitado os 11 dígitos
        // (Evita que o campo fique vermelho enquanto ele ainda está digitando)
        if (numCPF.length === 11) {
            if ( validateCPF(numCPF) ) { 
                item.setCustomValidity(''); 
            } else {  
                item.setCustomValidity('CPF inválido.'); 
            }
        }
    }
}

// Aplicando máscara automática de CPF usando Regex
function maskCPF(){
    let numCPF = cpf.value.replace(/\D/g, ""); // Remove tudo que não for dígito
    
    // Aplica a formatação XXX.XXX.XXX-XX
    numCPF = numCPF.replace(/(\d{3})(\d)/, "$1.$2");
    numCPF = numCPF.replace(/(\d{3})(\d)/, "$1.$2");
    numCPF = numCPF.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    
    cpf.value = numCPF;
    validate(cpf); // Revalida o campo após aplicar a máscara
}

// Algoritmo matemático para validar os dígitos verificadores do CPF
function validateCPF(cpf){
    if (cpf.length < 11) return false;
    
    // Elimina CPFs com todos os dígitos iguais (ex: 111.111.111-11)
    if (/^(\d)\1+$/.test(cpf)) return false;

    let number = cpf.substring(0,9);
    let digits = cpf.substring(9);
    let sum = 0;
    
    // Valida primeiro dígito
    for (let i = 10; i > 1; i--) sum += number.charAt(10 - i) * i;
    let result = (sum % 11 < 2) ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(0)) return false;

    // Valida segundo dígito
    number = cpf.substring(0,10);
    sum = 0;
    for (let i = 11; i > 1; i--) sum += number.charAt(11 - i) * i;
    result = (sum % 11 < 2) ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(1)) return false;

    return true;
}

// Cálculo automático de idade baseado na data de nascimento
function calcularIdade() {
    if (!nasc.value) return;
    const hoje = new Date();
    const nascimento = new Date(nasc.value + "T00:00:00"); // Ajuste de fuso horário
    
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    
    // Ajusta se ainda não fez aniversário no ano atual
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    document.getElementById("idade").value = idade + " anos";
}

// Ouvintes de Evento (Events Listeners)
pwd2.addEventListener('input', () => validate(pwd2));
cpf.addEventListener('input', maskCPF);
nasc.addEventListener('change', calcularIdade);
```