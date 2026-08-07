# Aula 5 — A Ponte Cliente-Servidor: APIs JSON e Atualizações em Tempo Real

Nas aulas anteriores, construímos duas metades de uma aplicação web moderna. Agora, vamos unir essas duas metades. Em vez de o Flask retornar páginas HTML inteiras a cada clique (o que recarrega a tela e perde o estado da interface), vamos usar o Flask como uma API de Dados que retorna JSON. O JavaScript no navegador será responsável por pedir esses dados "por baixo dos panos" (via `fetch`) e atualizar a tela dinamicamente.

---

## 1. O Cenário: Enquete Ao Vivo (Live Polling)

Vamos construir uma **Enquete Ao Vivo**, ideal para ser usada em palestras ou salas de aula. 
- Vários usuários acessam a mesma página em seus celulares ou notebooks.
- Eles escolhem uma opção e votam.
- A tela de **todos** os usuários exibe barras de progresso que crescem e se atualizam automaticamente a cada 3 segundos, sem que ninguém precise apertar F5.
- A opção que estiver ganhando ganha um destaque visual dourado.
- O servidor usa a **Sessão** para impedir que o mesmo usuário vote mais de uma vez.

### Estrutura do Projeto
Seguindo o padrão *Application Factory* e *Blueprints* que aprendemos na Aula 3, criaremos um novo pacote Python chamado `livepoll`:

```text
livepoll_app/
├── livepoll/
│   ├── __init__.py       # Application Factory
│   ├── enquete.py        # Blueprint (Rotas da API e Renderização)
│   ├── templates/
│   │   ├── base.html
│   │   └── enquete/
│   │       └── index.html
│   └── static/
│       ├── style.css
│       └── enquete.js    # A mágica do fetch e interval
└── .venv/
```

---

## 2. O Back-end: Flask como API de Dados

No arquivo `livepoll/enquete.py`, teremos duas rotas que retornam **JSON** (para o JavaScript consumir) e uma rota que retorna **HTML** (para renderizar a página inicial).

*Nota: Para manter o exemplo mínimo e focado na integração JS-Flask, usaremos um dicionário em memória para armazenar os votos. Em um app real, você usaria o SQLite da Aula 4.*

### 2.1 Application Factory

Como já aprendemos na Aula 3, criamos a fábrica da aplicação em `livepoll/__init__.py`. Configure a `secret_key` para que a sessão funcione e registre o blueprint `enquete`.

<details>
<summary><strong>Ver solução — livepoll/__init__.py</strong></summary>

```python
# livepoll/__init__.py
import os
from flask import Flask

def create_app():
    app = Flask(__name__)
    app.secret_key = os.urandom(24) # Essencial para a sessão funcionar
    
    from . import enquete
    app.register_blueprint(enquete.bp)
    
    return app
```

</details>

### 2.2 Blueprint da Enquete

Crie o blueprint `enquete` com três rotas:
1. `/` — renderiza o template inicial
2. `/api/status` — retorna JSON com os votos atuais, quem está liderando, e se o usuário já votou (via sessão)
3. `/api/votar` — recebe POST com a opção escolhida, valida a sessão, incrementa o voto e retorna JSON

<details>
<summary><strong>Ver solução — livepoll/enquete.py</strong></summary>

```python
# livepoll/enquete.py
from flask import Blueprint, render_template, request, jsonify, session

bp = Blueprint('enquete', __name__)

# "Banco de dados" em memória apenas para este exemplo
VOTOS = {
    'python': 0,
    'javascript': 0,
    'rust': 0
}

@bp.route('/')
def index():
    # Rota tradicional: renderiza o HTML inicial
    return render_template('enquete/index.html')

@bp.route('/api/status', methods=['GET'])
def status():
    """API: O JS chama esta rota a cada 3 segundos para atualizar a tela."""
    total = sum(VOTOS.values())
    max_votos = max(VOTOS.values()) if total > 0 else 0
    
    # Descobre quem está ganhando para o JS aplicar o destaque visual
    lideres = [k for k, v in VOTOS.items() if v == max_votos and max_votos > 0]
    
    # jsonify converte o dicionário Python em uma resposta HTTP application/json
    return jsonify({
        'votos': VOTOS,
        'lideres': lideres,
        'total': total,
        'ja_votou': session.get('ja_votou', False) # O servidor lembra do usuário!
    })

@bp.route('/api/votar', methods=['POST'])
def votar():
    """API: O JS chama esta rota quando o usuário clica em 'Votar'."""
    # 1. Validação de Sessão (Segurança no servidor)
    if session.get('ja_votou'):
        return jsonify({'sucesso': False, 'erro': 'Você já votou nesta sessão.'}), 400
        
    # 2. Lê o JSON enviado pelo JavaScript no corpo da requisição
    dados = request.get_json()
    opcao = dados.get('opcao')
    
    # 3. Validação de dados
    if opcao not in VOTOS:
        return jsonify({'sucesso': False, 'erro': 'Opção inválida.'}), 400
        
    # 4. Processa e grava na sessão
    VOTOS[opcao] += 1
    session['ja_votou'] = True
    
    return jsonify({'sucesso': True, 'mensagem': 'Voto computado com sucesso!'})
```

</details>

---

## 3. O Front-end: HTML e CSS Reativos

O HTML exibe o formulário. O CSS define as classes que o JavaScript irá adicionar e remover dinamicamente (`.lider` e `.votado`).

### 3.1 Template Base

Crie o `base.html` padrão que você já conhece, com blocos `title`, `content` e `scripts` (este último para que as páginas filhas possam injetar seus próprios arquivos JS).

<details>
<summary><strong>Ver solução — livepoll/templates/base.html</strong></summary>

```html
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}Enquete{% endblock %}</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
</head>
<body>
    <main>
        {% block content %}{% endblock %}
    </main>
    {% block scripts %}{% endblock %}
</body>
</html>
```

</details>

### 3.2 Template da Enquete

Crie `livepoll/templates/enquete/index.html` estendendo o `base.html`. O formulário deve ter:
- Três opções (python, javascript, rust) com radio buttons
- Cada opção envolta em um `div.opcao` com atributo `data-linguagem`
- Barras de progresso (`div.barra-fundo` > `div.barra-progresso`) com IDs no formato `barra-{linguagem}`
- Contadores (`span.contador`) com IDs no formato `count-{linguagem}`
- Botão de submit com id `btn-votar`
- Importar `enquete.js` no bloco `scripts` com o atributo `defer`

<details>
<summary><strong>Ver solução — livepoll/templates/enquete/index.html</strong></summary>

```html
{% extends 'base.html' %}

{% block title %}Enquete Ao Vivo{% endblock %}

{% block content %}
<h1>Qual a melhor linguagem para Web?</h1>
<p class="subtitulo">Os resultados atualizam automaticamente a cada 3 segundos.</p>

<form id="form-voto">
    {% for lang in ['python', 'javascript', 'rust'] %}
    <div class="opcao" data-linguagem="{{ lang }}">
        <label>
            <input type="radio" name="linguagem" value="{{ lang }}" required>
            <span class="nome">{{ lang.capitalize() }}</span>
        </label>
        <div class="barra-fundo">
            <div class="barra-progresso" id="barra-{{ lang }}"></div>
        </div>
        <span class="contador" id="count-{{ lang }}">0 votos</span>
    </div>
    {% endfor %}

    <button type="submit" id="btn-votar" class="btn-primary">Computar Voto</button>
</form>
{% endblock %}

{% block scripts %}
<script src="{{ url_for('static', filename='enquete.js') }}" defer></script>
{% endblock %}
```

</details>

### 3.3 CSS Reativo

O CSS define estilos base e, crucialmente, regras condicionais:
- `.opcao.lider` — borda dourada, fundo amarelado e sombra para destacar quem está ganhando
- `.lider .barra-progresso` — cor dourada na barra de progresso
- `form.votado` — trava visualmente o formulário (radios desabilitados, botão oculto, mensagem de agradecimento via `::after`)

<details>
<summary><strong>Ver solução — livepoll/static/style.css</strong></summary>

```css
body {
  font-family: system-ui, sans-serif;
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.opcao {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nome {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}
.barra-fundo {
  background: #eee;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.barra-progresso {
  background: #3498db;
  height: 100%;
  width: 0%;
  transition: width 0.5s ease-out;
}
.lider .barra-progresso {
  background: gold;
}
.contador {
  font-size: 0.9rem;
  color: #666;
}

.btn-primary {
  padding: 10px 20px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  margin-top: 1rem;
}
.btn-primary:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.feedback {
  margin-top: 1rem;
  font-weight: bold;
  min-height: 1.5rem;
  text-align: center;
}
.feedback.sucesso {
  color: #27ae60;
}
.feedback.erro {
  color: #c0392b;
}




/* CLASSLIST CONDICIONAL: O JS adiciona .lider na opção que está ganhando */
.opcao.lider {
  border-color: gold;
  background-color: #fff9e6;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

/* CLASSLIST CONDICIONAL: Quando o formulário tem a classe 'votado', trava a interface */
form.votado input[type="radio"] {
  pointer-events: none;
  opacity: 0.5;
}
form.votado .btn-primary {
  display: none;
}
form.votado::after {
  content: "Obrigado por votar! Acompanhe os resultados.";
  display: block;
  text-align: center;
  color: #666;
  margin-top: 1rem;
  font-style: italic;
}

```

</details>

---

## 4. JavaScript: O Maestro da Integração

Aqui aplicamos **Validação com `setCustomValidity()`**, **Fetch (POST e GET)**, **Interval**, **Timeout** e **ClassList Condicional**. Usaremos o encadeamento de `.then()` e `.catch()` para lidar com as Promises do `fetch`, exatamente como fizemos ao consumir as APIs do ViaCEP e do IBGE.

O arquivo `livepoll/static/enquete.js` deve implementar:

1. **Submit do formulário com fetch POST:**
   - Validar que alguma opção foi selecionada usando `setCustomValidity()` (API nativa do HTML5)
   - Se inválido, chamar `reportValidity()` para exibir a mensagem do navegador
   - Desabilitar o botão e mudar texto para "Enviando..."
   - Enviar POST para `/api/votar` com `Content-Type: application/json` e `body: JSON.stringify({ opcao: valor })`
   - No `.then()`: se `dados.sucesso`, adicionar classe `votado` ao form; senão, usar `setCustomValidity()` novamente para exibir erro
   - No `.catch()`: exibir erro de conexão via `setCustomValidity()`
   - Em ambos os casos, reabilitar o botão

2. **Função `atualizarPlacar()`:**
   - Fetch GET para `/api/status`
   - Iterar sobre `dados.votos` com `Object.entries()`
   - Calcular porcentagem e atualizar `style.width` da barra e `textContent` do contador
   - Adicionar/remover classe `lider` nos `div.opcao` baseado em `dados.lideres`
   - Adicionar classe `votado` ao form se `dados.ja_votou` for true

3. **Ciclo de atualização:**
   - `setInterval(atualizarPlacar, 3000)` para atualizar a cada 3 segundos
   - Chamar `atualizarPlacar()` imediatamente ao carregar a página

<details>
<summary><strong>Ver solução — livepoll/static/enquete.js</strong></summary>

```javascript
// Elementos do DOM
const formVoto = document.getElementById('form-voto');
const btnVotar = document.getElementById('btn-votar');
const primeiroRadio = document.querySelector('input[name="linguagem"]');

// ==========================================
// 1. VALIDAÇÃO COM setCustomValidity() E FETCH (POST)
// ==========================================
formVoto.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o recarregamento da página (comportamento padrão do HTML)
    
    // Validação no cliente usando setCustomValidity (API nativa do HTML5)
    const selecionado = document.querySelector('input[name="linguagem"]:checked');
    if (!selecionado) {
        primeiroRadio.setCustomValidity('Por favor, selecione uma opção antes de votar.');
        primeiroRadio.reportValidity(); // Exibe a mensagem de erro do navegador
        return;
    }
    
    // Limpa qualquer erro de validação anterior
    primeiroRadio.setCustomValidity('');

    // Feedback visual de carregamento
    btnVotar.disabled = true;
    btnVotar.textContent = "Enviando...";

    // FETCH POST: Envia o voto para a API do Flask
    fetch('/api/votar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Avisa o Flask que estamos mandando JSON
        body: JSON.stringify({ opcao: selecionado.value })
    })
    .then(resposta => resposta.json())
    .then(dados => {
        if (dados.sucesso) {
            // CLASSLIST CONDICIONAL: Trava o formulário visualmente
            formVoto.classList.add('votado');
        } else {
            // Usa setCustomValidity para exibir erro do servidor
            primeiroRadio.setCustomValidity(dados.erro);
            primeiroRadio.reportValidity();
        }
        // Reabilita o botão após o sucesso
        btnVotar.disabled = false;
        btnVotar.textContent = "Computar Voto";
    })
    .catch(erro => {
        // Usa setCustomValidity para exibir erro de conexão
        primeiroRadio.setCustomValidity('Erro de conexão com o servidor.');
        primeiroRadio.reportValidity();
        // Reabilita o botão em caso de falha na rede
        btnVotar.disabled = false;
        btnVotar.textContent = "Computar Voto";
    });
});

// ==========================================
// 2. FETCH (GET) E ATUALIZAÇÃO DO DOM
// ==========================================
function atualizarPlacar() {
    // FETCH GET: Busca o estado atual do servidor
    fetch('/api/status')
        .then(resposta => resposta.json())
        .then(dados => {
            const total = dados.total > 0 ? dados.total : 1; // Evita divisão por zero
            
            // Itera sobre os votos retornados pelo Flask
            for(let [linguagem, votos] of Object.entries(dados.votos)) {
                const porcentagem = (votos / total) * 100;
                
                // Atualiza a largura da barra e o texto do contador
                document.getElementById(`barra-${linguagem}`).style.width = `${porcentagem}%`;
                document.getElementById(`count-${linguagem}`).textContent = `${votos} votos`;
                
                // CLASSLIST CONDICIONAL: Destaca quem está ganhando
                const divOpcao = document.querySelector(`.opcao[data-linguagem="${linguagem}"]`);
                if (dados.lideres.includes(linguagem)) {
                    divOpcao.classList.add('lider');
                } else {
                    divOpcao.classList.remove('lider');
                }
            }

            // Sincroniza a trava do formulário baseada na Sessão do Flask
            if (dados.ja_votou) {
                formVoto.classList.add('votado');
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar placar:", erro);
        });
}

// ==========================================
// 3. INTERVAL
// ==========================================

// INTERVAL: Inicia o ciclo de atualização a cada 3 segundos (3000ms)
setInterval(atualizarPlacar, 3000);

// Busca o estado inicial imediatamente ao carregar a página
atualizarPlacar();
```

</details>

---

## 5. Executando e Testando

1. No terminal, na raiz do projeto (onde está a pasta `livepoll/`), inicie o servidor:
   ```bash
   flask --app livepoll run --debug
   ```
2. Abra o navegador em `http://127.0.0.1:5000/`.
3. **O Teste da Validação:** Tente clicar em "Computar Voto" sem selecionar nenhuma opção. O navegador exibirá a mensagem "Por favor, selecione uma opção antes de votar." (via `setCustomValidity()`).
4. **O Teste da Sessão:** Selecione uma opção e vote. Note que o botão desaparece e os radios ficam cinzas (o JS adicionou a classe `.votado`).
5. **O Teste do Tempo Real:** Abra a **mesma URL** em uma **aba anônima** (ou no seu celular). Vote em outra opção.
6. Volte para a primeira aba. Em até 3 segundos, você verá a barra de progresso da outra opção crescer e, se ela ultrapassar a sua, a borda da caixa ficará dourada (`.lider`) automaticamente, sem você dar F5.

---

## 6. Pontos de Discussão Didática

| Conceito | Onde está no código? | Por que é importante? |
| :--- | :--- | :--- |
| **Separação de Responsabilidades** | Flask retorna JSON (`/api/status`), não HTML. | O servidor não gasta processamento renderizando Jinja2 a cada 3 segundos. Ele apenas entrega números. O JS monta a interface. |
| **Validação Nativa** | `setCustomValidity()` e `reportValidity()` | Usa a API padrão do HTML5 em vez de criar soluções customizadas. O navegador exibe as mensagens de erro de forma consistente. |
| **Sessão vs Interface** | `session['ja_votou']` no Flask e `formVoto.classList.add('votado')` no JS. | A interface trava visualmente (UX), mas a **verdadeira segurança** está no Flask checando a sessão antes de aceitar o POST. O JS sozinho pode ser burlado; a sessão no servidor não. |
| **`setInterval`** | `setInterval(atualizarPlacar, 3000)` | Simula o conceito de *WebSockets* ou *Server-Sent Events* de forma simples (chamado de *Polling*). |
| **`classList` Condicional** | Adicionar/remover `.lider` e `.votado`. | Permite que o CSS cuide da estética (cores, sombras, animações), enquanto o JS cuida apenas da lógica de *quando* aplicar essas classes. |

Este exemplo é o "Hello World" das **Single Page Applications (SPAs)** e dashboards interativos. Você agora possui todas as peças para construir aplicações web completas, onde o HTML é a estrutura, o CSS é a roupa, o JS é o sistema nervoso e o Flask é o cérebro.