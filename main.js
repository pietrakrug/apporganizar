"use strict";

/*
  AUREA - Controle Financeiro
  Compatível com a nova versão do index.html
*/

const STORAGE_KEY = "AUREA_DB";

const DB_PADRAO = {
  receitas: [
    {
      id: gerarId(),
      descricao: "Salário principal",
      categoria: "Salário",
      valor: 6600,
      data: new Date().toISOString()
    }
  ],

  despesas: [
    {
      id: gerarId(),
      descricao: "Aluguel",
      categoria: "Moradia",
      valor: 1300,
      tipo: "Fixo",
      pagamento: "Cartão de débito",
      data: new Date().toISOString()
    },
    {
      id: gerarId(),
      descricao: "Net Claro",
      categoria: "Internet/Telefone",
      valor: 70,
      tipo: "Fixo",
      pagamento: "Pix",
      data: new Date().toISOString()
    },
    {
      id: gerarId(),
      descricao: "Academia",
      categoria: "Academia",
      valor: 150,
      tipo: "Fixo",
      pagamento: "Pix",
      data: new Date().toISOString()
    },
    {
      id: gerarId(),
      descricao: "Curso de inglês",
      categoria: "Educação",
      valor: 70,
      tipo: "Fixo",
      pagamento: "Pix",
      data: new Date().toISOString()
    },
    {
      id: gerarId(),
      descricao: "Água",
      categoria: "Contas da Casa",
      valor: 45,
      tipo: "Fixo",
      pagamento: "Pix",
      data: new Date().toISOString()
    },
    {
      id: gerarId(),
      descricao: "Transporte",
      categoria: "Transporte",
      valor: 50,
      tipo: "Variável",
      pagamento: "Pix",
      data: new Date().toISOString()
    },
    {
      id: gerarId(),
      descricao: "iFood",
      categoria: "Delivery",
      valor: 65,
      tipo: "Variável",
      pagamento: "Cartão",
      data: new Date().toISOString()
    }
  ],

  investimentos: [
    {
      id: gerarId(),
      nome: "Investimentos existentes",
      valor: 31500,
      data: new Date().toISOString()
    }
  ],

  limites: [
    {
      id: gerarId(),
      categoria: "Restaurante",
      limite: 150
    },
    {
      id: gerarId(),
      categoria: "Transporte",
      limite: 250
    },
    {
      id: gerarId(),
      categoria: "Vestuário",
      limite: 300
    },
    {
      id: gerarId(),
      categoria: "Beleza",
      limite: 250
    },
    {
      id: gerarId(),
      categoria: "Delivery",
      limite: 180
    },
    {
      id: gerarId(),
      categoria: "Pets",
      limite: 200
    }
  ],

  desejos: [
    {
      id: gerarId(),
      nome: "Apple 2025 iPad Wi-Fi, 128 GB",
      valor: 3399,
      guardado: 1200,
      prazo: "5 meses",
      icone: "📱",
      data: new Date().toISOString()
    }
  ],

  dividas: 1250,

  config: {
    mes: new Date().getMonth(),
    ano: new Date().getFullYear()
  }
};

let DB = carregarBanco();
let paginaAtual = "dashboard";

/* =====================================================
   UTILIDADES
===================================================== */

function gerarId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function numero(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function escapar(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function salvarBanco() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DB));
}

function carregarBanco() {
  const salvo = localStorage.getItem(STORAGE_KEY);

  if (!salvo) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DB_PADRAO)
    );

    return DB_PADRAO;
  }

  try {
    const dados = JSON.parse(salvo);

    return {
      receitas: dados.receitas || [],
      despesas: dados.despesas || [],
      investimentos: dados.investimentos || [],
      limites: dados.limites || [],
      desejos: dados.desejos || [],
      dividas: Number(dados.dividas || 0),
      config: dados.config || DB_PADRAO.config
    };
  } catch (erro) {
    console.error("Erro ao carregar banco:", erro);
    return DB_PADRAO;
  }
}

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(mensagem);
    return;
  }

  toast.textContent = mensagem;
  toast.classList.add("show");

  clearTimeout(window.aureaToastTimer);

  window.aureaToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =====================================================
   CÁLCULOS
===================================================== */

function totalReceitas() {
  return DB.receitas.reduce(
    (total, item) => total + Number(item.valor || 0),
    0
  );
}

function totalDespesas() {
  return DB.despesas.reduce(
    (total, item) => total + Number(item.valor || 0),
    0
  );
}

function saldoAtual() {
  return totalReceitas() - totalDespesas();
}

function totalInvestimentos() {
  return DB.investimentos.reduce(
    (total, item) => total + Number(item.valor || 0),
    0
  );
}

function totalDesejos() {
  return DB.desejos.reduce(
    (total, item) => total + Number(item.valor || 0),
    0
  );
}

function totalGuardado() {
  return DB.desejos.reduce(
    (total, item) => total + Number(item.guardado || 0),
    0
  );
}

function gastosPorCategoria() {
  const categorias = {};

  DB.despesas.forEach(item => {
    const categoria = item.categoria || "Outros";

    if (!categorias[categoria]) {
      categorias[categoria] = 0;
    }

    categorias[categoria] += Number(item.valor || 0);
  });

  return categorias;
}

function gastoDaCategoria(categoria) {
  return DB.despesas
    .filter(item => item.categoria === categoria)
    .reduce(
      (total, item) => total + Number(item.valor || 0),
      0
    );
}

/* =====================================================
   NAVEGAÇÃO
===================================================== */

const PAGINAS = {
  dashboard: {
    titulo: "Dashboard",
    subtitulo: "Acompanhe sua evolução financeira",
    renderizar: renderDashboard
  },

  financeiro: {
    titulo: "Meu Financeiro",
    subtitulo: "Controle suas receitas, despesas e dívidas",
    renderizar: renderFinanceiro
  },

  investimentos: {
    titulo: "Investimentos",
    subtitulo: "Acompanhe seu patrimônio e seus aportes",
    renderizar: renderInvestimentos
  },

  limites: {
    titulo: "Limites",
    subtitulo: "Defina limites para seus gastos",
    renderizar: renderLimites
  },

  desejos: {
    titulo: "Desejos",
    subtitulo: "Planeje suas próximas conquistas",
    renderizar: renderDesejos
  }
};

function carregarPagina(nome) {
  if (!PAGINAS[nome]) {
    nome = "dashboard";
  }

  paginaAtual = nome;

  const titulo = document.getElementById("pageTitle");
  const subtitulo = document.getElementById("pageSubtitle");
  const conteudo = document.getElementById("content");

  if (titulo) {
    titulo.textContent = PAGINAS[nome].titulo;
  }

  if (subtitulo) {
    subtitulo.textContent = PAGINAS[nome].subtitulo;
  }

  if (conteudo) {
    conteudo.innerHTML = PAGINAS[nome].renderizar();
  }

  document.querySelectorAll(".menu").forEach(botao => {
    botao.classList.toggle(
      "active",
      botao.dataset.page === nome
    );
  });

  conectarEventosDaPagina();
}

function configurarMenu() {
  document.querySelectorAll(".menu").forEach(botao => {
    botao.addEventListener("click", () => {
      carregarPagina(botao.dataset.page);
    });
  });
}

/* =====================================================
   COMPONENTES
===================================================== */

function cartaoResumo(titulo, valor, classe, icone) {
  return `
    <div class="card metric">
      <small>${titulo}</small>
      <strong class="${classe}">
        ${typeof valor === "number" ? moeda(valor) : valor}
      </strong>
      <span class="icon">${icone}</span>
    </div>
  `;
}

function resumoCards() {
  const saldoClasse = saldoAtual() >= 0 ? "green" : "red";

  return `
    <div class="cards">
      ${cartaoResumo(
        "Receitas",
        totalReceitas(),
        "green",
        "💰"
      )}

      ${cartaoResumo(
        "Despesas",
        totalDespesas(),
        "red",
        "↘"
      )}

      ${cartaoResumo(
        "Saldo do mês",
        saldoAtual(),
        saldoClasse,
        "↗"
      )}

      ${cartaoResumo(
        "Investimentos",
        totalInvestimentos(),
        "purple",
        "📈"
      )}
    </div>
  `;
}

/* =====================================================
   DASHBOARD
===================================================== */

function renderDashboard() {
  const categorias = gastosPorCategoria();
  const total = totalDespesas();

  const categoriasHTML = Object.entries(categorias)
    .sort((a, b) => b[1] - a[1])
    .map(([nome, valor]) => {
      const percentual = total > 0
        ? (valor / total) * 100
        : 0;

      return `
        <div class="legend">
          <span>
            <label>
              <i class="dot" style="background:#765ce3"></i>
              ${escapar(nome)}
            </label>

            ${moeda(valor)}
          </span>

          <div class="progress">
            <i style="width:${percentual}%"></i>
          </div>
        </div>
      `;
    })
    .join("");

  const utilizacao = totalReceitas() > 0
    ? (totalDespesas() / totalReceitas()) * 100
    : 0;

  const alertas = gerarAlertasHTML();

  return `
    <div class="page">
      ${resumoCards()}

      <div class="grid-2">
        <div class="panel">
          <h3>🔔 Alertas inteligentes</h3>
          ${alertas}
        </div>

        <div class="panel">
          <h3>📊 Gastos por categoria</h3>

          ${
            categoriasHTML ||
            `<div class="empty">
              Nenhuma despesa registrada.
            </div>`
          }
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>Resumo financeiro</h3>
          <span class="muted">
            ${numero(utilizacao)}% da renda utilizada
          </span>
        </div>

        <div class="chart">
          <div class="bar-box">
            <div class="bar" style="height:90%"></div>
            <small>Receitas</small>
          </div>

          <div class="bar-box">
            <div
              class="bar expense"
              style="height:${Math.max(
                6,
                Math.min(
                  90,
                  totalReceitas()
                    ? totalDespesas() / totalReceitas() * 90
                    : 6
                )
              )}%">
            </div>
            <small>Despesas</small>
          </div>

          <div class="bar-box">
            <div
              class="bar"
              style="height:${Math.max(
                6,
                Math.min(
                  90,
                  totalReceitas()
                    ? Math.max(0, saldoAtual()) / totalReceitas() * 90
                    : 6
                )
              )}%">
            </div>
            <small>Saldo</small>
          </div>
        </div>
      </div>
    </div>
  `;
}

function gerarAlertasHTML() {
  const alertas = [];

  if (saldoAtual() < 0) {
    alertas.push(`
      <div class="alert danger">
        ⚠️ Seu saldo está negativo.
      </div>
    `);
  }

  if (totalReceitas() > 0) {
    const uso = totalDespesas() / totalReceitas() * 100;

    if (uso >= 80) {
      alertas.push(`
        <div class="alert danger">
          ⚠️ Você já utilizou ${numero(uso)}% da sua renda.
        </div>
      `);
    } else {
      alertas.push(`
        <div class="alert">
          ✅ Você está poupando ${numero(100 - uso)}% da sua renda.
        </div>
      `);
    }
  }

  const limiteExcedido = DB.limites.some(item => {
    return gastoDaCategoria(item.categoria) > item.limite;
  });

  if (limiteExcedido) {
    alertas.push(`
      <div class="alert warning">
        ⚠️ Existe pelo menos um limite de categoria excedido.
      </div>
    `);
  }

  if (DB.desejos.length > 0) {
    alertas.push(`
      <div class="alert">
        ✨ Você possui ${DB.desejos.length} meta(s) financeira(s).
      </div>
    `);
  }

  if (alertas.length === 0) {
    return `
      <div class="alert">
        ✅ Sua organização financeira está em dia.
      </div>
    `;
  }

  return alertas.join("");
}

/* =====================================================
   MEU FINANCEIRO
===================================================== */

function renderFinanceiro() {
  const receitasHTML = DB.receitas.map(item => `
    <tr>
      <td>${escapar(item.descricao)}</td>
      <td>${escapar(item.categoria)}</td>
      <td class="green">${moeda(item.valor)}</td>
      <td>
        <button
          class="btn danger excluir-receita"
          data-id="${item.id}">
          Excluir
        </button>
      </td>
    </tr>
  `).join("");

  const despesasHTML = DB.despesas.map(item => `
    <tr>
      <td>${escapar(item.descricao)}</td>
      <td>${escapar(item.categoria)}</td>
      <td>${escapar(item.tipo || "Variável")}</td>
      <td>${escapar(item.pagamento || "Não informado")}</td>
      <td class="red">${moeda(item.valor)}</td>
      <td>
        <button
          class="btn danger excluir-despesa"
          data-id="${item.id}">
          Excluir
        </button>
      </td>
    </tr>
  `).join("");

  return `
    <div class="page">
      ${resumoCards()}

      <div class="panel">
        <h3>Adicionar lançamento</h3>

        <form class="form" id="financeForm">
          <input
            class="input"
            name="descricao"
            placeholder="Descrição"
            required
          >

          <input
            class="input"
            name="valor"
            type="number"
            min="0"
            step="0.01"
            placeholder="Valor"
            required
          >

          <select class="select" name="tipo">
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>

          <select class="select" name="categoria">
            <option>Salário</option>
            <option>Moradia</option>
            <option>Alimentação</option>
            <option>Transporte</option>
            <option>Educação</option>
            <option>Delivery</option>
            <option>Saúde</option>
            <option>Lazer</option>
            <option>Outros</option>
          </select>

          <button class="btn" type="submit">
            Adicionar
          </button>
        </form>

        <h3>Receitas</h3>

        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              ${
                receitasHTML ||
                `<tr>
                  <td colspan="4" class="empty">
                    Nenhuma receita cadastrada.
                  </td>
                </tr>`
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <h3>Despesas, custos fixos e variáveis</h3>

        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Pagamento</th>
                <th>Valor</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              ${
                despesasHTML ||
                `<tr>
                  <td colspan="6" class="empty">
                    Nenhuma despesa cadastrada.
                  </td>
                </tr>`
              }
            </tbody>
          </table>
        </div>

        <div class="panel-header">
          <strong>Total mensal</strong>
          <strong class="red">${moeda(totalDespesas())}</strong>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>⚠️ Dívidas</h3>
          <strong class="red">${moeda(DB.dividas)}</strong>
        </div>

        <form class="form" id="debtForm">
          <input
            class="input"
            name="dividas"
            type="number"
            min="0"
            step="0.01"
            value="${DB.dividas}"
          >

          <button class="btn" type="submit">
            Atualizar dívidas
          </button>
        </form>
      </div>
    </div>
  `;
}

/* =====================================================
   INVESTIMENTOS
===================================================== */

function renderInvestimentos() {
  const lista = DB.investimentos.map(item => `
    <tr>
      <td>${escapar(item.nome)}</td>
      <td class="purple">${moeda(item.valor)}</td>
      <td>
        <button
          class="btn danger excluir-investimento"
          data-id="${item.id}">
          Excluir
        </button>
      </td>
    </tr>
  `).join("");

  return `
    <div class="page">
      ${resumoCards()}

      <div class="panel">
        <h3>Adicionar investimento</h3>

        <form class="form" id="investmentForm">
          <input
            class="input"
            name="nome"
            placeholder="Nome do investimento"
            required
          >

          <input
            class="input"
            name="valor"
            type="number"
            min="0"
            step="0.01"
            placeholder="Valor"
            required
          >

          <button class="btn" type="submit">
            Adicionar
          </button>
        </form>
      </div>

      <div class="panel">
        <h3>Meus investimentos</h3>

        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Investimento</th>
                <th>Valor</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              ${
                lista ||
                `<tr>
                  <td colspan="3" class="empty">
                    Nenhum investimento cadastrado.
                  </td>
                </tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

/* =====================================================
   LIMITES
===================================================== */

function renderLimites() {
  const lista = DB.limites.map(item => {
    const gasto = gastoDaCategoria(item.categoria);
    const percentual = item.limite > 0
      ? gasto / item.limite * 100
      : 0;

    const excedido = gasto > item.limite;

    return `
      <div class="limit">
        <div class="limit-line">
          <strong>${escapar(item.categoria)}</strong>

          <span>
            ${moeda(gasto)} / ${moeda(item.limite)}
            <button
              class="btn secondary editar-limite"
              data-id="${item.id}">
              Editar
            </button>
          </span>
        </div>

        <div class="progress">
          <i
            class="${excedido ? "over" : ""}"
            style="width:${Math.min(percentual, 100)}%">
          </i>
        </div>

        ${
          excedido
            ? `<small class="red">
                Limite excedido em ${moeda(gasto - item.limite)}
              </small>`
            : `<small class="muted">
                ${numero(percentual)}% utilizado
              </small>`
        }
      </div>
    `;
  }).join("");

  return `
    <div class="page">
      ${resumoCards()}

      <div class="panel">
        <h3>Adicionar limite</h3>

        <form class="form" id="limitForm">
          <input
            class="input"
            name="categoria"
            placeholder="Categoria"
            required
          >

          <input
            class="input"
            name="limite"
            type="number"
            min="0"
            step="0.01"
            placeholder="Valor do limite"
            required
          >

          <button class="btn" type="submit">
            Salvar limite
          </button>
        </form>
      </div>

      <div class="panel">
        <h3>🎯 Limites por categoria</h3>

        ${
          lista ||
          `<div class="empty">
            Nenhum limite cadastrado.
          </div>`
        }
      </div>
    </div>
  `;
}

/* =====================================================
   DESEJOS
===================================================== */

function renderDesejos() {
  const total = totalDesejos();
  const guardado = totalGuardado();
  const falta = total - guardado;

  const lista = DB.desejos.map(item => {
    const percentual = item.valor > 0
      ? item.guardado / item.valor * 100
      : 0;

    return `
      <div class="goal">
        <div class="goal-image">
          ${item.icone || "✨"}
        </div>

        <div>
          <h4>${escapar(item.nome)}</h4>

          <p>
            Objetivo: ${moeda(item.valor)}
            ${item.prazo ? ` · Prazo: ${escapar(item.prazo)}` : ""}
          </p>

          <div class="progress">
            <i style="width:${Math.min(percentual, 100)}%"></i>
          </div>

          <p>
            Guardado: ${moeda(item.guardado)}
            · Falta: ${moeda(item.valor - item.guardado)}
          </p>
        </div>

        <button
          class="btn secondary atualizar-desejo"
          data-id="${item.id}">
          Atualizar
        </button>

        <button
          class="btn danger excluir-desejo"
          data-id="${item.id}">
          Excluir
        </button>
      </div>
    `;
  }).join("");

  return `
    <div class="page">
      ${resumoCards()}

      <div class="cards">
        ${cartaoResumo(
          "Total de desejos",
          total,
          "purple",
          "♡"
        )}

        ${cartaoResumo(
          "Já guardado",
          guardado,
          "green",
          "✓"
        )}

        ${cartaoResumo(
          "Falta guardar",
          falta,
          "yellow",
          "🛒"
        )}

        ${cartaoResumo(
          "Metas cadastradas",
          String(DB.desejos.length),
          "purple",
          "✨"
        )}
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>✨ Meus desejos</h3>
        </div>

        <form class="form" id="goalForm">
          <input
            class="input"
            name="nome"
            placeholder="Nome do desejo"
            required
          >

          <input
            class="input"
            name="valor"
            type="number"
            min="0"
            step="0.01"
            placeholder="Valor total"
            required
          >

          <input
            class="input"
            name="prazo"
            placeholder="Prazo, por exemplo: 5 meses"
          >

          <button class="btn" type="submit">
            Criar desejo
          </button>
        </form>

        ${
          lista ||
          `<div class="empty">
            Nenhum desejo cadastrado.
          </div>`
        }
      </div>
    </div>
  `;
}

/* =====================================================
   EVENTOS
===================================================== */

function conectarEventosDaPagina() {
  document.querySelectorAll(".menu").forEach(botao => {
    botao.onclick = () => {
      carregarPagina(botao.dataset.page);
    };
  });

  const financeForm = document.getElementById("financeForm");

  if (financeForm) {
    financeForm.onsubmit = event => {
      event.preventDefault();

      const form = new FormData(financeForm);
      const valor = Number(form.get("valor"));

      if (!form.get("descricao") || valor <= 0) {
        mostrarToast("Preencha descrição e valor corretamente.");
        return;
      }

      const movimento = {
        id: gerarId(),
        descricao: form.get("descricao"),
        categoria: form.get("categoria"),
        valor,
        tipo: form.get("tipo") === "receita"
          ? "Receita"
          : "Variável",
        pagamento: "Não informado",
        data: new Date().toISOString()
      };

      if (form.get("tipo") === "receita") {
        DB.receitas.push(movimento);
      } else {
        DB.despesas.push(movimento);
      }

      salvarBanco();
      carregarPagina("financeiro");
      mostrarToast("Lançamento adicionado.");
    };
  }

  const debtForm = document.getElementById("debtForm");

  if (debtForm) {
    debtForm.onsubmit = event => {
      event.preventDefault();

      const form = new FormData(debtForm);
      DB.dividas = Number(form.get("dividas")) || 0;

      salvarBanco();
      carregarPagina("financeiro");
      mostrarToast("Dívidas atualizadas.");
    };
  }

  document.querySelectorAll(".excluir-receita").forEach(botao => {
    botao.onclick = () => {
      DB.receitas = DB.receitas.filter(
        item => item.id !== botao.dataset.id
      );

      salvarBanco();
      carregarPagina("financeiro");
      mostrarToast("Receita excluída.");
    };
  });

  document.querySelectorAll(".excluir-despesa").forEach(botao => {
    botao.onclick = () => {
      DB.despesas = DB.despesas.filter(
        item => item.id !== botao.dataset.id
      );

      salvarBanco();
      carregarPagina("financeiro");
      mostrarToast("Despesa excluída.");
    };
  });

  const investmentForm =
    document.getElementById("investmentForm");

  if (investmentForm) {
    investmentForm.onsubmit = event => {
      event.preventDefault();

      const form = new FormData(investmentForm);
      const valor = Number(form.get("valor"));

      if (!form.get("nome") || valor <= 0) {
        mostrarToast("Preencha o investimento corretamente.");
        return;
      }

      DB.investimentos.push({
        id: gerarId(),
        nome: form.get("nome"),
        valor,
        data: new Date().toISOString()
      });

      salvarBanco();
      carregarPagina("investimentos");
      mostrarToast("Investimento adicionado.");
    };
  }

  document.querySelectorAll(".excluir-investimento")
    .forEach(botao => {
      botao.onclick = () => {
        DB.investimentos = DB.investimentos.filter(
          item => item.id !== botao.dataset.id
        );

        salvarBanco();
        carregarPagina("investimentos");
        mostrarToast("Investimento excluído.");
      };
    });

  const limitForm = document.getElementById("limitForm");

  if (limitForm) {
    limitForm.onsubmit = event => {
      event.preventDefault();

      const form = new FormData(limitForm);
      const categoria = form.get("categoria");
      const limite = Number(form.get("limite"));

      if (!categoria || limite <= 0) {
        mostrarToast("Informe categoria e limite.");
        return;
      }

      const existente = DB.limites.find(
        item => item.categoria.toLowerCase() === categoria.toLowerCase()
      );

      if (existente) {
        existente.limite = limite;
      } else {
        DB.limites.push({
          id: gerarId(),
          categoria,
          limite
        });
      }

      salvarBanco();
      carregarPagina("limites");
      mostrarToast("Limite salvo.");
    };
  }

  document.querySelectorAll(".editar-limite")
    .forEach(botao => {
      botao.onclick = () => {
        const item = DB.limites.find(
          limite => limite.id === botao.dataset.id
        );

        if (!item) return;

        const novoValor = Number(
          prompt(
            `Novo limite para ${item.categoria}:`,
            item.limite
          )
        );

        if (Number.isNaN(novoValor) || novoValor < 0) {
          mostrarToast("Informe um limite válido.");
          return;
        }

        item.limite = novoValor;

        salvarBanco();
        carregarPagina("limites");
        mostrarToast("Limite atualizado.");
      };
    });

  const goalForm = document.getElementById("goalForm");

  if (goalForm) {
    goalForm.onsubmit = event => {
      event.preventDefault();

      const form = new FormData(goalForm);
      const valor = Number(form.get("valor"));

      if (!form.get("nome") || valor <= 0) {
        mostrarToast("Preencha o desejo e o valor.");
        return;
      }

      DB.desejos.push({
        id: gerarId(),
        nome: form.get("nome"),
        valor,
        guardado: 0,
        prazo: form.get("prazo"),
        icone: "✨",
        data: new Date().toISOString()
      });

      salvarBanco();
      carregarPagina("desejos");
      mostrarToast("Desejo criado.");
    };
  }

  document.querySelectorAll(".atualizar-desejo")
    .forEach(botao => {
      botao.onclick = () => {
        const desejo = DB.desejos.find(
          item => item.id === botao.dataset.id
        );

        if (!desejo) return;

        const valor = Number(
          prompt(
            "Quanto deseja adicionar ao valor guardado?",
            0
          )
        );

        if (!valor || valor <= 0) {
          mostrarToast("Informe um valor válido.");
          return;
        }

        desejo.guardado = Math.min(
          desejo.valor,
          desejo.guardado + valor
        );

        salvarBanco();
        carregarPagina("desejos");
        mostrarToast("Meta atualizada.");
      };
    });

  document.querySelectorAll(".excluir-desejo")
    .forEach(botao => {
      botao.onclick = () => {
        DB.desejos = DB.desejos.filter(
          item => item.id !== botao.dataset.id
        );

        salvarBanco();
        carregarPagina("desejos");
        mostrarToast("Desejo excluído.");
      };
    });
}

/* =====================================================
   NOTIFICAÇÕES E MÊS
===================================================== */

function configurarNotificacoes() {
  const botao = document.getElementById(
    "notificationButton"
  );

  if (!botao) return;

  botao.onclick = () => {
    mostrarToast(
      "Você tem contas próximas do vencimento."
    );
  };
}

function configurarMes() {
  const seletor = document.getElementById("monthSelect");

  if (!seletor) return;

  const indiceSalvo = DB.config.mes;

  if (indiceSalvo >= 0 && indiceSalvo < seletor.options.length) {
    seletor.selectedIndex = indiceSalvo;
  }

  seletor.onchange = () => {
    DB.config.mes = seletor.selectedIndex;
    salvarBanco();

    mostrarToast(
      `Período alterado para ${seletor.value}.`
    );
  };
}

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  configurarMenu();
  configurarNotificacoes();
  configurarMes();
  carregarPagina("dashboard");
});
