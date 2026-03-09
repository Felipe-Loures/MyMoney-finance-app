// -------------------------------
// Funções de armazenamento
// -------------------------------

// Obter dados do localStorage
const obterDados = () => JSON.parse(localStorage.getItem('mymoney_data')) || [];

// Salvar dados no localStorage
const salvarDados = (dados) => localStorage.setItem('mymoney_data', JSON.stringify(dados));

// Formatar valor em BRL
const brl = (v) => v.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

// -------------------------------
// Atualização da tela principal (HOME)
// -------------------------------
function renderHome() {
    const saldoTxt = document.getElementById('resumo-saldo');
    const receitaTxt = document.getElementById('resumo-receitas');
    const despesaTxt = document.getElementById('resumo-despesas');

    if (!saldoTxt) return; // Só roda na index.html ou telas com esses IDs

    const transacoes = obterDados();

    const totalReceitas = transacoes
        .filter(t => t.tipo === 'receita')
        .reduce((acc, t) => acc + t.valor, 0);

    const totalDespesas = transacoes
        .filter(t => t.tipo === 'despesa')
        .reduce((acc, t) => acc + t.valor, 0);

    const saldoTotal = totalReceitas - totalDespesas;

    // Atualiza cards
    receitaTxt.innerText = brl(totalReceitas);
    despesaTxt.innerText = brl(totalDespesas);
    saldoTxt.innerText = brl(saldoTotal);

    // Cor do saldo: azul para positivo, vermelho para negativo
    saldoTxt.className = `fw-extrabold m-0 ${saldoTotal >= 0 ? 'text-primary' : 'text-danger'}`;
}

// -------------------------------
// Atualização da tabela/lista (HISTÓRICO)
// -------------------------------
function renderHistorico() {
    const lista = document.getElementById('lista-completa');
    if (!lista) return; // Só roda na historico.html

    const transacoes = obterDados();

    if (transacoes.length === 0) {
        lista.innerHTML = '<p class="text-center text-muted">Nenhuma transação encontrada.</p>';
        return;
    }

    lista.innerHTML = transacoes.map((t, i) => `
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-2">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                    <div class="rounded-3 ${t.tipo === 'receita' ? 'bg-success' : 'bg-danger'} bg-opacity-10 ${t.tipo === 'receita' ? 'text-success' : 'text-danger'} d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                        <i class="bi ${t.tipo === 'receita' ? 'bi-arrow-up-right' : 'bi-arrow-down-left'} fs-5"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.95rem;">${t.desc || 'Sem descrição'}</h6>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge bg-light text-muted fw-normal border" style="font-size: 0.65rem;">${t.cat}</span>
                            <small class="text-muted" style="font-size: 0.8rem;">${t.data}</small>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="fw-bold ${t.tipo === 'receita' ? 'text-success' : 'text-danger'}" style="font-size: 1.05rem;">
                        ${t.tipo === 'receita' ? '+' : '-'} ${brl(t.valor)}
                    </span>
                    <button class="btn p-0 border-0" onclick="excluir(${i})">
                        <i class="bi bi-trash text-muted"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// -------------------------------
// Captura do formulário com Validação de Saldo
// -------------------------------
const form = document.getElementById('transacao-form');
if (form) {
    form.onsubmit = (e) => {
        e.preventDefault();

        const valorInput = document.getElementById('input-valor');
        const tipoInput = document.getElementById('input-tipo');
        const catInput = document.getElementById('input-categoria');
        const descInput = document.getElementById('input-descricao');

        if (!tipoInput.value) {
            alert("Por favor, selecione se é Ganho ou Gasto!");
            return;
        }

        const valorNovo = parseFloat(valorInput.value);
        const listaAtual = obterDados();

        // --- VALIDAÇÃO DE SALDO ---
        if (tipoInput.value === 'despesa') {
            const totalReceitas = listaAtual
                .filter(t => t.tipo === 'receita')
                .reduce((acc, t) => acc + t.valor, 0);

            const totalDespesas = listaAtual
                .filter(t => t.tipo === 'despesa')
                .reduce((acc, t) => acc + t.valor, 0);

            const saldoDisponivel = totalReceitas - totalDespesas;

            if (valorNovo > saldoDisponivel) {
                alert(`Operação negada! Saldo insuficiente.\nSaldo atual: ${brl(saldoDisponivel)}`);
                return; // Impede o salvamento
            }
        }

        const novaTransacao = {
            tipo: tipoInput.value,
            cat: catInput.value,
            valor: valorNovo,
            desc: descInput.value,
            data: new Date().toLocaleDateString('pt-br')
        };

        listaAtual.unshift(novaTransacao);
        salvarDados(listaAtual);

        form.reset();
        renderHome();
        alert("✅ Lançamento gravado com sucesso!");
        
        // Se estiver na tela de "Nova Transação", volta para a home
        if(window.location.pathname.includes('nova-transacao.html')) {
            window.location.href = 'index.html';
        }
    };
}

// -------------------------------
// Funções globais
// -------------------------------
window.excluir = (i) => {
    if(confirm("Deseja realmente excluir este registro?")) {
        const lista = obterDados();
        lista.splice(i, 1);
        salvarDados(lista);
        renderHistorico();
        renderHome();
    }
};

window.limparTudo = () => {
    if(confirm("Atenção: Isso apagará TODOS os seus dados. Continuar?")) {
        localStorage.removeItem('mymoney_data');
        renderHistorico();
        renderHome();
    }
};

// -------------------------------
// Inicialização
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Lógica da Navbar Ativa
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';

    navLinks.forEach(link => {
        if(link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    renderHome();
    renderHistorico();
});