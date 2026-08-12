"use strict";

/* =========================================================
   AUREA
   MAIN.JS
   Controlador principal da aplicação
========================================================= */

import {
  DB,
  salvarBanco
} from "./database.js";

import {
  moeda,
  escapar,
  percentual
} from "./utils.js";

import {
  renderFinanceiro
} from "./financeiro.js";


/* =========================================================
   ESTADO
========================================================= */

let paginaAtual = "dashboard";


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
    window.aureaToastTimer
  );

  window.aureaToastTimer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2500);
}


/* =========================================================
   PERÍODO SELECIONADO
========================================================= */

function obterMesSelecionado() {

  if (!DB.config) {
    DB.config = {};
  }

  return Number(
    DB.config.mes ??
    DB.config.mesAtual ??
    new Date().getMonth()
  );
}


function obterAnoSelecionado() {

  if (!DB.config) {
    DB.config = {};
  }

  return Number(
    DB.config.ano ??
    DB.config.anoAtual ??
    new Date().getFullYear()
  );
}


function pertenceAoPeriodo(item) {

  const mes =
    obterMesSelecionado();

  const ano =
    obterAnoSelecionado();


  if (
    item &&
    item.mes !== undefined &&
    item.ano !== undefined
  ) {

    return (
      Number(item.mes) === mes &&
      Number(item.ano) === ano
    );

  }


  /*
    Compatibilidade com registros
    que possuem somente uma data.
  */

  const dataReferencia =
    item?.dataRecebimento ||
    item?.dataPagamento ||
    item?.data ||
    item?.vencimento;


  if (dataReferencia) {

    const data =
      new Date(
        String(dataReferencia).length === 10
          ? dataReferencia + "T00:00:00"
          : dataReferencia
      );


    if (!Number.isNaN(data.getTime())) {

      return (
        data.getMonth() === mes &&
        data.getFullYear() === ano
      );

    }

  }

  return false;
}


/* =========================================================
   RECEITAS
========================================================= */

function receitasDoMes() {

  return (DB.receitas || [])
    .filter(pertenceAoPeriodo)
    .reduce(
      (total, item) =>
        total +
        Number(item.valor || 0),
      0
    );
}


/* =========================================================
   DESPESAS
========================================================= */

function despesasDoMes() {

  return (DB.despesas || [])
    .filter(pertenceAoPeriodo)
    .reduce(
      (total, item) =>
        total +
        Number(item.valor || 0),
      0
    );
}


/* =========================================================
   INVESTIMENTOS
========================================================= */

function investimentosDoMes() {

  return (DB.investimentos || [])
    .filter(pertenceAoPeriodo)
    .reduce(
      (total, item) =>
        total +
        Number(item.valor || 0),
      0
    );
}


/* =========================================================
   SALDO
========================================================= */

function saldoDoMes() {

  return (
    receitasDoMes() -
    despesasDoMes()
  );

}


/* =========================================================
   ECONOMIA
========================================================= */

function percentualEconomizado() {

  const receitas =
    receitasDoMes();


  if (receitas <= 0) {
    return 0;
  }


  return (
    saldoDoMes() /
    receitas
  ) * 100;

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
        item.categoria ||
        "Outros";


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
    .filter(
      item =>
        item.categoria === categoria
    )
    .reduce(
      (total, item) =>
        total +
        Number(item.valor || 0),
      0
    );

}


/* =========================================================
   CARDS DO DASHBOARD
========================================================= */

function renderCards() {

  const receitas =
    receitasDoMes();

  const despesas =
    despesasDoMes();

  const saldo =
    saldoDoMes();

  const investimentos =
    investimentosDoMes();

  const economia =
    percentualEconomizado();


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
          ${
            saldo >= 0
              ? "↗"
              : "⚠️"
          }
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


      <div class="card metric">

        <small>
          Renda economizada
        </small>

        <strong
          class="${
            economia >= 0
              ? "green"
              : "red"
          }"
        >
          ${economia.toFixed(1)}%
        </strong>

        <span class="icon">
          💎
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


  const receitas =
    receitasDoMes();

  const despesas =
    despesasDoMes();

  const saldo =
    saldoDoMes();


  /* -------------------------------------------------------
     SALDO NEGATIVO
  ------------------------------------------------------- */

  if (saldo < 0) {

    alertas.push(`

      <div class="alert danger">

        ⚠️ Seu saldo mensal está negativo em

        <strong>
          ${moeda(Math.abs(saldo))}
        </strong>.

      </div>

    `);

  }


  /* -------------------------------------------------------
     USO DA RENDA
  ------------------------------------------------------- */

  if (receitas > 0) {

    const percentualUso =
      despesas /
      receitas *
      100;


    if (percentualUso >= 100) {

      alertas.push(`

        <div class="alert danger">

          🚨 Suas despesas já ultrapassaram
          sua renda.

        </div>

      `);

    }

    else if (percentualUso >= 80) {

      alertas.push(`

        <div class="alert warning">

          ⚠️ Você já utilizou

          <strong>
            ${percentualUso.toFixed(1)}%
          </strong>

          da sua renda.

        </div>

      `);

    }

  }


  /* -------------------------------------------------------
     LIMITES
  ------------------------------------------------------- */

  (DB.limites || [])
    .filter(pertenceAoPeriodo)
    .forEach(item => {

      const limite =
        Number(item.limite || 0);


      if (limite <= 0) {
        return;
      }


      const gasto =
        gastoDaCategoria(
          item.categoria
        );


      const uso =
        gasto /
        limite *
        100;


      if (uso >= 100) {

        alertas.push(`

          <div class="alert danger">

            🚨 O limite de

            <strong>
              ${escapar(
                item.categoria
              )}
            </strong>

            foi ultrapassado.

            Gasto:
            ${moeda(gasto)}

            /
            Limite:
            ${moeda(limite)}

          </div>

        `);

      }

      else if (uso >= 80) {

        alertas.push(`

          <div class="alert warning">

            ⚠️ Você já utilizou

            <strong>
              ${uso.toFixed(1)}%
            </strong>

            do limite de

            <strong>
              ${escapar(
                item.categoria
              )}
            </strong>.

          </div>

        `);

      }

    });


  /* -------------------------------------------------------
     CONTAS PRÓXIMAS DO VENCIMENTO
  ------------------------------------------------------- */

  const hoje =
    new Date();


  (DB.despesas || [])
    .filter(pertenceAoPeriodo)
    .forEach(despesa => {

      if (
        despesa.status === "paga" ||
        !despesa.vencimento
      ) {
        return;
      }


      const vencimento =
        new Date(
          despesa.vencimento +
          "T00:00:00"
        );


      if (
        Number.isNaN(
          vencimento.getTime()
        )
      ) {
        return;
      }


      const diferenca =
        Math.ceil(
          (
            vencimento -
            hoje
          ) /
          (
            1000 *
            60 *
            60 *
            24
          )
        );


      if (
        diferenca >= 0 &&
        diferenca <= 3
      ) {

        alertas.push(`

          <div class="alert warning">

            ⚠️ A conta

            <strong>
              ${escapar(
                despesa.descricao
              )}
            </strong>

            vence

            ${
              diferenca === 0
                ? "hoje"
                : `em ${diferenca} dia${
                    diferenca > 1
                      ? "s"
                      : ""
                  }`
            }.

          </div>

        `);

      }

    });


  /* -------------------------------------------------------
     METAS
  ------------------------------------------------------- */

  (DB.desejos || [])
    .filter(
      item =>
        Number(item.guardado || 0) <
        Number(item.valor || 0)
    )
    .slice(0, 2)
    .forEach(meta => {

      const falta =
        Number(meta.valor || 0) -
        Number(meta.guardado || 0);


      alertas.push(`

        <div class="alert">

          🎯 Faltam

          <strong>
            ${moeda(falta)}
          </strong>

          para alcançar

          <strong>
            ${escapar(meta.nome)}
          </strong>.

        </div>

      `);

    });


  /* -------------------------------------------------------
     ELOGIO
  ------------------------------------------------------- */

  if (
    receitas > 0 &&
    saldo > 0 &&
    despesas / receitas < 0.5
  ) {

    alertas.push(`

      <div class="alert success">

        ✅ Excelente! Você está mantendo
        suas despesas abaixo de 50% da renda
        neste mês.

      </div>

    `);

  }


  /* -------------------------------------------------------
     SEM ALERTAS
  ------------------------------------------------------- */

  if (alertas.length === 0) {

    return `

      <div class="alert success">

        ✅ Sua organização financeira
        está em dia.

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

  const percentual =
    percentualEconomizado();


  const categoriasHTML =
    Object.entries(categorias)
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .map(
        ([categoria, valor]) => {

          const porcentagem =
            total > 0
              ? (
                  valor /
                  total
                ) * 100
              : 0;


          return `

            <div
              class="legend"
              data-categoria="${escapar(
                categoria
              )}"
              style="cursor:pointer;"
            >

              <span>

                <label>

                  <i class="dot"></i>

                  ${escapar(
                    categoria
                  )}

                </label>

                <strong>
                  ${moeda(valor)}
                </strong>

              </span>


              <div class="progress">

                <i
                  style="
                    width:${Math.min(
                      porcentagem,
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


  const receitas =
    receitasDoMes();

  const despesas =
    despesasDoMes();

  const saldo =
    saldoDoMes();


  const alturaDespesas =
    receitas > 0
      ? despesas /
        receitas *
        90
      : 6;


  const alturaSaldo =
    receitas > 0
      ? Math.max(
          0,
          saldo
        ) /
        receitas *
        90
      : 6;


  return `

    <div class="page">

      ${renderCards()}


      <div class="grid-2">


        <!-- ALERTAS -->

        <div class="panel">

          <h3>
            🔔 Alertas inteligentes
          </h3>

          <div class="alerts-list">

            ${gerarAlertas()}

          </div>

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
                    alturaDespesas
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
                    alturaSaldo
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
   PÁGINA EM CONSTRUÇÃO
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
            style="margin-top:25px;"
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

    titulo:
      "Dashboard",

    subtitulo:
      "Acompanhe sua evolução financeira",

    render:
      renderDashboard

  },


  /* =====================================================
     FINANCEIRO — MÓDULO REAL
  ===================================================== */

  financeiro: {

    titulo:
      "Meu Financeiro",

    subtitulo:
      "Controle suas receitas e despesas",

    modulo:
      "financeiro"

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


  paginaAtual =
    nome;


  const conteudo =
    document.getElementById(
      "content"
    );


  const titulo =
    document.getElementById(
      "pageTitle"
    );


  const subtitulo =
    document.getElementById(
      "pageSubtitle"
    );


  if (!conteudo) {

    console.error(
      "Elemento #content não encontrado."
    );

    return;
  }


  /* =====================================================
     TÍTULO
  ===================================================== */

  if (titulo) {

    titulo.textContent =
      paginas[nome].titulo;

  }


  /* =====================================================
     SUBTÍTULO
  ===================================================== */

  if (subtitulo) {

    subtitulo.textContent =
      paginas[nome].subtitulo;

  }


  /* =====================================================
     MENU ATIVO
  ===================================================== */

  document
    .querySelectorAll(".menu")
    .forEach(botao => {

      botao.classList.toggle(
        "active",
        botao.dataset.page === nome
      );

    });


  /* =====================================================
     MÓDULO FINANCEIRO
  ===================================================== */

  if (
    paginas[nome].modulo ===
    "financeiro"
  ) {

    renderFinanceiro();

    return;

  }


  /* =====================================================
     PÁGINAS NORMAIS
  ===================================================== */

  if (
    typeof paginas[nome].render ===
    "function"
  ) {

    conteudo.innerHTML =
      paginas[nome].render();

  }


  /* =====================================================
     EVENTOS DO DASHBOARD
  ===================================================== */

  configurarCategoriasDashboard();

}


/* =========================================================
   CATEGORIAS CLICÁVEIS
========================================================= */

function configurarCategoriasDashboard() {

  document
    .querySelectorAll(
      ".legend[data-categoria]"
    )
    .forEach(elemento => {

      elemento.addEventListener(
        "click",
        () => {

          const categoria =
            elemento.dataset.categoria;


          mostrarToast(
            `Categoria: ${categoria} — ${moeda(
              gastoDaCategoria(
                categoria
              )
            )}`
          );

        }
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


          carregarPagina(
            pagina
          );

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
    obterMesSelecionado();


  if (
    mes >= 0 &&
    mes < seletor.options.length
  ) {

    seletor.value =
      String(mes);

  }


  /*
    Evita adicionar o mesmo listener
    caso a função seja chamada novamente.
  */

  if (
    seletor.dataset.aureaConfigured ===
    "true"
  ) {
    return;
  }


  seletor.dataset.aureaConfigured =
    "true";


  seletor.addEventListener(
    "change",
    () => {

      const novoMes =
        Number(
          seletor.value
        );


      if (!DB.config) {
        DB.config = {};
      }


      DB.config.mes =
        novoMes;

      DB.config.mesAtual =
        novoMes;


      salvarBanco();


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


  if (
    botao.dataset.aureaConfigured ===
    "true"
  ) {
    return;
  }


  botao.dataset.aureaConfigured =
    "true";


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
   QUANTIDADE DE ALERTAS
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
        gasto >=
          limite * 0.8
      ) {

        quantidade++;

      }

    });


  /*
    Contas próximas do vencimento
  */

  const hoje =
    new Date();


  (DB.despesas || [])
    .filter(pertenceAoPeriodo)
    .forEach(despesa => {

      if (
        despesa.status === "paga" ||
        !despesa.vencimento
      ) {
        return;
      }


      const vencimento =
        new Date(
          despesa.vencimento +
          "T00:00:00"
        );


      if (
        Number.isNaN(
          vencimento.getTime()
        )
      ) {
        return;
      }


      const diferenca =
        Math.ceil(
          (
            vencimento -
            hoje
          ) /
          (
            1000 *
            60 *
            60 *
            24
          )
        );


      if (
        diferenca >= 0 &&
        diferenca <= 3
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


  console.log(
    "Banco AUREA:",
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

  mostrarToast,

  receitasDoMes,

  despesasDoMes,

  saldoDoMes,

  investimentosDoMes,

  gastosPorCategoria

};
