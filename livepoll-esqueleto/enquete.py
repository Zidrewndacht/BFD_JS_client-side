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