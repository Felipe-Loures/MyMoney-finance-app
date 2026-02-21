// Capturar dados de formulários
const transacaoForm = document.getElementById('transacao-form');
const inputValor = document.getElementById('input-valor');
const inputCategoria = document.getElementById('input-categoria');
const inputDescricao = document.getElementById('input-descricao');

// Elementos de exibição de valores
const resumoReceitas = document.getElementById('resumo-receitas');
const resumoDespesas = document.getElementById('resumo-despesas');
const resumoSaldo = document.getElementById('resumo-saldo');

// Elementos do Histórico
const listaDesktop = document.getElementById('lista-transacoes-desktop');
const listaMobile = document.getElementById('lista-transacoes-mobile');
const historicoVazio = document.getElementById('historico-vazio');
const containerDesktop = document.getElementById('container-desktop');
const contadorItens = document.getElementById('contador-itens');

let transacoes = [];

// Função para Adicionar Transação
transacaoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const [tipo, categoriaNome] = inputCategoria.value.split('|');
    const valor = parseFloat(inputValor.value);

    const novaTransacao = {
        id: Date.now(),
        tipo: tipo,
        categoria: categoriaNome,
        descricao: inputDescricao.value || '---',
        valor: valor
    };

    const receitas = transacoes
        .filter(t => t.tipo === 'receita')
        .reduce((acc, t) => acc + t.valor, 0);

    const despesas = transacoes
        .filter(t => t.tipo === 'despesa')
        .reduce((acc, t) => acc + t.valor, 0);

    const saldoAtual = receitas - despesas;

    
    if (tipo === 'despesa' && valor > saldoAtual) {
        alert('Saldo insuficiente para realizar essa despesa.');
        return; 
    }

    transacoes.push(novaTransacao);

    transacaoForm.reset();
    atualizarInterface();
});

function excluirTransacao(id) {
    transacoes = transacoes.filter(t => t.id !== id);
    atualizarInterface();
}

// 5. Função de Atualização Geral da UI
function atualizarInterface() {
    renderizarTabelas();
    calcularResumos();
}

function renderizarTabelas() {
    listaDesktop.innerHTML = '';
    listaMobile.innerHTML = '';

    if (transacoes.length === 0) {
        historicoVazio.classList.remove('d-none'); // Mostra a div de vazio
        containerDesktop.classList.add('d-none');   // Esconde a tabela desktop
        contadorItens.innerText = '0';              // Zera o contador visual
        return; // Para a execução aqui, pois não há o que renderizar.
    }

    // 3. Preparação do Layout:
    // Se chegou aqui, há dados. Então escondemos o "Vazio" e mostramos a tabela.
    historicoVazio.classList.add('d-none');
    containerDesktop.classList.remove('d-none');
    contadorItens.innerText = transacoes.length;

    [...transacoes].reverse().forEach(t => {

        const isReceita = t.tipo === 'receita';
        const cor = isReceita ? 'success' : 'danger';
        const icone = isReceita ? 'bi-arrow-up' : 'bi-arrow-down';
        const sinal = isReceita ? '' : '- ';

        // --- CONSTRUÇÃO DO DESKTOP (Linha da Tabela) ---
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="ps-3">
                <div class=" d-none d-md-table-cell  align-items-center">
                    <div class=" bg-${cor} bg-opacity-10 p-2 rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                        <i class="bi ${icone} text-${cor}"></i>
                    </div>
                    <span class=" d-none d-md-table-cell  fw-bold text-dark">${t.categoria}</span>
                </div>
            </td>
            <td class=" d-none d-md-table-cell text-muted small">${t.descricao}</td>
            <td class=" d-none d-md-table-cell  text-end fw-bold text-${cor}">${sinal}${formatarMoeda(t.valor)}</td>
            <td class="text-end pe-3">
                <button class=" d-none d-md-table-cell  btn btn-sm btn-outline-danger border-0" onclick="excluirTransacao(${t.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        listaDesktop.appendChild(tr);

        // --- CONSTRUÇÃO DO MOBILE (Cards empilhados) ---
        const divMob = document.createElement('div');
        divMob.className = 'border-bottom py-3'; // Linha divisória entre cada card mobile
        divMob.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="bg-${cor} bg-opacity-10 p-2 rounded-3 me-3">
                        <i class="bi ${icone} text-${cor}"></i>
                    </div>
                    <div>
                        <h6 class="mb-0 fw-bold">${t.categoria}</h6>
                        <small class="text-muted">${t.descricao}</small>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold text-${cor}">${sinal}${formatarMoeda(t.valor)}</div>
                    <button class="btn btn-sm text-danger p-0 border-0" onclick="excluirTransacao(${t.id})">Excluir</button>
                </div>
            </div>
        `;
        listaMobile.appendChild(divMob);
    });
}

function calcularResumos() {
    const receitas = transacoes
        .filter(t => t.tipo === 'receita')
        .reduce((acc, t) => acc + t.valor, 0);

    const despesas = transacoes
        .filter(t => t.tipo === 'despesa')
        .reduce((acc, t) => acc + t.valor, 0);

    const saldo = receitas - despesas;

    resumoReceitas.innerText = formatarMoeda(receitas);
    resumoDespesas.innerText = formatarMoeda(despesas);
    resumoSaldo.innerText = formatarMoeda(saldo);

    resumoSaldo.classList.remove('text-primary', 'text-danger');
    resumoSaldo.classList.add(saldo < 0 ? 'text-danger' : 'text-primary');
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}