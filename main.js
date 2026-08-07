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

function monthKey(dateStr) {
  return dateStr.slice(0, 7);
}

let transactions = loadTransactions();
let currentDate = new Date();
currentDate.setDate(1);

const openFormBtn = document.getElementById("openFormBtn");
const cancelFormBtn = document.getElementById("cancelFormBtn");
const formCard = document.getElementById("formCard");
const form = document.getElementById("transactionForm");
const descInput = document.getElementById("descInput");
const valueInput = document.getElementById("valueInput");
const typeInput = document.getElementById("typeInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");
const plannedInput = document.getElementById("plannedInput");
const transactionList = document.getElementById("transactionList");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const totalBalanceEl = document.getElementById("totalBalance");
const totalPlannedEl = document.getElementById("totalPlanned");
const listSubtitle = document.getElementById("listSubtitle");
const monthChip = document.getElementById("monthChip");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const monthlySummary = document.getElementById("monthlySummary");

function currentMonthKey() {
  const y = currentDate.getFullYear();
  const m = String(currentDate.getMonth() + 1).padStart(2, "0");
  return y + "-" + m;
}

function updateMonthChip() {
  const options = { month: "long", year: "numeric" };
  const label = currentDate.toLocaleDateString("pt-BR", options);
  monthChip.textContent = label.charAt(0).toUpperCase() + label.slice(1);
}

function render() {
  updateMonthChip();
  const key = currentMonthKey();
  const monthTx = transactions.filter((t) => monthKey(t.date) === key);

  let income = 0;
  let expense = 0;
  let plannedNet = 0;

  monthTx.forEach((t) => {
    const signedValue = t.type === "receita" ? t.value : -t.value;
    if (t.planned) {
      plannedNet += signedValue;
    } else {
      if (t.type === "receita") {
        income += t.value;
      } else {
        expense += t.value;
      }
    }
  });

  totalIncomeEl.textContent = formatCurrency(income);
  totalExpenseEl.textContent = formatCurrency(expense);
  totalBalanceEl.textContent = formatCurrency(income - expense);
  totalPlannedEl.textContent = formatCurrency(income - expense + plannedNet);

  if (monthTx.length === 0) {
    transactionList.innerHTML = '<p class="text-muted">Nenhuma transacao neste mes.</p>';
  } else {
    const sorted = [...monthTx].sort((a, b) => new Date(a.date) - new Date(b.date));

    transactionList.innerHTML = sorted
      .map((t) => {
        const sign = t.type === "receita" ? "+" : "-";
        const colorClass = t.type === "receita" ? "success" : "danger";
        const dateFormatted = new Date(t.date + "T00:00:00").toLocaleDateString("pt-BR");
        const plannedTag = t.planned ? ' <span class="status-pill">planejado</span>' : "";
        return (
          '<div class="list-item" data-id="' + t.id + '">' +
          '<span>' + t.description + (t.category ? " (" + t.category + ")" : "") + " - " + dateFormatted + plannedTag + '</span>' +
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

  renderMonthlySummary();
}

function renderMonthlySummary() {
  if (transactions.length === 0) {
    monthlySummary.innerHTML = '<p class="text-muted">Sem dados suficientes ainda.</p>';
    return;
  }

  const keys = new Set(transactions.map((t) => monthKey(t.date)));
  keys.add(currentMonthKey());

  const base = new Date(currentDate);
  for (let i = -3; i <= 3; i++) {
    const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
    const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
    keys.add(k);
  }

  const sortedKeys = Array.from(keys).sort();
  const todayKey = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0");

  monthlySummary.innerHTML = sortedKeys
    .map((k) => {
      const monthTx = transactions.filter((t) => monthKey(t.date) === k);
      let income = 0;
      let expense = 0;
      let planned = 0;

      monthTx.forEach((t) => {
        const signedValue = t.type === "receita" ? t.value : -t.value;
        if (t.planned) {
          planned += signedValue;
        } else if (t.type === "receita") {
          income += t.value;
        } else {
          expense += t.value;
        }
      });

      const balance = income - expense;
      const [y, m] = k.split("-");
      const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      const labelCap = label.charAt(0).toUpperCase() + label.slice(1);
      const isFuture = k > todayKey;
      const isCurrent = k === currentMonthKey();
      const tag = isFuture ? '<span class="status-pill pink">planejamento</span>' : (k === todayKey ? '<span class="status-pill">mes atual</span>' : "");

      return (
        '<div class="list-item" style="' + (isCurrent ? "font-weight:700;" : "") + '">' +
        '<span>' + labelCap + " " + tag + '</span>' +
        '<span style="display:flex; gap:14px;">' +
        '<span class="text-muted">Saldo: <strong class="' + (balance >= 0 ? "success" : "danger") + '">' + formatCurrency(balance) + '</strong></span>' +
        (planned !== 0 ? '<span class="text-muted">Previsto: ' + formatCurrency(balance + planned) + '</span>' : "") +
        '</span>' +
        '</div>'
      );
    })
    .join("");
}

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  render();
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  render();
});

openFormBtn.addEventListener("click", () => {
  formCard.style.display = formCard.style.display === "none" ? "block" : "none";
  if (formCard.style.display === "block" && !dateInput.value) {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    dateInput.value = y + "-" + m + "-01";
  }
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
  const planned = plannedInput.checked;

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
    planned,
  });

  saveTransactions(transactions);
  render();

  form.reset();
  formCard.style.display = "none";
});

render();
