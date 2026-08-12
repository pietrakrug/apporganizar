"use strict";

/* =========================================================
   AUREA
   MAIN.JS
   Controlador principal da aplicação
========================================================= */


/* =========================================================
   IMPORTAÇÃO DO BANCO
========================================================= */

import {
  DB,
  salvar,
  gerarId
} from "./database.js";


/* =========================================================
   ESTADO DA APLICAÇÃO
========================================================= */

let paginaAtual = "dashboard";


/* =========================================================
   UTILITÁRIOS
========================================================= */

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


function mostrarToast(mensagem) {

  const toast = document.getElementById("toast");

  if (!toast) {
    console.log(mensagem);
    return;
  }

  toast.textContent = mensagem;

  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


/* =========================================================
   DATA / PERÍODO
========================================================= */

function obterMesSelecionado() {

  if (!DB.config) {
    DB.config = {};
  }

  const mes = Number(
    DB.config.mesAtual ??
    DB.config.mes ??
    new Date().getMonth()
  );

  return mes;
}


function obterAnoSelecionado() {

  if (!DB.config) {
    DB.config = {};
  }

  return Number(
    DB.config.anoAtual ??
    DB.config.ano ??
    new Date().getFullYear()
  );
}


function pertenceAoPeriodo(item) {

  const mes = obterMesSelecionado();
  const ano = obterAnoSelecionado();

  if (item.mes !== undefined && item.ano !== undefined) {
    return (
      Number(item.mes) === mes &&
      Number(item.ano) === ano
    );
  }

  if (item.data) {

    const data = new Date(item.data);

    return (
      data.getMonth() === mes &&
      data.getFullYear() === ano
    );
  }

  return true;
}


/* =========================================================
   CÁLCULOS FINANCEIROS
========================================================= */

function receitasDoMes() {

  return (DB.receitas || [])
    .filter(pertenceAoPeriodo)
    .reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    );
}


function despesasDoMes() {

  return (DB.despesas || [])
    .filter(pertenceAoPeriodo)
    .reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    );
}


function investimentosDoMes() {

  return (DB.investimentos || [])
    .filter(pertenceAoPeriodo)
    .reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    );
}


function saldoDoMes() {

  return receitasDoMes() - despesasDoMes();
}


function percentualEconomizado() {

  const receitas = receitasDoMes();

  if (receitas <= 0) {
    return 0;
  }

  return (
    saldoDoMes() /
    receitas
  ) * 100;
}


function totalGuardadoDesejos() {

  return (DB.desejos || [])
    .reduce(
      (total, item) =>
        total + Number(item.guardado || 0),
      0
    );
}


function totalDesejos() {

  return (DB.desejos || [])
    .reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    );
}


/* =========================================================
   GASTOS POR CATEGORIA
========================================================= */

function gastosPorCategoria() {

  const categorias = {};

  (DB.despesas || [])
    .filter(pertenceAoPeriodo)
    .forEach(item => {

      const categoria =
        item.categoria || "Outros";

      if (!categorias[categoria]) {
        categorias[categoria] = 0;
      }

      categorias[categoria] +=
        Number(item.valor || 0);

    });

  return categorias;
}


function gastoDaCategoria(categoria) {

  return (DB.despesas || [])
    .filter(pertenceAoPeriodo)
    .filter(item =>
      item.categoria === categoria
    )
    .reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    );
}


/* =========================================================
   CARDS PRINCIPAIS
========================================================= */

function renderCards() {

  const receitas = receitasDoMes();
  const despesas = despesasDoMes();
  const saldo = saldoDoMes();
  const investimentos = investimentosDoMes();

  const classeSaldo =
    saldo >= 0
      ? "green"
      : "red";

  return `

    <div class="cards">

      <div class="card metric">

        <small>
          Receitas do mês
        </small>

        <strong class="green">
          ${moeda(receitas)}
        </strong>

        <span class="icon">
          💰
        </span>

      </div>


      <div class="card metric">

        <small>
          Despesas do mês
        </small>

        <strong class="red">
          ${moeda(despesas)}
        </strong>

        <span class="icon">
          ↘
        </span>

      </div>


      <div class="card metric">

        <small>
          Saldo disponível
        </small>

        <strong class="${classeSaldo}">
          ${moeda(saldo)}
        </strong>

        <span class="icon">
          ${saldo >= 0 ? "↗" : "⚠️"}
        </span>

      </div>


      <div class="card metric">

        <small>
          Investimentos
        </small>

        <strong class="purple">
          ${moeda(investimentos)}
        </strong>

        <span class="icon">
          📈
        </span>

      </div>

    </div>

  `;
}


/* =========================================================
   ALERTAS
========================================================= */

function gerarAlertas() {

  const alertas = [];

  const receitas = receitasDoMes();
  const despesas = despesasDoMes();
  const saldo = saldoDoMes();

  /* Saldo negativo */

  if (saldo < 0) {

    alertas.push(`
      <div class="alert danger">
        ⚠️ Seu saldo mensal está negativo.
      </div>
    `);

  }


  /* Percentual da renda utilizado */

  if (receitas > 0) {

    const percentual =
      despesas / receitas * 100;

    if (percentual >= 100) {

      alertas.push(`
        <div class="alert danger">
          🚨 Suas despesas já ultrapassaram sua renda.
        </div>
      `);

    } else if (percentual >= 80) {

      alertas.push(`
        <div class="alert warning">
          ⚠️ Você já utilizou
          ${percentual.toFixed(1)}%
          da sua renda.
        </div>
      `);

    } else {

      alertas.push(`
        <div class="alert">
          ✅ Você está utilizando
          ${percentual.toFixed(1)}%
          da sua renda.
        </div>
      `);

    }

  }


  /* Limites */

  const limitesExcedidos =
    (DB.limites || [])
      .filter(pertenceAoPeriodo)
      .filter(item => {

        const limite =
          Number(item.limite || 0);

        const gasto =
          gastoDaCategoria(
            item.categoria
          );

        return limite > 0 &&
          gasto > limite;

      });


  limitesExcedidos.forEach(item => {

    const gasto =
      gastoDaCategoria(
        item.categoria
      );

    const excesso =
      gasto - Number(item.limite);

    alertas.push(`
      <div class="alert warning">
        ⚠️ O limite de
        ${escapar(item.categoria)}
        foi ultrapassado em
        ${moeda(excesso)}.
      </div>
    `);

  });


  /* Metas */

  const metas =
    (DB.desejos || [])
      .filter(item =>
        Number(item.guardado || 0) <
        Number(item.valor || 0)
      );


  if (metas.length > 0) {

    const primeiraMeta =
      metas[0];

    const falta =
      Number(primeiraMeta.valor || 0) -
      Number(primeiraMeta.guardado || 0);

    alertas.push(`
      <div class="alert">
        🎯 Faltam
        ${moeda(falta)}
        para alcançar
        ${escapar(primeiraMeta.nome)}.
      </div>
    `);

  }


  /* Nenhum alerta */

  if (alertas.length === 0) {

    return `
      <div class="alert">
        ✅ Sua organização financeira está em dia.
      </div>
    `;

  }


  return alertas.join("");

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

  const categorias =
    gastosPorCategoria();

  const total =
    despesasDoMes();

  const categoriasHTML =
    Object.entries(categorias)
      .sort(
        (a, b) => b[1] - a[1]
      )
      .map(
        ([categoria, valor]) => {

          const percentual =
            total > 0
              ? valor / total * 100
              : 0;

          return `

            <div class="legend">

              <span>

                <label>

                  <i
                    class="dot"
                    style="
                      background:#765ce3
                    "
                  ></i>

                  ${escapar(categoria)}

                </label>

                ${moeda(valor)}

              </span>


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

            </div>

          `;

        }
      )
      .join("");


  const percentual =
    percentualEconomizado();


  return `

    <div class="page">

      ${renderCards()}


      <div class="grid-2">


        <!-- ALERTAS -->

        <div class="panel">

          <h3>
            🔔 Alertas inteligentes
          </h3>

          ${gerarAlertas()}

        </div>


        <!-- CATEGORIAS -->

        <div class="panel">

          <h3>
            📊 Gastos por categoria
          </h3>

          ${
            categoriasHTML ||

            `
              <div class="empty">
                Nenhuma despesa cadastrada
                neste período.
              </div>
            `
          }

        </div>

      </div>


      <!-- RESUMO -->

      <div class="panel">

        <div class="panel-header">

          <h3>
            Resumo financeiro
          </h3>

          <span class="muted">

            ${percentual.toFixed(1)}%
            da renda economizada

          </span>

        </div>


        <div class="chart">


          <div class="bar-box">

            <div
              class="bar"
              style="height:90%"
            ></div>

            <small>
              Receitas
            </small>

          </div>


          <div class="bar-box">

            <div
              class="bar expense"
              style="
                height:${Math.max(
                  6,
                  Math.min(
                    90,
                    receitasDoMes() > 0
                      ? despesasDoMes() /
                        receitasDoMes() *
                        90
                      : 6
                  )
                )}%
              "
            ></div>

            <small>
              Despesas
            </small>

          </div>


          <div class="bar-box">

            <div
              class="bar"
              style="
                height:${Math.max(
                  6,
                  Math.min(
                    90,
                    receitasDoMes() > 0
                      ? Math.max(
                          0,
                          saldoDoMes()
                        ) /
                        receitasDoMes() *
                        90
                      : 6
                  )
                )}%
              "
            ></div>

            <small>
              Saldo
            </small>

          </div>


        </div>

      </div>


    </div>

  `;

}


/* =========================================================
   PÁGINA TEMPORÁRIA
========================================================= */

function renderPaginaEmConstrucao(
  titulo,
  descricao,
  icone
) {

  return `

    <div class="page">

      ${renderCards()}


      <div class="panel">

        <div
          style="
            text-align:center;
            padding:60px 20px;
          "
        >

          <div
            style="
              font-size:48px;
              margin-bottom:20px;
            "
          >
            ${icone}
          </div>


          <h3>
            ${titulo}
          </h3>


          <p class="muted">
            ${descricao}
          </p>


          <div
            class="alert"
            style="
              margin-top:25px;
            "
          >
            🚧 Esta área será construída
            nos próximos módulos do AUREA.
          </div>

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
      "Controle suas receitas e despesas",

    render: () =>
      renderPaginaEmConstrucao(
        "Meu Financeiro",
        "Aqui ficarão receitas, despesas e custos fixos.",
        "💳"
      )

  },


  planejamento: {

    titulo:
      "Planejamento",

    subtitulo:
      "Prepare seus próximos meses",

    render: () =>
      renderPaginaEmConstrucao(
        "Planejamento",
        "Aqui você poderá planejar receitas, despesas, investimentos e metas.",
        "📋"
      )

  },


  tarefas: {

    titulo:
      "Tarefas",

    subtitulo:
      "Organize suas tarefas financeiras e pessoais",

    render: () =>
      renderPaginaEmConstrucao(
        "Tarefas",
        "Aqui ficará seu checklist diário e recorrente.",
        "✓"
      )

  },


  relatorios: {

    titulo:
      "Relatórios",

    subtitulo:
      "Compare sua evolução financeira",

    render: () =>
      renderPaginaEmConstrucao(
        "Relatórios",
        "Aqui ficarão os comparativos mensais e indicadores históricos.",
        "📊"
      )

  },


  investimentos: {

    titulo:
      "Investimentos",

    subtitulo:
      "Acompanhe seu patrimônio e seus aportes",

    render: () =>
      renderPaginaEmConstrucao(
        "Investimentos",
        "Aqui ficará o controle dos seus investimentos.",
        "📈"
      )

  },


  limites: {

    titulo:
      "Limites",

    subtitulo:
      "Defina limites para seus gastos",

    render: () =>
      renderPaginaEmConstrucao(
        "Limites",
        "Aqui ficarão os limites mensais por categoria.",
        "🎯"
      )

  },


  desejos: {

    titulo:
      "Desejos",

    subtitulo:
      "Transforme seus desejos em planos financeiros",

    render: () =>
      renderPaginaEmConstrucao(
        "Desejos",
        "Aqui ficarão suas metas de compra e planos de ação.",
        "✨"
      )

  }

};


/* =========================================================
   CARREGAR PÁGINA
========================================================= */

function carregarPagina(nome) {

  if (!paginas[nome]) {
    nome = "dashboard";
  }


  paginaAtual = nome;


  const conteudo =
    document.getElementById("content");

  const titulo =
    document.getElementById("pageTitle");

  const subtitulo =
    document.getElementById("pageSubtitle");


  if (!conteudo) {

    console.error(
      'Elemento #content não encontrado.'
    );

    return;

  }


  /* Renderização */

  conteudo.innerHTML =
    paginas[nome].render();


  /* Título */

  if (titulo) {

    titulo.textContent =
      paginas[nome].titulo;

  }


  /* Subtítulo */

  if (subtitulo) {

    subtitulo.textContent =
      paginas[nome].subtitulo;

  }


  /* Menu ativo */

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


  const mesAtual =
    obterMesSelecionado();


  if (
    mesAtual >= 0 &&
    mesAtual < seletor.options.length
  ) {

    seletor.value =
      String(mesAtual);

  }


  seletor.addEventListener(
    "change",
    () => {

      const mes =
        Number(
          seletor.value
        );


      if (!DB.config) {
        DB.config = {};
      }


      DB.config.mesAtual =
        mes;

      DB.config.mes =
        mes;


      salvar();


      carregarPagina(
        paginaAtual
      );


      mostrarToast(
        "Período alterado para " +
        seletor.options[
          seletor.selectedIndex
        ].text
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
        gerarQuantidadeAlertas();


      if (quantidade === 0) {

        mostrarToast(
          "Nenhum alerta no momento."
        );

        return;

      }


      mostrarToast(
        quantidade === 1
          ? "Você possui 1 alerta."
          : `Você possui ${quantidade} alertas.`
      );

    }
  );

}


/* =========================================================
   CONTADOR DE ALERTAS
========================================================= */

function gerarQuantidadeAlertas() {

  let quantidade = 0;


  if (saldoDoMes() < 0) {
    quantidade++;
  }


  const receitas =
    receitasDoMes();

  const despesas =
    despesasDoMes();


  if (
    receitas > 0 &&
    despesas / receitas >= 0.8
  ) {

    quantidade++;

  }


  (DB.limites || [])
    .filter(pertenceAoPeriodo)
    .forEach(item => {

      const limite =
        Number(item.limite || 0);

      const gasto =
        gastoDaCategoria(
          item.categoria
        );


      if (
        limite > 0 &&
        gasto >= limite * 0.8
      ) {

        quantidade++;

      }

    });


  return quantidade;

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function iniciarApp() {

  console.log(
    "AUREA iniciado."
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

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    iniciarApp
  );

} else {

  iniciarApp();

}


/* =========================================================
   EXPORTAÇÕES
========================================================= */

export {

  carregarPagina,

  moeda,

  mostrarToast,

  receitasDoMes,

  despesasDoMes,

  saldoDoMes,

  investimentosDoMes,

  gastosPorCategoria

};
