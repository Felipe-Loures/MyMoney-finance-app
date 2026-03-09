const obterDados = () => JSON.parse(localStorage.getItem('mymoney_data')) || [];
const salvarDados = (dados) => localStorage.setItem('mymoney_data', JSON.stringify(dados));
const brl = v => v.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

// Mapeamento categorias -> Bootstrap Icons
const iconesCategoria = {
  'Salário': 'bi-briefcase-fill',
  'Extra': 'bi-star-fill',
  'Alimentação': 'bi-cup-fill',
  'Moradia': 'bi-house-fill',
  'Lazer': 'bi-emoji-smile-fill',
  'Transporte': 'bi-car-front-fill'
};

function renderHistorico() {
  const container = document.getElementById('lista-completa');
  if (!container) return;

  const transacoes = obterDados();
  if (transacoes.length === 0) {
    container.innerHTML = `
          <div class="empty-state">
            <i class="bi bi-wallet2" style="font-size: 4rem; opacity: 0.3"></i>
            <h5 class="mt-3">Sua carteira está silenciosa...</h5>
            <p>Adicione transações na tela inicial para vê-las aqui.</p>
          </div>`;
    return;
  }

  container.innerHTML = transacoes.map((t, i) => {
    const isReceita = t.tipo === 'receita';
    const iconeClass = iconesCategoria[t.cat] || 'bi-question-circle';
    return `
        <div class="col">
          <div class="transacao-card ${isReceita ? 'card-receita' : 'card-despesa'}">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="categoria-pill">
                <i class="bi ${iconeClass} ${isReceita ? 'text-success' : 'text-danger'}"></i>
                ${t.cat}
              </span>
              <div class="text-end">
                <span class="data-texto">${t.data}</span>
              </div>
            </div>

            <div class="valor-display ${isReceita ? 'valor-receita' : 'valor-despesa'}">
              ${isReceita ? '+' : '-'} ${brl(t.valor)}
            </div>

            <div class="desc-texto">
              ${t.desc || '<span class="opacity-50">Sem descrição adicional</span>'}
            </div>

            <div class="mt-auto d-flex justify-content-end border-top pt-3">
              <button class="btn-delete-modern" onclick="excluir(${i})" title="Excluir">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </div>
          </div>
        </div>
        `;
  }).reverse().join('');
}

window.excluir = i => {
  if (confirm('Deseja realmente excluir este registro?')) {
    const lista = obterDados();
    lista.splice(i, 1);
    salvarDados(lista);
    renderHistorico();
  }
};

window.limparTudo = () => {
  if (confirm('ATENÇÃO: Isso apagará todos os seus registros permanentemente. Confirmar?')) {
    localStorage.removeItem('mymoney_data');
    renderHistorico();
  }
};

document.addEventListener('DOMContentLoaded', renderHistorico);


