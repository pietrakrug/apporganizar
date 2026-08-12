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
   PERÍODO SELECIONADO
========================================================= */

function obterMesSelecionado() {

  if (!DB.config) {
    DB.config = {};
  }

  return Number(
    DB.config.mes ??
    new Date().getMonth()
  );
}


function obterAnoSelecionado() {

  if (!DB.config) {
    DB.config = {};
  }

  return Number(
    DB.config.ano ??
    new Date().getFullYear()
  );
}


/* =========================================================
   VERIFICAR PERÍODO
========================================================= */

function pertenceAoPeriodo(item) {

  if (!item) {
    return false;
  }

  const mes = obterMesSelecionado();
  const ano = obterAnoSelecionado();

  /*
    Registros que possuem mes e ano
  */

  if (
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
    que possuem apenas uma data
  */

  const dataReferencia =
    item.dataRecebimento ||
    item.dataPagamento ||
    item.vencimento ||
    item.data;

  if (dataReferencia) {

    const data =
      new Date(dataReferencia);

    if (
      Number.isNaN(
        data.getTime()
      )
    ) {
      return false;
    }

    return (
      data.getMonth() === mes &&
      data.getFullYear() === ano
    );

  }

  /*
    Registros sem período não
    pertencem ao mês.
  */

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
        total + Number(item.valor || 0),
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
        total + Number(item.valor || 0),
      0
    );
}


/* =========================================================
   INVESTIMENTOS / APORTES
========================================================= */

function investimentosDoMes() {

  /*
    Consideramos apenas investimentos
    que possuem período definido.
  */

  return (DB.investimentos || [])
    .filter(pertenceAoPeriodo)
    .reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    );
}


/* =========================================================
   PATRIMÔNIO TOTAL
========================================================= */

function totalInvestido() {

  return (DB.investimentos || [])
    .reduce(
      (total, item) =>
        total + Number(item.valor || 0),
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
   PERCENTUAL ECONOMIZADO
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
   DESEJOS
========================================================= */

function totalGuardadoDesejos() {

  return (DB.desejos || [])
    .reduce(
      (total, item) =>
        total +
        Number(item.guardado || 0),
      0
    );
}


function totalDesejos() {

  return (DB.desejos || [])
    .reduce(
      (total, item) =>
        total +
        Number(item.valor || 0),
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
        item.categoria ||
        "Outros";

      if (
        !categorias[categoria]
      ) {
        categorias[categoria] = 0;
      }

      categorias[categoria] +=
        Number(item.valor || 0);

    });

  return categorias;
}


/* =========================================================
   GASTO DE UMA CATEGORIA
========================================================= */

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
   CARDS PRINCIPAIS
========================================================= */

function renderCards() {

  const receitas =
    receitasDoMes();

  const despesas =
    despesasDoMes();

  const saldo =
    saldoDoMes();

  const patrimonio =
    totalInvestido();

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
          Total investido
        </small>

        <strong class="purple">
          ${moeda(patrimonio)}
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

  const receitas =
    receitasDoMes();

  const despesas =
    despesasDoMes();

  const saldo =
    saldoDoMes();


  /*
    SALDO NEGATIVO
  */

  if (saldo < 0) {

    alertas.push(`

      <div class="alert danger">

        ⚠️ Seu saldo mensal está negativo.

      </div>

    `);

  }


  /*
    UTILIZAÇÃO DA RENDA
  */

  if (receitas > 0) {

    const percentual =
      despesas /
      receitas *
      100;


    if (percentual >= 100) {

      alertas.push(`

        <div class="alert danger">

          🚨 Suas despesas já
          ultrapassaram sua renda.

        </div>

      `);

    }

    else if (percentual >= 80) {

      alertas.push(`

        <div class="alert warning">

          ⚠️ Você já utilizou
          ${percentual.toFixed(1)}%
          da sua renda.

        </div>

      `);

    }

    else {

      alertas.push(`

        <div class="alert">

          ✅ Você está utilizando
          ${percentual.toFixed(1)}%
          da sua renda.

        </div>

      `);

    }

  }


  /*
    CONTAS PRÓXIMAS DO VENCIMENTO
  */

  const hoje =
    new Date();

  const proximasContas =
    (DB.despesas || [])
      .filter(pertenceAoPeriodo)
      .filter(item => {

        if (
          item.status === "paga"
        ) {
          return false;
        }

        if (!item.vencimento) {
          return false;
        }

        const vencimento =
          new Date(
            item.vencimento +
            "T00:00:00"
          );

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

        return (
          diferenca >= 0 &&
          diferenca <= 3
        );

      });


  proximasContas
    .slice(0, 3)
    .forEach(item => {

      const vencimento =
        new Date(
          item.vencimento +
          "T00:00:00"
        );

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


      alertas.push(`

        <div class="alert warning">

          ⚠️ A conta
          <strong>
            ${escapar(item.descricao)}
          </strong>
          vence
          ${
            diferenca === 0
              ? "hoje"
              : `em ${diferenca} dias`
          }.

        </div>

      `);

    });


  /*
    LIMITES
  */

  const limites =
    (DB.limites || [])
      .filter(pertenceAoPeriodo);


  limites.forEach(item => {

    const limite =
      Number(item.limite || 0);

    if (limite <= 0) {
      return;
    }

    const gasto =
      gastoDaCategoria(
        item.categoria
      );

    const percentual =
      gasto /
      limite *
      100;


    if (
      percentual >= 100
    ) {

      alertas.push(`

        <div class="alert danger">

          🚨 O limite de
          <strong>
            ${escapar(item.categoria)}
          </strong>
          foi ultrapassado.

        </div>

      `);

    }

    else if (
      percentual >= 80
    ) {

      alertas.push(`

        <div class="alert warning">

          ⚠️ Você já utilizou
          ${percentual.toFixed(1)}%
          do limite de
          ${escapar(item.categoria)}.

        </div>

      `);

    }

  });


  /*
    METAS
  */

  const metas =
    (DB.desejos || [])
      .filter(item =>
        Number(item.guardado || 0) <
        Number(item.valor || 0)
      );


  if (
    metas.length > 0
  ) {

    const primeiraMeta =
      metas[0];

    const falta =
      Number(
        primeiraMeta.valor || 0
      ) -
      Number(
        primeiraMeta.guardado || 0
      );


    alertas.push(`

      <div class="alert">

        🎯 Faltam
        <strong>
          ${moeda(falta)}
        </strong>
        para alcançar
        ${escapar(
          primeiraMeta.nome
        )}.

      </div>

    `);

  }


  /*
    NENHUM ALERTA
  */

  if (
    alertas.length === 0
  ) {

    return `

      <div class="alert">

        ✅ Sua organização
        financeira está em dia.

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
        (a, b) =>
          b[1] - a[1]
      )
      .map(
        ([categoria, valor]) => {

          const percentual =
            total > 0
              ? valor /
                total *
                100
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

                  ${escapar(
                    categoria
                  )}

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

                Nenhuma despesa
                cadastrada neste período.

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
              style="
                height:90%
              "
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

    titulo:
      "Dashboard",

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
        "Aqui ficarão suas receitas, despesas e custos fixos.",
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
        "Planeje receitas, despesas, limites, investimentos e metas.",
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
        "Organize tarefas diárias, recorrentes e pendências.",
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
        "Compare seus meses e acompanhe sua evolução.",
        "📊"
      )

  },


  /*
    Mantemos estas páginas temporariamente
    para compatibilidade com versões anteriores
    do index.html.
  */

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


  /*
    Renderização
  */

  try {

    conteudo.innerHTML =
      paginas[nome].render();

  }

  catch (erro) {

    console.error(
      "Erro ao renderizar página:",
      erro
    );


    conteudo.innerHTML = `

      <div class="panel">

        <h3>
          Erro ao carregar a página
        </h3>

        <p class="muted">

          Ocorreu um erro ao
          renderizar esta área.

        </p>

      </div>

    `;

    return;

  }


  /*
    Título
  */

  if (titulo) {

    titulo.textContent =
      paginas[nome].titulo;

  }


  /*
    Subtítulo
  */

  if (subtitulo) {

    subtitulo.textContent =
      paginas[nome].subtitulo;

  }


  /*
    Menu ativo
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


  const mesAtual =
    obterMesSelecionado();


  if (
    mesAtual >= 0 &&
    mesAtual <
      seletor.options.length
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


      /*
        Um único padrão:
        mes + ano
      */

      DB.config.mes =
        mes;


      DB.config.ano =
        obterAnoSelecionado();


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


  botao.addEventListener(
    "click",
    () => {

      const quantidade =
        gerarQuantidadeAlertas();


      if (
        quantidade === 0
      ) {

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


  /*
    Saldo negativo
  */

  if (
    saldoDoMes() < 0
  ) {

    quantidade++;

  }


  /*
    Renda comprometida
  */

  const receitas =
    receitasDoMes();

  const despesas =
    despesasDoMes();


  if (
    receitas > 0 &&
    despesas /
      receitas >=
      0.8
  ) {

    quantidade++;

  }


  /*
    Limites
  */

  (DB.limites || [])
    .filter(pertenceAoPeriodo)
    .forEach(item => {

      const limite =
        Number(
          item.limite || 0
        );


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
    Contas próximas
  */

  const hoje =
    new Date();


  (DB.despesas || [])
    .filter(pertenceAoPeriodo)
    .forEach(item => {

      if (
        item.status === "paga" ||
        !item.vencimento
      ) {
        return;
      }


      const vencimento =
        new Date(
          item.vencimento +
          "T00:00:00"
        );


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

}

else {

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

  totalInvestido,

  gastosPorCategoria

};
