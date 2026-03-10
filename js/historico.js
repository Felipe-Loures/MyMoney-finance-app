// --- HISTORY RENDERER ---
const buildTab = (list, filter) => {
  const container = document.getElementById('lista-' + filter);
  if (!container) return;

  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = `<div class="text-vazio">Nenhuma transação 😔</div>`;
    return;
  }

  const styles = {
    receita: { symbol: '+', color: 'success', icon: 'bi-arrow-up-right' },
    despesa: { symbol: '-', color: 'danger', icon: 'bi-arrow-down-left' },
    cofrinho: { symbol: '', color: 'primary', icon: 'bi-piggy-bank' }
  };

  list.forEach((t, i) => {
    const { symbol, color, icon } = styles[t.tipo] || styles.receita;
    container.insertAdjacentHTML('beforeend', `
      <div class="card transaction-card border-0 shadow-sm rounded-4 p-3 bg-white mb-1">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-3 overflow-hidden">
            <div class="icon-box bg-${color} bg-opacity-10 text-${color}">
              <i class="bi ${icon} fs-5"></i>
            </div>
            <div class="overflow-hidden">
              <h6 class="fw-bold mb-0 text-dark texto-descricao">${t.desc || 'Sem descrição'}</h6>
              <span class="badge bg-light text-muted fw-normal border">${t.cat}</span>
            </div>
          </div>
          <div class="d-flex align-items-center gap-3">
            <span class="fw-bold text-${color}">${symbol}${brl(t.valor)}</span>
            <button class="btn p-0 border-0" onclick="deleteItem(${i})">
              <i class="bi bi-trash text-muted"></i>
            </button>
          </div>
        </div>
      </div>
    `);
  });
};

// --- ACTIONS ---
window.deleteItem = (index) => {
  if (confirm("Deseja excluir esta transação?")) {
    const list = getData();
    list.splice(index, 1);
    saveData(list);
    
    renderHistory();
    if (typeof renderHome === "function") renderHome(); // Atualiza dashboard se estiver na mesma página
  }
};

// --- CONTROLLER ---
function renderHistory() {
  const list = getData();
  buildTab(list, 'todos');
  buildTab(list.filter(t => t.tipo === 'receita'), 'ganhos');
  buildTab(list.filter(t => t.tipo === 'despesa'), 'gastos');
  buildTab(list.filter(t => t.tipo === 'cofrinho'), 'cofrinhos');
}

document.addEventListener('DOMContentLoaded', renderHistory);