"use strict";

/* =========================================================
   AUREA
   MAIN.JS
   Ponto de entrada da aplicação
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const STORAGE_KEY = "AUREA_DB";


/* =========================================================
   BANCO DE DADOS INICIAL
========================================================= */

const bancoInicial = {

  receitas: [],

  despesas: [],

  custosFixos: [],

  investimentos: [],

  limites: [],

  desejos: [],

  tarefas: [],

  planejamentos: [],

  relatorios: [],

  config: {
    mesAtual: new Date().getMonth(),
    anoAtual: new Date().getFullYear()
  }

};


/* =========================================================
   UTILITÁRIOS
========================================================= */

function gerarId(prefixo = "id") {

  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return `${prefixo}-${window.crypto.randomUUID()}`;
  }

  return `${prefixo}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}


function moeda(valor) {

  return Number(valor || 0).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );

}


function escapar(valor) {

  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function salvarBanco() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(DB)
  );

}


function carregarBanco() {

  const bancoSalvo =
    localStorage.getItem(STORAGE_KEY);

  /*
   * Primeiro acesso:
   * cria um banco vazio.
   */

  if (!bancoSalvo) {

    const bancoNovo =
      structuredClone
        ? structuredClone(bancoInicial)
        : JSON.parse(
            JSON.stringify(bancoInicial)
          );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoNovo)
    );

    return bancoNovo;
  }


  /*
   * Banco existente:
   * tenta carregar e completar
   * propriedades que eventualmente
   * não existam.
   */

  try {

    const banco =
      JSON.parse(bancoSalvo);

    return {

      receitas: Array.isArray(banco.receitas)
        ? banco.receitas
        : [],

      despesas: Array.isArray(banco.despesas)
        ? banco.despesas
        : [],

      custosFixos: Array.isArray(
        banco.custosFixos
      )
        ? banco.custosFixos
        : [],

      investimentos: Array.isArray(
        banco.investimentos
      )
        ? banco.investimentos
        : [],

      limites: Array.isArray(banco.limites)
        ? banco.limites
        : [],

      desejos: Array.isArray(banco.desejos)
        ? banco.desejos
        : [],

      tarefas: Array.isArray(banco.tarefas)
        ? banco.tarefas
        : [],

      planejamentos: Array.isArray(
        banco.planejamentos
      )
        ? banco.planejamentos
        : [],

      relatorios: Array.isArray(
        banco.relatorios
      )
        ? banco.relatorios
        : [],

      config: {

        ...bancoInicial.config,

        ...(banco.config || {})

      }

    };

  } catch (erro) {

    console.error(
      "Erro ao carregar banco:",
      erro
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoInicial)
    );

    return bancoInicial;

  }

}


/*
 * Banco global da aplicação.
 */

let DB = carregarBanco();


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(mensagem) {

  const toast =
    document.getElementById("toast");

  if (!toast) {

    console.log(mensagem);

    return;

  }

  toast.textContent = mensagem;

  toast.classList.add("show");

  clearTimeout(
    window.AUREA_TOAST_TIMER
  );

  window.AUREA_TOAST_TIMER =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2500);

}


/* =========================================================
   CONTEXTO DO MÊS
========================================================= */

function obterMesAtual() {

  return Number(
    DB.config?.mesAtual ?? new Date().getMonth()
  );

}


function obterAnoAtual() {

  return Number(
    DB.config?.anoAtual ?? new Date().getFullYear()
  );

}


/* =========================================================
   CÁLCULOS BÁSICOS
========================================================= */

function pertenceAoMes(
  item,
  mes = obterMesAtual(),
  ano = obterAnoAtual()
) {

  if (!item) {
    return false;
  }


  /*
   * Se o registro possui mes/ano,
   * usamos esses dados.
   */

  if (
    item.mes !== undefined &&
    item.ano !== undefined
  ) {

    return (
      Number(item.mes) === Number(mes) &&
      Number(item.ano) === Number(ano)
    );

  }


  /*
   * Compatibilidade com registros
   * antigos que possuem apenas data.
   */

  if (item.data) {

    const data =
      new Date(item.data);

    if (Number.isNaN(data.getTime())) {
      return false;
    }

    return (
      data.getMonth() === Number(mes) &&
      data.getFullYear() === Number(ano)
    );

  }

  return false;

}


function receitasDoMes() {

  return DB.receitas.filter(
    item => pertenceAoMes(item)
  );

}


function despesasDoMes() {

  return DB.despesas.filter(
    item => pertenceAoMes(item)
  );

}


function investimentosDoMes() {

  return DB.investimentos.filter(
    item => pertenceAoMes(item)
  );

}


function totalReceitas() {

  return receitasDoMes().reduce(
    (total, item) =>
      total + Number(item.valor || 0),
    0
  );

}


function totalDespesas() {

  return despesasDoMes().reduce(
    (total, item) =>
      total + Number(item.valor || 0),
    0
  );

}


function totalInvestimentos() {

  return DB.investimentos.reduce(
    (total, item) =>
      total + Number(item.valor || 0),
    0
  );

}


function saldoDoMes() {

  return (
    totalReceitas() -
    totalDespesas()
  );

}


function percentualEconomizado() {

  const receitas =
    totalReceitas();

  if (receitas <= 0) {
    return 0;
  }

  return (
    saldoDoMes() /
    receitas
  ) * 100;

}


function totalCustosFixos() {

  return DB.custosFixos

    .filter(item => item.ativo !== false)

    .reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    );

}


function totalDesejos() {

  return DB.desejos.reduce(
    (total, item) =>
      total + Number(item.valor || 0),
    0
  );

}


function totalGuardadoDesejos() {

  return DB.desejos.reduce(
    (total, item) =>
      total + Number(item.guardado || 0),
    0
  );

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

  const receitas =
    totalReceitas();

  const despesas =
    totalDespesas();

  const saldo =
    saldoDoMes();

  const investimentos =
    totalInvestimentos();

  const economia =
    percentualEconomizado();


  return `

    <div class="page">

      <div class="cards">

        <div class="card metric">

          <small>Receitas do mês</small>

          <strong class="green">
            ${moeda(receitas)}
          </strong>

          <span class="icon">
            💰
          </span>

        </div>


        <div class="card metric">

          <small>Despesas do mês</small>

          <strong class="red">
            ${moeda(despesas)}
          </strong>

          <span class="icon">
            ↘
          </span>

        </div>


        <div class="card metric">

          <small>Saldo disponível</small>

          <strong class="${saldo >= 0 ? "green" : "red"}">
            ${moeda(saldo)}
          </strong>

          <span class="icon">
            💵
          </span>

        </div>


        <div class="card metric">

          <small>Total investido</small>

          <strong class="purple">
            ${moeda(investimentos)}
          </strong>

          <span class="icon">
            📈
          </span>

        </div>

      </div>


      <div class="grid-2">


        <!-- ALERTAS -->

        <div class="panel">

          <h3>
            🔔 Alertas inteligentes
          </h3>

          ${renderAlertas()}

        </div>


        <!-- RESUMO -->

        <div class="panel">

          <h3>
            📊 Resumo do mês
          </h3>

          <div class="summary-list">

            <div>
              <span>Economia</span>

              <strong class="${
                economia >= 0
                  ? "green"
                  : "red"
              }">

                ${economia.toFixed(1)}%

              </strong>
            </div>


            <div>
              <span>Custos fixos</span>

              <strong>
                ${moeda(
                  totalCustosFixos()
                )}
              </strong>
            </div>


            <div>
              <span>Metas e desejos</span>

              <strong>
                ${moeda(
                  totalDesejos()
                )}
              </strong>
            </div>


            <div>
              <span>Já guardado</span>

              <strong class="green">
                ${moeda(
                  totalGuardadoDesejos()
                )}
              </strong>
            </div>

          </div>

        </div>

      </div>


      <!-- GASTOS POR CATEGORIA -->

      <div class="panel">

        <div class="panel-header">

          <h3>
            Gastos por categoria
          </h3>

          <span class="muted">
            Mês selecionado
          </span>

        </div>

        ${renderGastosCategorias()}

      </div>


    </div>

  `;

}


/* =========================================================
   ALERTAS
========================================================= */

function renderAlertas() {

  const alertas = [];


  if (saldoDoMes() < 0) {

    alertas.push(`
      <div class="alert danger">
        ⚠️ Seu saldo mensal está negativo.
      </div>
    `);

  }


  if (
    totalReceitas() > 0 &&
    percentualEconomizado() < 0
  ) {

    alertas.push(`
      <div class="alert danger">
        ⚠️ Suas despesas ultrapassaram
        suas receitas.
      </div>
    `);

  }


  DB.limites.forEach(limite => {

    const gasto =
      despesasDoMes()

        .filter(
          despesa =>
            despesa.categoria ===
            limite.categoria
        )

        .reduce(
          (total, despesa) =>
            total +
            Number(despesa.valor || 0),
          0
        );


    if (
      Number(limite.limite) > 0 &&
      gasto >= Number(limite.limite)
    ) {

      alertas.push(`
        <div class="alert warning">
          ⚠️ O limite de
          ${escapar(limite.categoria)}
          foi atingido ou ultrapassado.
        </div>
      `);

    }

  });


  if (
    totalReceitas() > 0 &&
    percentualEconomizado() >= 20
  ) {

    alertas.push(`
      <div class="alert">
        ✅ Excelente! Você está economizando
        ${percentualEconomizado().toFixed(1)}%
        da sua renda.
      </div>
    `);

  }


  if (alertas.length === 0) {

    return `
      <div class="alert">
        ✅ Nenhum alerta financeiro
        importante no momento.
      </div>
    `;

  }


  return alertas.join("");

}


/* =========================================================
   GASTOS POR CATEGORIA
========================================================= */

function renderGastosCategorias() {

  const categorias = {};


  despesasDoMes().forEach(despesa => {

    const categoria =
      despesa.categoria ||
      "Outros";

    if (!categorias[categoria]) {

      categorias[categoria] = 0;

    }

    categorias[categoria] +=
      Number(despesa.valor || 0);

  });


  const total =
    totalDespesas();


  const lista =
    Object.entries(categorias)
      .sort(
        (a, b) =>
          b[1] - a[1]
      );


  if (lista.length === 0) {

    return `
      <div class="empty">
        Nenhuma despesa registrada
        neste mês.
      </div>
    `;

  }


  return lista.map(
    ([categoria, valor]) => {

      const percentual =
        total > 0
          ? (valor / total) * 100
          : 0;


      return `

        <div class="legend">

          <div class="limit-line">

            <strong>
              ${escapar(categoria)}
            </strong>

            <span>
              ${moeda(valor)}
            </span>

          </div>


          <div class="progress">

            <i
              style="
                width:${Math.min(
                  percentual,
                  100
                )}%
              "
            ></i>

          </div>


          <small class="muted">

            ${percentual.toFixed(1)}%
            das despesas

          </small>

        </div>

      `;

    }
  ).join("");

}


/* =========================================================
   PLACEHOLDERS DAS NOVAS ÁREAS
========================================================= */

function renderFinanceiro() {

  return `

    <div class="page">

      <div class="panel">

        <h3>
          💳 Meu Financeiro
        </h3>

        <p class="muted">

          Aqui ficará o controle completo
          de receitas, despesas e custos fixos.

        </p>

        <div class="empty">

          Módulo financeiro em construção.

        </div>

      </div>

    </div>

  `;

}


function renderPlanejamento() {

  return `

    <div class="page">

      <div class="panel">

        <h3>
          📋 Planejamento
        </h3>

        <p class="muted">

          Planejamento mensal,
          orçamento e projeções.

        </p>

        <div class="empty">

          Módulo de planejamento
          em construção.

        </div>

      </div>

    </div>

  `;

}


function renderTarefas() {

  return `

    <div class="page">

      <div class="panel">

        <h3>
          ✓ Tarefas
        </h3>

        <p class="muted">

          Checklist financeiro,
          pessoal e profissional.

        </p>

        <div class="empty">

          Módulo de tarefas
          em construção.

        </div>

      </div>

    </div>

  `;

}


function renderRelatorios() {

  return `

    <div class="page">

      <div class="panel">

        <h3>
          📊 Relatórios
        </h3>

        <p class="muted">

          Comparação entre meses,
          evolução financeira e indicadores.

        </p>

        <div class="empty">

          Módulo de relatórios
          em construção.

        </div>

      </div>

    </div>

  `;

}


/* =========================================================
   PÁGINAS
========================================================= */

const paginas = {

  dashboard: {

    titulo: "Dashboard",

    subtitulo:
      "Acompanhe sua evolução financeira",

    render:
      renderDashboard

  },


  financeiro: {

    titulo:
      "Meu Financeiro",

    subtitulo:
      "Controle suas receitas, despesas e contas",

    render:
      renderFinanceiro

  },


  planejamento: {

    titulo:
      "Planejamento",

    subtitulo:
      "Prepare seu orçamento e seus próximos meses",

    render:
      renderPlanejamento

  },


  tarefas: {

    titulo:
      "Tarefas",

    subtitulo:
      "Organize suas ações financeiras e pessoais",

    render:
      renderTarefas

  },


  relatorios: {

    titulo:
      "Relatórios",

    subtitulo:
      "Analise sua evolução financeira",

    render:
      renderRelatorios

  }

};


/* =========================================================
   ROTEAMENTO
========================================================= */

let paginaAtual = "dashboard";


function carregarPagina(nome) {

  if (!paginas[nome]) {

    nome = "dashboard";

  }


  paginaAtual = nome;


  const content =
    document.getElementById("content");

  const pageTitle =
    document.getElementById("pageTitle");

  const pageSubtitle =
    document.getElementById("pageSubtitle");


  if (!content) {

    console.error(
      "Elemento #content não encontrado."
    );

    return;

  }


  /*
   * Renderiza a página.
   */

  content.innerHTML =
    paginas[nome].render();


  /*
   * Atualiza título.
   */

  if (pageTitle) {

    pageTitle.textContent =
      paginas[nome].titulo;

  }


  if (pageSubtitle) {

    pageSubtitle.textContent =
      paginas[nome].subtitulo;

  }


  /*
   * Atualiza menu.
   */

  document
    .querySelectorAll(".menu")
    .forEach(botao => {

      botao.classList.toggle(
        "active",
        botao.dataset.page === nome
      );

    });

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function configurarNavegacao() {

  document
    .querySelectorAll(".menu")
    .forEach(botao => {

      botao.addEventListener(
        "click",
        () => {

          const pagina =
            botao.dataset.page;

          carregarPagina(pagina);

        }
      );

    });

}


/* =========================================================
   SELETOR DE MÊS
========================================================= */

function configurarMes() {

  const seletor =
    document.getElementById(
      "monthSelect"
    );


  if (!seletor) {
    return;
  }


  const mes =
    obterMesAtual();


  seletor.value =
    String(mes);


  seletor.addEventListener(
    "change",
    () => {

      DB.config.mesAtual =
        Number(seletor.value);

      DB.config.anoAtual =
        2026;

      salvarBanco();

      carregarPagina(
        paginaAtual
      );

      mostrarToast(
        `Período alterado para ${seletor.options[
          seletor.selectedIndex
        ].text}`
      );

    }
  );

}


/* =========================================================
   NOTIFICAÇÕES
========================================================= */

function configurarNotificacoes() {

  const botao =
    document.getElementById(
      "notificationButton"
    );


  if (!botao) {
    return;
  }


  botao.addEventListener(
    "click",
    () => {

      const quantidade =
        renderQuantidadeAlertas();


      if (quantidade > 0) {

        mostrarToast(
          `Você possui ${quantidade} alerta(s) financeiro(s).`
        );

      } else {

        mostrarToast(
          "Nenhum alerta financeiro importante."
        );

      }

    }
  );

}


function renderQuantidadeAlertas() {

  let quantidade = 0;


  if (saldoDoMes() < 0) {

    quantidade++;

  }


  DB.limites.forEach(limite => {

    const gasto =
      despesasDoMes()

        .filter(
          despesa =>
            despesa.categoria ===
            limite.categoria
        )

        .reduce(
          (total, despesa) =>
            total +
            Number(despesa.valor || 0),
          0
        );


    if (
      Number(limite.limite) > 0 &&
      gasto >= Number(limite.limite)
    ) {

      quantidade++;

    }

  });


  return quantidade;

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function iniciarAplicacao() {

  console.log(
    "AUREA iniciada."
  );

  console.log(
    "Banco:",
    DB
  );


  configurarNavegacao();

  configurarMes();

  configurarNotificacoes();

  carregarPagina(
    "dashboard"
  );

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  iniciarAplicacao
);


/* =========================================================
   EXPOSIÇÃO GLOBAL
   Útil para os próximos módulos
========================================================= */

window.AUREA = {

  DB,

  salvarBanco,

  carregarPagina,

  gerarId,

  moeda,

  escapar,

  obterMesAtual,

  obterAnoAtual,

  pertenceAoMes,

  totalReceitas,

  totalDespesas,

  totalInvestimentos,

  saldoDoMes,

  percentualEconomizado,

  mostrarToast

};
