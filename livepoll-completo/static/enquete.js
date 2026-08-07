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
    })
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