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

Não se esqueça de registrar o blueprint e configurar a `secret_key` na sua factory (`livepoll/__init__.py`):

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

---

## 3. O Front-end: HTML e CSS Reativos

O HTML exibe o formulário. O CSS define as classes que o JavaScript irá adicionar e remover dinamicamente (`.lider` e `.votado`).

**`livepoll/templates/base.html`**
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

**`livepoll/templates/enquete/index.html`**
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
    <p id="mensagem-feedback" class="feedback"></p>
</form>
{% endblock %}

{% block scripts %}
<script src="{{ url_for('static', filename='enquete.js') }}" defer></script>
{% endblock %}
```

**`livepoll/static/style.css`**
```css
body { font-family: system-ui, sans-serif; max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
.opcao { margin-bottom: 1.5rem; padding: 1rem; border: 2px solid #ccc; border-radius: 8px; transition: all 0.3s ease; }

/* CLASSLIST CONDICIONAL: O JS adiciona .lider na opção que está ganhando */
.opcao.lider { border-color: gold; background-color: #fff9e6; box-shadow: 0 0 15px rgba(255, 215, 0, 0.4); }

.nome { font-weight: bold; display: block; margin-bottom: 0.5rem; text-transform: capitalize; }
.barra-fundo { background: #eee; height: 20px; border-radius: 10px; overflow: hidden; margin-bottom: 0.5rem; }
.barra-progresso { background: #3498db; height: 100%; width: 0%; transition: width 0.5s ease-out; }
.lider .barra-progresso { background: gold; }
.contador { font-size: 0.9rem; color: #666; }

.btn-primary { padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; width: 100%; margin-top: 1rem; }
.btn-primary:disabled { background: #95a5a6; cursor: not-allowed; }

.feedback { margin-top: 1rem; font-weight: bold; min-height: 1.5rem; text-align: center; }
.feedback.sucesso { color: #27ae60; }
.feedback.erro { color: #c0392b; }

/* CLASSLIST CONDICIONAL: Quando o formulário tem a classe 'votado', trava a interface */
form.votado input[type="radio"] { pointer-events: none; opacity: 0.5; }
form.votado .btn-primary { display: none; }
form.votado::after { content: "Obrigado por votar! Acompanhe os resultados."; display: block; text-align: center; color: #666; margin-top: 1rem; font-style: italic; }
```

---

## 4. O JavaScript: O Maestro da Integração

Aqui aplicamos **Validação**, **Fetch (POST e GET)**, **Interval**, **Timeout** e **ClassList Condicional**. Usaremos a sintaxe moderna `async/await` para lidar com as Promises do `fetch` de forma limpa.

**`livepoll/static/enquete.js`**
```javascript
// Elementos do DOM
const formVoto = document.getElementById('form-voto');
const btnVotar = document.getElementById('btn-votar');
const msgFeedback = document.getElementById('mensagem-feedback');

// ==========================================
// 1. VALIDAÇÃO E FETCH (POST)
// ==========================================
formVoto.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o recarregamento da página (comportamento padrão do HTML)
    
    // Validação no cliente
    const selecionado = document.querySelector('input[name="linguagem"]:checked');
    if (!selecionado) {
        exibirFeedback('Por favor, selecione uma opção antes de votar.', 'erro');
        return;
    }

    // Feedback visual de carregamento
    btnVotar.disabled = true;
    btnVotar.textContent = "Enviando...";

    try {
        // FETCH POST: Envia o voto para a API do Flask
        const resposta = await fetch('/api/votar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Avisa o Flask que estamos mandando JSON
            body: JSON.stringify({ opcao: selecionado.value })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            exibirFeedback(dados.mensagem, 'sucesso');
            // CLASSLIST CONDICIONAL: Trava o formulário visualmente
            formVoto.classList.add('votado'); 
        } else {
            exibirFeedback(dados.erro, 'erro');
        }
    } catch (erro) {
        exibirFeedback('Erro de conexão com o servidor.', 'erro');
    } finally {
        btnVotar.disabled = false;
        btnVotar.textContent = "Computar Voto";
    }
});

// ==========================================
// 2. FETCH (GET) E ATUALIZAÇÃO DO DOM
// ==========================================
async function atualizarPlacar() {
    try {
        // FETCH GET: Busca o estado atual do servidor
        const resposta = await fetch('/api/status');
        const dados = await resposta.json();
        
        const total = dados.total > 0 ? dados.total : 1; // Evita divisão por zero
        
        // Itera sobre os votos retornados pelo Flask
        for (const [linguagem, votos] of Object.entries(dados.votos)) {
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

    } catch (erro) {
        console.error("Erro ao buscar placar:", erro);
    }
}

// ==========================================
// 3. TIMEOUT E INTERVAL
// ==========================================

// Função auxiliar com TIMEOUT para limpar mensagens de feedback
function exibirFeedback(texto, tipo) {
    msgFeedback.textContent = texto;
    msgFeedback.className = `feedback ${tipo}`; // Classlist condicional (cor verde ou vermelha)
    
    // TIMEOUT: Limpa a mensagem após 4 segundos
    setTimeout(() => {
        msgFeedback.textContent = '';
        msgFeedback.className = 'feedback';
    }, 4000);
}

// INTERVAL: Inicia o ciclo de atualização a cada 3 segundos (3000ms)
setInterval(atualizarPlacar, 3000);

// Busca o estado inicial imediatamente ao carregar a página
atualizarPlacar();
```

---

## 5. Executando e Testando

1. No terminal, na raiz do projeto (onde está a pasta `livepoll/`), inicie o servidor:
   ```bash
   flask --app livepoll run --debug
   ```
2. Abra o navegador em `http://127.0.0.1:5000/`.
3. **O Teste da Sessão:** Vote em uma opção. Note que o botão desaparece e os radios ficam cinzas (o JS adicionou a classe `.votado`).
4. **O Teste do Tempo Real:** Abra a **mesma URL** em uma **aba anônima** (ou no seu celular). Vote em outra opção.
5. Volte para a primeira aba. Em até 3 segundos, você verá a barra de progresso da outra opção crescer e, se ela ultrapassar a sua, a borda da caixa ficará dourada (`.lider`) automaticamente, sem você dar F5.

---

## 6. Pontos de Discussão Didática

| Conceito | Onde está no código? | Por que é importante? |
| :--- | :--- | :--- |
| **Separação de Responsabilidades** | Flask retorna JSON (`/api/status`), não HTML. | O servidor não gasta processamento renderizando Jinja2 a cada 3 segundos. Ele apenas entrega números. O JS monta a interface. |
| **Sessão vs Interface** | `session['ja_votou']` no Flask e `formVoto.classList.add('votado')` no JS. | A interface trava visualmente (UX), mas a **verdadeira segurança** está no Flask checando a sessão antes de aceitar o POST. O JS sozinho pode ser burlado; a sessão no servidor não. |
| **`setInterval`** | `setInterval(atualizarPlacar, 3000)` | Simula o conceito de *WebSockets* ou *Server-Sent Events* de forma simples (chamado de *Polling*). |
| **`setTimeout`** | Limpeza da mensagem de feedback. | Melhora a UX, evitando que a tela fique poluída com mensagens antigas. |
| **`classList` Condicional** | Adicionar/remover `.lider` e `.votado`. | Permite que o CSS cuide da estética (cores, sombras, animações), enquanto o JS cuida apenas da lógica de *quando* aplicar essas classes. |

Este exemplo é o "Hello World" das **Single Page Applications (SPAs)** e dashboards interativos. Você agora possui todas as peças para construir aplicações web completas, onde o HTML é a estrutura, o CSS é a roupa, o JS é o sistema nervoso e o Flask é o cérebro.