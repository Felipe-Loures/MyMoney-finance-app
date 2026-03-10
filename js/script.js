// -------------------------------
// Funções de armazenamento
// -------------------------------
const obterDados = () => JSON.parse(localStorage.getItem("mymoney_data")) || [];
const salvarDados = (dados) =>
  localStorage.setItem("mymoney_data", JSON.stringify(dados));

// Formatador de moeda (BRL)
const brl = (v) =>
  v.toLocaleString("pt-br", { style: "currency", currency: "BRL" });

// -------------------------------
// Atualiza o Dashboard
// -------------------------------
function renderHome() {
  const saldoTxt = document.getElementById("resumo-saldo");
  const receitaTxt = document.getElementById("resumo-receitas");
  const despesaTxt = document.getElementById("resumo-despesas");
  const cofrinhosTxt = document.getElementById("resumo-cofrinhos");

  if (!saldoTxt) return;

  const transacoes = obterDados();

  // Cálculos por tipo
  const totalReceitas = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((a, t) => a + t.valor, 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((a, t) => a + t.valor, 0);

  const totalCofrinhos = transacoes
    .filter((t) => t.tipo === "cofrinho")
    .reduce((a, t) => a + t.valor, 0);

  // Lógica: O saldo disponível é o que sobra após despesas E o que foi guardado
  const saldoDisponivel = totalReceitas - totalDespesas - totalCofrinhos;

  // Atualização da Interface
  receitaTxt.innerText = brl(totalReceitas);
  despesaTxt.innerText = brl(totalDespesas);
  cofrinhosTxt.innerText = brl(totalCofrinhos);
  saldoTxt.innerText = brl(saldoDisponivel);

  // Estilização do saldo (Verde se positivo, Vermelho se negativo)
  saldoTxt.className = `fw-extrabold m-0 ${
    saldoDisponivel >= 0 ? "text-primary" : "text-danger"
  }`;
}

// -------------------------------
// Adiciona nova transação
// -------------------------------
const form = document.getElementById("transacao-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valor = parseFloat(document.getElementById("input-valor").value);
    const tipo = document.getElementById("input-tipo").value;
    const categoria = document.getElementById("input-categoria").value;
    const descricao = document.getElementById("input-descricao").value;

    if (!tipo) {
      alert("Por favor, selecione o tipo da transação!");
      return;
    }

    const listaAtual = obterDados();

    // Validação de Saldo: Impede despesa ou guardar no cofrinho se não houver saldo
    if (tipo === "despesa" || tipo === "cofrinho") {
      const receitas = listaAtual
        .filter((t) => t.tipo === "receita")
        .reduce((a, t) => a + t.valor, 0);
      const despesas = listaAtual
        .filter((t) => t.tipo === "despesa")
        .reduce((a, t) => a + t.valor, 0);
      const cofrinhos = listaAtual
        .filter((t) => t.tipo === "cofrinho")
        .reduce((a, t) => a + t.valor, 0);

      const saldoAtual = receitas - despesas - cofrinhos;

      if (valor > saldoAtual) {
        alert("Saldo insuficiente para realizar esta operação!");
        return;
      }
    }

    // Criar novo objeto de transação
    const nova = {
      valor,
      tipo,
      cat: categoria,
      desc: descricao,
      data: new Date().toLocaleDateString("pt-br"),
    };

    // Salvar e atualizar
    listaAtual.unshift(nova);
    salvarDados(listaAtual);

    form.reset();
    renderHome();
    alert("✅ Lançamento gravado com sucesso!");
  });
}

// -------------------------------
// Inicialização
// -------------------------------
document.addEventListener("DOMContentLoaded", renderHome);
