// --- DATA LAYER ---
const getData = () => JSON.parse(localStorage.getItem("mymoney_data")) || [];
const saveData = (data) => localStorage.setItem("mymoney_data", JSON.stringify(data));

// --- UTILS & LOGIC ---
const brl = (v) => v.toLocaleString("pt-br", { style: "currency", currency: "BRL" });

const calculateTotals = (transactions) => {
  const keys = { receita: "income", despesa: "expenses", cofrinho: "savings" };
  return transactions.reduce((acc, t) => {
    const key = keys[t.tipo];
    if (key) acc[key] += t.valor;
    return acc;
  }, { income: 0, expenses: 0, savings: 0 });
};

// --- DASHBOARD RENDER ---
function renderHome() {
  const balanceEl = document.getElementById("resumo-saldo");
  if (!balanceEl) return;

  const totals = calculateTotals(getData());
  const availableBalance = totals.income - totals.expenses - totals.savings;

  document.getElementById("resumo-receitas").innerText = brl(totals.income);
  document.getElementById("resumo-despesas").innerText = brl(totals.expenses);
  document.getElementById("resumo-cofrinhos").innerText = brl(totals.savings);

  balanceEl.innerText = brl(availableBalance);
  balanceEl.className = `fw-extrabold m-0 ${availableBalance >= 0 ? "text-primary" : "text-danger"}`;
}

// --- FORM HANDLER ---
const form = document.getElementById("transacao-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = {
      valor: parseFloat(document.getElementById("input-valor").value),
      tipo: document.getElementById("input-tipo").value,
      cat: document.getElementById("input-categoria").value,
      desc: document.getElementById("input-descricao").value
    };

    const currentList = getData();
    const totals = calculateTotals(currentList);
    const currentBalance = totals.income - totals.expenses - totals.savings;

    if (["despesa", "cofrinho"].includes(fields.tipo) && fields.valor > currentBalance) {
      return alert("Saldo insuficiente!");
    }

    const newItem = { ...fields, data: new Date().toLocaleDateString("pt-br") };
    saveData([newItem, ...currentList]);

    form.reset();
    renderHome();
    if (typeof renderHistory === "function") renderHistory(); // Atualiza histórico se estiver na mesma página
    alert("✅ Registro salvo com sucesso!");
  });
}

document.addEventListener("DOMContentLoaded", renderHome);