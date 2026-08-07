const STORAGE_KEY = "organiza_transactions";

function loadTransactions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTransactions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

let transactions = loadTransactions();

const openFormBtn = document.getElementById("openFormBtn");
const cancelFormBtn = document.getElementById("cancelFormBtn");
const formCard = document.getElementById("formCard");
const form = document.getElementById("transactionForm");
const descInput = document.getElementById("descInput");
const valueInput = document.getElementById("valueInput");
const typeInput = document.getElementById("typeInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");
const transactionList = document.getElementById("transactionList");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const totalBalanceEl = document.getElementById("totalBalance");
const monthChip = document.getElementById("monthChip");

function updateMonthChip() {
  const now = new Date();
  const options = { month: "long", year: "numeric" };
  const label = now.toLocaleDateString("pt-BR", options);
  monthChip.textContent = label.charAt(0).toUpperCase() + label.slice(1);
}

function render() {
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.type === "receita") {
      income += t.value;
    } else {
      expense += t.value;
    }
  });

  totalIncomeEl.textContent = formatCurrency(income);
  totalExpenseEl.textContent = formatCurrency(expense);
  totalBalanceEl.textContent = formatCurrency(income - expense);

  if (transactions.length === 0) {
    transactionList.innerHTML = '<p class="text-muted">Nenhuma transacao cadastrada ainda.</p>';
    return;
  }

  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  transactionList.innerHTML = sorted
    .map((t) => {
      const sign = t.type === "receita" ? "+" : "-";
      const colorClass = t.type === "receita" ? "success" : "danger";
      const dateFormatted = new Date(t.date + "T00:00:00").toLocaleDateString("pt-BR");
      return (
        '<div class="list-item" data-id="' + t.id + '">' +
        '<span>' + t.description + (t.category ? " (" + t.category + ")" : "") + " - " + dateFormatted + '</span>' +
        '<span style="display:flex; align-items:center; gap:10px;">' +
        '<strong class="' + colorClass + '">' + sign + " " + formatCurrency(t.value) + '</strong>' +
        '<button class="ghost-button delete-btn" data-id="' + t.id + '" type="button">Excluir</button>' +
        '</span>' +
        '</div>'
      );
    })
    .join("");

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      transactions = transactions.filter((t) => String(t.id) !== id);
      saveTransactions(transactions);
      render();
    });
  });
}

openFormBtn.addEventListener("click", () => {
  formCard.style.display = formCard.style.display === "none" ? "block" : "none";
});

cancelFormBtn.addEventListener("click", () => {
  form.reset();
  formCard.style.display = "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = descInput.value.trim();
  const value = parseFloat(valueInput.value);
  const type = typeInput.value;
  const category = categoryInput.value.trim();
  const date = dateInput.value;

  if (!description || isNaN(value) || !date) {
    return;
  }

  transactions.push({
    id: Date.now(),
    description,
    value,
    type,
    category,
    date,
  });

  saveTransactions(transactions);
  render();

  form.reset();
  formCard.style.display = "none";
});

updateMonthChip();
render();
