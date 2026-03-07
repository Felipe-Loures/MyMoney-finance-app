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

    if (!saldoTxt) return; // Só roda na index.html

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
    saldoTxt.className = `fw-bold mb-0 ${saldoTotal >= 0 ? 'text-primary' : 'text-danger'}`;
}

// -------------------------------
// Atualização da tabela (HISTÓRICO)
// -------------------------------
function renderHistorico() {
    const tabela = document.getElementById('lista-completa');
    if (!tabela) return; // Só roda na historico.html

    const transacoes = obterDados();

    tabela.innerHTML = transacoes.map((t, i) => `
        <tr>
            <td data-label="DATA">${t.data}</td>
            <td data-label="TIPO">${t.tipo === 'receita' ? '💰 Ganho' : '💸 Gasto'}</td>
            <td data-label="CATEGORIA">${t.cat}</td>
            <td data-label="DESCRIÇÃO">${t.desc || '-'}</td>
            <td data-label="VALOR" class="text-end fw-bold ${t.tipo === 'receita' ? 'text-success' : 'text-danger'}">
                ${t.tipo === 'receita' ? '+' : '-'} ${brl(t.valor)}
            </td>
            <td class="text-center">
                <button class="btn btn-sm btn-light text-danger" onclick="excluir(${i})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// -------------------------------
// Captura do formulário
// -------------------------------
const form = document.getElementById('transacao-form');
if (form) {
    form.onsubmit = (e) => {
        e.preventDefault();

        const valorInput = document.getElementById('input-valor');
        const tipoInput = document.getElementById('input-tipo'); // novo campo para Ganho/Gasto
        const catInput = document.getElementById('input-categoria');
        const descInput = document.getElementById('input-descricao');

        if (!tipoInput.value) {
            alert("Selecione se é Ganho ou Gasto!");
            return;
        }

        const novaTransacao = {
            tipo: tipoInput.value, // receita ou despesa
            cat: catInput.value,
            valor: parseFloat(valorInput.value),
            desc: descInput.value,
            data: new Date().toLocaleDateString('pt-br')
        };

        const lista = obterDados();
        lista.unshift(novaTransacao);
        salvarDados(lista);

        form.reset();
        renderHome();
        alert("Lançamento gravado!");
    };
}

// -------------------------------
// Funções globais
// -------------------------------
window.excluir = (i) => {
    const lista = obterDados();
    lista.splice(i, 1);
    salvarDados(lista);
    renderHistorico();
    renderHome();
};

window.limparTudo = () => {
    if(confirm("Apagar tudo?")) {
        localStorage.removeItem('mymoney_data');
        renderHistorico();
        renderHome();
    }
};

// -------------------------------
// Navbar dinâmica: ativa
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Navbar ativa baseada na URL
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPath = window.location.pathname.split("/").pop(); // ex: index.html

    navLinks.forEach(link => {
        link.classList.remove('active'); // limpa todas
        if(link.getAttribute('href') === currentPath) {
            link.classList.add('active'); // ativa o link correto
        }

        // também muda dinamicamente ao clicar
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Renderiza a home e histórico automaticamente
    renderHome();
    renderHistorico();
});