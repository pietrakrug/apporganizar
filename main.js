"use strict";

/* =====================================================
   AUREA - MAIN.JS
   Compatível com o index.html atualizado
===================================================== */

const STORAGE_KEY = "AUREA_DB";

function gerarId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Date.now() + "-" + Math.random().toString(16).slice(2);
}

function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function escapar(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DB));
}

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(mensagem);
    return;
  }

  toast.textContent = mensagem;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =====================================================
   BANCO DE DADOS
===================================================== */

const bancoInicial = {
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

function carregarBanco() {
  const bancoSalvo = localStorage.getItem(STORAGE_KEY);

  if (!bancoSalvo) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoInicial)
    );

    return bancoInicial;
  }

  try {
    const banco = JSON.parse(bancoSalvo);

    return {
      receitas: Array.isArray(banco.receitas)
        ? banco.receitas
        : [],

      despesas: Array.isArray(banco.despesas)
        ? banco.despesas
        : [],

      investimentos: Array.isArray(banco.investimentos)
        ? banco.investimentos
        : [],

      limites: Array.isArray(banco.limites)
        ? banco.limites
        : [],

      desejos: Array.isArray(banco.desejos)
        ? banco.desejos
        : [],

      dividas: Number(banco.dividas || 0),

      config: banco.config || bancoInicial.config
    };
  } catch (erro) {
    console.error("Erro ao ler o banco de dados:", erro);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoInicial)
    );

    return bancoInicial;
  }
}

let DB = carregarBanco();
let paginaAtual = "dashboard";

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

function totalInvestimentos() {
  return DB.investimentos.reduce(
    (total, item) => total + Number(item.valor || 0),
    0
  );
}

function saldoAtual() {
  return totalReceitas() - totalDespesas();
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
   COMPONENTES
===================================================== */

function resumoCards() {
  const classeSaldo = saldoAtual() >= 0 ? "green" : "red";

  return `
    <div class="cards">
      <div class="card metric">
        <small>Receitas</small>
        <strong class="green">${moeda(totalReceitas())}</strong>
        <span class="icon">💰</span>
      </div>

      <div class="card metric">
        <small>Despesas</small>
        <strong class="red">${moeda(totalDespesas())}</strong>
        <span class="icon">↘</span>
      </div>

      <div class="card metric">
        <small>Saldo do mês</small>
        <strong class="${classeSaldo}">
          ${moeda(saldoAtual())}
        </strong>
        <span class="icon">↗</span>
      </div>

      <div class="card metric">
        <small>Investimentos</small>
        <strong class="purple">
          ${moeda(totalInvestimentos())}
        </strong>
        <span class="icon">📈</span>
      </div>
    </div>
  `;
}

/* =====================================================
   DASHBOARD
===================================================== */

function gerarAlertas() {
  const alertas = [];

  if (saldoAtual() < 0) {
    alertas.push(`
      <div class="alert danger">
        ⚠️ Seu saldo está negativo.
      </div>
    `);
  }

  if (totalReceitas() > 0) {
    const percentual =
      totalDespesas() / totalReceitas() * 100;

    if (percentual >= 80) {
      alertas.push(`
        <div class="alert danger">
          ⚠️ Você já utilizou ${percentual.toFixed(1)}%
          da sua renda.
        </div>
      `);
    } else {
      alertas.push(`
        <div class="alert">
          ✅ Você está poupando
          ${(100 - percentual).toFixed(1)}%
          da sua renda.
        </div>
      `);
    }
  }

  const existeLimiteExcedido = DB.limites.some(item => {
    return gastoDaCategoria(item.categoria) > item.limite;
  });

  if (existeLimiteExcedido) {
    alertas.push(`
      <div class="alert warning">
        ⚠️ Existe limite de categoria ultrapassado.
      </div>
    `);
  }

  if (DB.desejos.length > 0) {
    alertas.push(`
      <div class="alert">
        ✨ Você possui ${DB.desejos.length}
        meta(s) financeira(s).
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

function renderDashboard() {
  const categorias = gastosPorCategoria();
  const total = totalDespesas();

  const categoriasHTML = Object.entries(categorias)
    .sort((a, b) => b[1] - a[1])
    .map(([categoria, valor]) => {
      const percentual = total > 0
        ? valor / total * 100
        : 0;

      return `
        <div class="legend">
          <span>
            <label>
              <i
                class="dot"
                style="background:#765ce3">
              </i>

              ${escapar(categoria)}
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

  const percentualUso = totalReceitas() > 0
    ? totalDespesas() / totalReceitas() * 100
    : 0;

  return `
    <div class="page">
      ${resumoCards()}

      <div class="grid-2">
        <div class="panel">
          <h3>🔔 Alertas inteligentes</h3>

          <div class="alert warning">
            📅 Existem contas próximas do vencimento.
          </div>

          ${gerarAlertas()}
        </div>

        <div class="panel">
          <h3>📊 Gastos por categoria</h3>

          ${
            categoriasHTML ||
            `<div class="empty">
              Nenhuma despesa cadastrada.
            </div>`
          }
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>Resumo financeiro</h3>

          <span class="muted">
            ${percentualUso.toFixed(1)}% da renda utilizada
          </span>
        </div>

        <div class="chart">
          <div class="bar-box">
            <div
              class="bar"
              style="height:90%">
            </div>
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
                    ? Math.max(0, saldoAtual())
                      / totalReceitas() * 90
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

/* =====================================================
   FINANCEIRO
===================================================== */

function renderFinanceiro() {
  const receitas = DB.receitas.map(item => `
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

  const despesas = DB.despesas.map(item => `
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
                receitas ||
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
        <h3>Despesas</h3>

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
                despesas ||
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
          <strong>Total de despesas</strong>
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
            type="number"
            name="dividas"
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
                <th>Nome</th>
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

        <small class="${excedido ? "red" : "muted"}">
          ${
            excedido
              ? "Limite excedido em " +
                moeda(gasto - item.limite)
              : percentual.toFixed(1) +
                "% utilizado"
          }
        </small>
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
            ${item.prazo ? " · Prazo: " + escapar(item.prazo) : ""}
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
        <div class="card metric">
          <small>Total de desejos</small>
          <strong class="purple">${moeda(total)}</strong>
          <span class="icon">♡</span>
        </div>

        <div class="card metric">
          <small>Já guardado</small>
          <strong class="green">${moeda(guardado)}</strong>
          <span class="icon">✓</span>
        </div>

        <div class="card metric">
          <small>Falta guardar</small>
          <strong class="yellow">${moeda(falta)}</strong>
          <span class="icon">🛒</span>
        </div>

        <div class="card metric">
          <small>Metas cadastradas</small>
          <strong class="purple">${DB.desejos.length}</strong>
          <span class="icon">✨</span>
        </div>
      </div>

      <div class="panel">
        <h3>✨ Meus desejos</h3>

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

function conectarEventos() {
  const financeForm =
    document.getElementById("financeForm");

  if (financeForm) {
    financeForm.onsubmit = function(event) {
      event.preventDefault();

      const dados = new FormData(financeForm);
      const valor = Number(dados.get("valor"));

      if (!dados.get("descricao") || valor <= 0) {
        mostrarToast("Preencha os dados corretamente.");
        return;
      }

      const item = {
        id: gerarId(),
        descricao: dados.get("descricao"),
        categoria: dados.get("categoria"),
        valor,
        tipo: dados.get("tipo") === "receita"
          ? "Receita"
          : "Variável",
        pagamento: "Não informado",
        data: new Date().toISOString()
      };

      if (dados.get("tipo") === "receita") {
        DB.receitas.push(item);
      } else {
        DB.despesas.push(item);
      }

      salvar();
      carregarPagina("financeiro");
      mostrarToast("Lançamento adicionado.");
    };
  }

  const debtForm =
    document.getElementById("debtForm");

  if (debtForm) {
    debtForm.onsubmit = function(event) {
      event.preventDefault();

      const dados = new FormData(debtForm);

      DB.dividas = Number(dados.get("dividas")) || 0;

      salvar();
      carregarPagina("financeiro");
      mostrarToast("Dívidas atualizadas.");
    };
  }

  document
    .querySelectorAll(".excluir-receita")
    .forEach(botao => {
      botao.onclick = function() {
        DB.receitas = DB.receitas.filter(
          item => item.id !== botao.dataset.id
        );

        salvar();
        carregarPagina("financeiro");
        mostrarToast("Receita excluída.");
      };
    });

  document
    .querySelectorAll(".excluir-despesa")
    .forEach(botao => {
      botao.onclick = function() {
        DB.despesas = DB.despesas.filter(
          item => item.id !== botao.dataset.id
        );

        salvar();
        carregarPagina("financeiro");
        mostrarToast("Despesa excluída.");
      };
    });

  const investmentForm =
    document.getElementById("investmentForm");

  if (investmentForm) {
    investmentForm.onsubmit = function(event) {
      event.preventDefault();

      const dados = new FormData(investmentForm);
      const valor = Number(dados.get("valor"));

      if (!dados.get("nome") || valor <= 0) {
        mostrarToast("Preencha os dados do investimento.");
        return;
      }

      DB.investimentos.push({
        id: gerarId(),
        nome: dados.get("nome"),
        valor,
        data: new Date().toISOString()
      });

      salvar();
      carregarPagina("investimentos");
      mostrarToast("Investimento adicionado.");
    };
  }

  document
    .querySelectorAll(".excluir-investimento")
    .forEach(botao => {
      botao.onclick = function() {
        DB.investimentos = DB.investimentos.filter(
          item => item.id !== botao.dataset.id
        );

        salvar();
        carregarPagina("investimentos");
        mostrarToast("Investimento excluído.");
      };
    });

  const limitForm =
    document.getElementById("limitForm");

  if (limitForm) {
    limitForm.onsubmit = function(event) {
      event.preventDefault();

      const dados = new FormData(limitForm);
      const categoria = dados.get("categoria");
      const limite = Number(dados.get("limite"));

      if (!categoria || limite <= 0) {
        mostrarToast("Informe a categoria e o limite.");
        return;
      }

      const existente = DB.limites.find(
        item =>
          item.categoria.toLowerCase() ===
          categoria.toLowerCase()
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

      salvar();
      carregarPagina("limites");
      mostrarToast("Limite salvo.");
    };
  }

  document
    .querySelectorAll(".editar-limite")
    .forEach(botao => {
      botao.onclick = function() {
        const item = DB.limites.find(
          limite => limite.id === botao.dataset.id
        );

        if (!item) return;

        const novoLimite = Number(
          prompt(
            "Novo limite para " + item.categoria,
            item.limite
          )
        );

        if (Number.isNaN(novoLimite) || novoLimite < 0) {
          mostrarToast("Informe um limite válido.");
          return;
        }

        item.limite = novoLimite;

        salvar();
        carregarPagina("limites");
        mostrarToast("Limite atualizado.");
      };
    });

  const goalForm =
    document.getElementById("goalForm");

  if (goalForm) {
    goalForm.onsubmit = function(event) {
      event.preventDefault();

      const dados = new FormData(goalForm);
      const valor = Number(dados.get("valor"));

      if (!dados.get("nome") || valor <= 0) {
        mostrarToast("Preencha o nome e o valor da meta.");
        return;
      }

      DB.desejos.push({
        id: gerarId(),
        nome: dados.get("nome"),
        valor,
        guardado: 0,
        prazo: dados.get("prazo"),
        icone: "✨",
        data: new Date().toISOString()
      });

      salvar();
      carregarPagina("desejos");
      mostrarToast("Desejo criado.");
    };
  }

  document
    .querySelectorAll(".atualizar-desejo")
    .forEach(botao => {
      botao.onclick = function() {
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

        salvar();
        carregarPagina("desejos");
        mostrarToast("Meta atualizada.");
      };
    });

  document
    .querySelectorAll(".excluir-desejo")
    .forEach(botao => {
      botao.onclick = function() {
        DB.desejos = DB.desejos.filter(
          item => item.id !== botao.dataset.id
        );

        salvar();
        carregarPagina("desejos");
        mostrarToast("Desejo excluído.");
      };
    });
}

/* =====================================================
   PÁGINAS
===================================================== */

const paginas = {
  dashboard: {
    titulo: "Dashboard",
    subtitulo: "Acompanhe sua evolução financeira",
    render: renderDashboard
  },

  financeiro: {
    titulo: "Meu Financeiro",
    subtitulo: "Controle suas receitas, despesas e dívidas",
    render: renderFinanceiro
  },

  investimentos: {
    titulo: "Investimentos",
    subtitulo: "Acompanhe seu patrimônio e seus aportes",
    render: renderInvestimentos
  },

  limites: {
    titulo: "Limites",
    subtitulo: "Defina limites para seus gastos",
    render: renderLimites
  },

  desejos: {
    titulo: "Desejos",
    subtitulo: "Planeje suas próximas conquistas",
    render: renderDesejos
  }
};

function carregarPagina(nome) {
  if (!paginas[nome]) {
    nome = "dashboard";
  }

  paginaAtual = nome;

  const conteudo = document.getElementById("content");
  const titulo = document.getElementById("pageTitle");
  const subtitulo = document.getElementById("pageSubtitle");

  if (!conteudo) {
    console.error(
      'Erro: o elemento com id="content" não foi encontrado.'
    );
    return;
  }

  conteudo.innerHTML = paginas[nome].render();

  if (titulo) {
    titulo.textContent = paginas[nome].titulo;
  }

  if (subtitulo) {
    subtitulo.textContent = paginas[nome].subtitulo;
  }

  document.querySelectorAll(".menu").forEach(botao => {
    botao.classList.toggle(
      "active",
      botao.dataset.page === nome
    );

    botao.onclick = function() {
      carregarPagina(botao.dataset.page);
    };
  });

  conectarEventos();
}

/* =====================================================
   CONFIGURAÇÕES
===================================================== */

function configurarNotificacoes() {
  const botao =
    document.getElementById("notificationButton");

  if (!botao) return;

  botao.onclick = function() {
    mostrarToast(
      "Você possui contas próximas do vencimento."
    );
  };
}

function configurarMes() {
  const seletor =
    document.getElementById("monthSelect");

  if (!seletor) return;

  const mesSalvo = Number(DB.config.mes);

  if (
    mesSalvo >= 0 &&
    mesSalvo < seletor.options.length
  ) {
    seletor.selectedIndex = mesSalvo;
  }

  seletor.onchange = function() {
    DB.config.mes = seletor.selectedIndex;
    salvar();

    mostrarToast(
      "Período alterado para " + seletor.value
    );
  };
}

/* =====================================================
   FUNÇÕES GLOBAIS
===================================================== */

window.removerLancamento = function(idLancamento) {
  DB.receitas = DB.receitas.filter(
    item => item.id !== idLancamento
  );

  DB.despesas = DB.despesas.filter(
    item => item.id !== idLancamento
  );

  salvar();
  carregarPagina("financeiro");
  mostrarToast("Lançamento removido.");
};

window.removerInvestimento = function(idInvestimento) {
  DB.investimentos = DB.investimentos.filter(
    item => item.id !== idInvestimento
  );

  salvar();
  carregarPagina("investimentos");
  mostrarToast("Investimento removido.");
};

window.removerLimite = function(idLimite) {
  DB.limites = DB.limites.filter(
    item => item.id !== idLimite
  );

  salvar();
  carregarPagina("limites");
  mostrarToast("Limite removido.");
};

window.removerDesejo = function(idDesejo) {
  DB.desejos = DB.desejos.filter(
    item => item.id !== idDesejo
  );

  salvar();
  carregarPagina("desejos");
  mostrarToast("Desejo removido.");
};

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {
    configurarNotificacoes();
    configurarMes();
    carregarPagina("dashboard");
  }
);
