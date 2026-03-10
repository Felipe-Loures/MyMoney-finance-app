// -------------------------------
// Renderiza histórico em tabs
// -------------------------------
const montarTab = (lista, filtro) => {
    const container = document.getElementById('lista-' + filtro);
    if (!container) return;

    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = `<div class="text-vazio">Nenhuma transação 😔</div>`;
        return;
    }

    lista.forEach((t, i) => {
        const sinal = t.tipo === 'receita' ? '+' : t.tipo === 'despesa' ? '-' : '';
        const cor = t.tipo === 'receita' ? 'success' : t.tipo === 'despesa' ? 'danger' : 'primary';
        const icone = t.tipo === 'receita' ? 'bi-arrow-up-right' : t.tipo === 'despesa' ? 'bi-arrow-down-left' : 'bi-piggy-bank';

        container.insertAdjacentHTML('beforeend', `
            <div class="card transaction-card border-0 shadow-sm rounded-4 p-3 bg-white mb-1">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3 overflow-hidden">
                        <div class="icon-box bg-${cor} bg-opacity-10 text-${cor}">
                            <i class="bi ${icone} fs-5"></i>
                        </div>
                        <div class="overflow-hidden">
                            <h6 class="fw-bold mb-0 text-dark texto-descricao" style="font-size:0.95rem;">
                                ${t.desc || 'Sem descrição'}
                            </h6>
                            <span class="badge bg-light text-muted fw-normal border" style="font-size:0.65rem;">
                                ${t.cat}
                            </span>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <span class="fw-bold text-${cor}" style="font-size:1.05rem; display:flex; align-items:center; gap:0.2rem;">
                            <span>${sinal}</span><span>${brl(t.valor)}</span>
                        </span>
                        <button class="btn p-0 border-0" onclick="excluir(${i})">
                            <i class="bi bi-trash text-muted"></i>
                        </button>
                    </div>
                </div>
            </div>
        `);
    });
};

// Excluir transação
window.excluir = i => {
    if (confirm("Deseja excluir esta transação?")) {
        const lista = JSON.parse(localStorage.getItem('mymoney_data')) || [];
        lista.splice(i, 1);
        localStorage.setItem('mymoney_data', JSON.stringify(lista));
        renderHistorico();
        if (typeof renderHome === "function") renderHome();
    }
};

// Renderiza todas as tabs
function renderHistorico() {
    const lista = JSON.parse(localStorage.getItem('mymoney_data')) || [];
    montarTab(lista, 'todos');
    montarTab(lista.filter(t => t.tipo === 'receita'), 'ganhos');
    montarTab(lista.filter(t => t.tipo === 'despesa'), 'gastos');
    montarTab(lista.filter(t => t.tipo === 'cofrinho'), 'cofrinhos');
}

document.addEventListener('DOMContentLoaded', renderHistorico);