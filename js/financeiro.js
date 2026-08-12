"use strict";

/* =========================================================
   AUREA
   FINANCEIRO.JS
   Módulo de receitas, despesas e custos fixos
========================================================= */

import {
  DB,
  salvarBanco,
  adicionarRegistro,
  atualizarRegistro,
  excluirRegistro
} from "./database.js";

import {
  moeda,
  escapar,
  dataAtual,
  formatarData,
  valorValido,
  campoPreenchido
} from "./utils.js";


/* =========================================================
   ESTADO
========================================================= */

let abaFinanceiro = "despesas";


/* =========================================================
   TOAST
========================================================= */

function toastFinanceiro(mensagem) {

  const toast = document.getElementById("toast");

  if (!toast) {
    console.log(mensagem);
    return;
  }

  toast.textContent = mensagem;

  toast.classList.add("show");

  clearTimeout(window.aureaFinanceiroToast);

  window.aureaFinanceiroToast = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


/* =========================================================
   PERÍODO
========================================================= */

function obterPeriodo() {

  const hoje = new Date();

  return {
    mes: Number(
      DB.config?.mes ??
      hoje.getMonth()
    ),

    ano: Number(
      DB.config?.ano ??
      hoje.getFullYear()
    )
  };

}


function pertenceAoPeriodoFinanceiro(item) {

  const { mes, ano } = obterPeriodo();

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


  const data =
    item?.dataRecebimento ||
    item?.vencimento ||
    item?.dataPagamento ||
    item?.data;

  if (!data) {
    return false;
  }

  const valor = new Date(
    String(data).length === 10
      ? `${data}T00:00:00`
      : data
  );

  if (Number.isNaN(valor.getTime())) {
    return false;
  }

  return (
    valor.getMonth() === mes &&
    valor.getFullYear() === ano
  );

}


/* =========================================================
   FORMATAÇÃO
========================================================= */

function obterDataInput(data) {

  if (!data) {
    return "";
  }

  const valor = new Date(
    String(data).length === 10
      ? `${data}T00:00:00`
      : data
  );

  if (Number.isNaN(valor.getTime())) {
    return "";
  }

  const ano = valor.getFullYear();

  const mes = String(
    valor.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    valor.getDate()
  ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;

}


/* =========================================================
   CÁLCULOS
========================================================= */

function receitasFinanceiro() {

  return (DB.receitas || [])
    .filter(pertenceAoPeriodoFinanceiro)
    .reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    );

}


function despesasFinanceiro() {

  return (DB.despesas || [])
    .filter(pertenceAoPeriodoFinanceiro)
    .reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    );

}


function saldoFinanceiro() {

  return (
    receitasFinanceiro() -
    despesasFinanceiro()
  );

}


function contasPendentes() {

  return (DB.despesas || [])
    .filter(pertenceAoPeriodoFinanceiro)
    .filter(item =>
      item.status !== "paga"
    );

}


function custosFixosAtivos() {

  return (DB.custosFixos || [])
    .filter(item =>
      item.ativo !== false
    );

}


/* =========================================================
   CATEGORIAS
========================================================= */

const categoriasReceita = [
  "Salário",
  "Pró-labore",
  "Aluguel recebido",
  "Comissão",
  "Renda extra",
  "Investimentos",
  "Outros"
];


const categoriasDespesa = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Educação",
  "Saúde",
  "Lazer",
  "Delivery",
  "Academia",
  "Contas da Casa",
  "Internet/Telefone",
  "Vestuário",
  "Beleza",
  "Pets",
  "Assinaturas",
  "Outros"
];


const formasPagamento = [
  "Pix",
  "Cartão",
  "Cartão de crédito",
  "Cartão de débito",
  "Dinheiro",
  "Boleto",
  "Transferência",
  "Débito automático",
  "Outro"
];


/* =========================================================
   SELECT DE CATEGORIAS
========================================================= */

function gerarOptions(lista, selecionada = "") {

  return lista
    .map(item => {

      const selected =
        item === selecionada
          ? "selected"
          : "";

      return `
        <option
          value="${escapar(item)}"
          ${selected}
        >
          ${escapar(item)}
        </option>
      `;

    })
    .join("");

}


/* =========================================================
   CARDS
========================================================= */

function renderResumoFinanceiro() {

  const receitas =
    receitasFinanceiro();

  const despesas =
    despesasFinanceiro();

  const saldo =
    saldoFinanceiro();

  const pendentes =
    contasPendentes().reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    );


  return `

    <div class="cards">

      <div class="card metric">

        <small>
          Receitas
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
          Despesas
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
          Saldo
        </small>

        <strong
          class="${saldo >= 0 ? "green" : "red"}"
        >
          ${moeda(saldo)}
        </strong>

        <span class="icon">
          ${saldo >= 0 ? "↗" : "⚠️"}
        </span>

      </div>


      <div class="card metric">

        <small>
          Contas pendentes
        </small>

        <strong class="purple">
          ${moeda(pendentes)}
        </strong>

        <span class="icon">
          📋
        </span>

      </div>

    </div>

  `;

}


/* =========================================================
   ABAS
========================================================= */

function renderAbas() {

  return `

    <div
      class="panel"
      style="padding:0;"
    >

      <div
        class="finance-tabs"
        style="
          display:flex;
          gap:8px;
          padding:16px;
          border-bottom:1px solid rgba(0,0,0,.08);
          flex-wrap:wrap;
        "
      >

        <button
          type="button"
          class="finance-tab ${
            abaFinanceiro === "despesas"
              ? "active"
              : ""
          }"
          data-finance-tab="despesas"
        >
          💳 Despesas
        </button>


        <button
          type="button"
          class="finance-tab ${
            abaFinanceiro === "receitas"
              ? "active"
              : ""
          }"
          data-finance-tab="receitas"
        >
          💰 Receitas
        </button>


        <button
          type="button"
          class="finance-tab ${
            abaFinanceiro === "fixos"
              ? "active"
              : ""
          }"
          data-finance-tab="fixos"
        >
          🔄 Custos fixos
        </button>

      </div>


      <div
        id="financeTabContent"
        style="padding:20px;"
      >
        ${renderConteudoAba()}
      </div>

    </div>

  `;

}


/* =========================================================
   CONTEÚDO DAS ABAS
========================================================= */

function renderConteudoAba() {

  if (abaFinanceiro === "receitas") {
    return renderReceitas();
  }

  if (abaFinanceiro === "fixos") {
    return renderCustosFixos();
  }

  return renderDespesas();

}


/* =========================================================
   DESPESAS
========================================================= */

function renderDespesas() {

  const despesas =
    (DB.despesas || [])
      .filter(pertenceAoPeriodoFinanceiro)
      .sort(
        (a, b) =>
          String(
            a.vencimento || ""
          ).localeCompare(
            String(
              b.vencimento || ""
            )
          )
      );


  const linhas =
    despesas.map(despesa => {

      const status =
        despesa.status || "pendente";

      let classeStatus =
        "warning";

      if (status === "paga") {
        classeStatus = "success";
      }

      if (status === "vencida") {
        classeStatus = "danger";
      }


      return `

        <div
          class="finance-row"
          style="
            display:grid;
            grid-template-columns:
              1.5fr
              1fr
              .8fr
              .8fr
              1fr
              auto;
            gap:16px;
            align-items:center;
            padding:16px 0;
            border-bottom:1px solid rgba(0,0,0,.06);
          "
        >

          <div>

            <strong>
              ${escapar(despesa.descricao)}
            </strong>

            <small
              class="muted"
              style="display:block;margin-top:4px;"
            >
              ${escapar(
                despesa.categoria || "Outros"
              )}
            </small>

          </div>


          <strong>
            ${moeda(despesa.valor)}
          </strong>


          <span>
            ${formatarData(
              despesa.vencimento
            )}
          </span>


          <span>
            ${escapar(
              despesa.tipo || "Variável"
            )}
          </span>


          <span
            class="alert ${classeStatus}"
            style="
              margin:0;
              padding:6px 10px;
              display:inline-block;
              text-align:center;
            "
          >
            ${escapar(
              capitalizarStatus(status)
            )}
          </span>


          <div
            style="
              display:flex;
              gap:6px;
              justify-content:flex-end;
            "
          >

            ${
              status !== "paga"
                ? `
                  <button
                    type="button"
                    class="small-btn"
                    data-action="pagar-despesa"
                    data-id="${escapar(despesa.id)}"
                    title="Marcar como paga"
                  >
                    ✓
                  </button>
                `
                : ""
            }


            <button
              type="button"
              class="small-btn"
              data-action="editar-despesa"
              data-id="${escapar(despesa.id)}"
              title="Editar"
            >
              ✎
            </button>


            <button
              type="button"
              class="small-btn danger-btn"
              data-action="excluir-despesa"
              data-id="${escapar(despesa.id)}"
              title="Excluir"
            >
              ×
            </button>

          </div>

        </div>

      `;

    })
    .join("");


  return `

    <div class="panel-header">

      <div>

        <h3>
          Despesas do mês
        </h3>

        <p class="muted">
          Registre e acompanhe seus gastos.
        </p>

      </div>


      <button
        type="button"
        class="primary-btn"
        data-action="nova-despesa"
      >
        + Nova despesa
      </button>

    </div>


    ${
      despesas.length === 0

        ? `

          <div
            class="empty"
            style="padding:50px 20px;"
          >
            Nenhuma despesa cadastrada
            neste período.
          </div>

        `

        : `

          <div
            class="finance-list"
            style="margin-top:20px;"
          >

            <div
              class="finance-row finance-header"
              style="
                display:grid;
                grid-template-columns:
                  1.5fr
                  1fr
                  .8fr
                  .8fr
                  1fr
                  auto;
                gap:16px;
                padding:10px 0;
                font-size:12px;
                text-transform:uppercase;
                opacity:.6;
              "
            >

              <span>
                Descrição
              </span>

              <span>
                Valor
              </span>

              <span>
                Vencimento
              </span>

              <span>
                Tipo
              </span>

              <span>
                Status
              </span>

              <span>
                Ações
              </span>

            </div>

            ${linhas}

          </div>

        `
    }

  `;

}


/* =========================================================
   RECEITAS
========================================================= */

function renderReceitas() {

  const receitas =
    (DB.receitas || [])
      .filter(pertenceAoPeriodoFinanceiro)
      .sort(
        (a, b) =>
          String(
            b.dataRecebimento || ""
          ).localeCompare(
            String(
              a.dataRecebimento || ""
            )
          )
      );


  const linhas =
    receitas.map(receita => {

      return `

        <div
          class="finance-row"
          style="
            display:grid;
            grid-template-columns:
              1.5fr
              1fr
              1fr
              .8fr
              auto;
            gap:16px;
            align-items:center;
            padding:16px 0;
            border-bottom:1px solid rgba(0,0,0,.06);
          "
        >

          <div>

            <strong>
              ${escapar(receita.descricao)}
            </strong>

            <small
              class="muted"
              style="display:block;margin-top:4px;"
            >
              ${escapar(
                receita.categoria || "Outros"
              )}
            </small>

          </div>


          <strong class="green">
            ${moeda(receita.valor)}
          </strong>


          <span>
            ${formatarData(
              receita.dataRecebimento
            )}
          </span>


          <span>
            ${escapar(
              receita.recorrencia || "Única"
            )}
          </span>


          <div
            style="
              display:flex;
              gap:6px;
              justify-content:flex-end;
            "
          >

            <button
              type="button"
              class="small-btn"
              data-action="editar-receita"
              data-id="${escapar(receita.id)}"
              title="Editar"
            >
              ✎
            </button>


            <button
              type="button"
              class="small-btn danger-btn"
              data-action="excluir-receita"
              data-id="${escapar(receita.id)}"
              title="Excluir"
            >
              ×
            </button>

          </div>

        </div>

      `;

    })
    .join("");


  return `

    <div class="panel-header">

      <div>

        <h3>
          Receitas do mês
        </h3>

        <p class="muted">
          Registre todas as entradas de dinheiro.
        </p>

      </div>


      <button
        type="button"
        class="primary-btn"
        data-action="nova-receita"
      >
        + Nova receita
      </button>

    </div>


    ${
      receitas.length === 0

        ? `

          <div
            class="empty"
            style="padding:50px 20px;"
          >
            Nenhuma receita cadastrada
            neste período.
          </div>

        `

        : `

          <div
            class="finance-list"
            style="margin-top:20px;"
          >

            <div
              class="finance-row finance-header"
              style="
                display:grid;
                grid-template-columns:
                  1.5fr
                  1fr
                  1fr
                  .8fr
                  auto;
                gap:16px;
                padding:10px 0;
                font-size:12px;
                text-transform:uppercase;
                opacity:.6;
              "
            >

              <span>
                Descrição
              </span>

              <span>
                Valor
              </span>

              <span>
                Recebimento
              </span>

              <span>
                Recorrência
              </span>

              <span>
                Ações
              </span>

            </div>

            ${linhas}

          </div>

        `
    }

  `;

}


/* =========================================================
   CUSTOS FIXOS
========================================================= */

function renderCustosFixos() {

  const custos =
    [...(DB.custosFixos || [])]
      .sort(
        (a, b) =>
          Number(a.diaVencimento || 0) -
          Number(b.diaVencimento || 0)
      );


  const linhas =
    custos.map(custo => {

      const ativo =
        custo.ativo !== false;


      return `

        <div
          class="finance-row"
          style="
            display:grid;
            grid-template-columns:
              1.5fr
              1fr
              .8fr
              1fr
              .7fr
              auto;
            gap:16px;
            align-items:center;
            padding:16px 0;
            border-bottom:1px solid rgba(0,0,0,.06);
          "
        >

          <div>

            <strong>
              ${escapar(custo.nome)}
            </strong>

            <small
              class="muted"
              style="display:block;margin-top:4px;"
            >
              ${escapar(
                custo.categoria || "Outros"
              )}
            </small>

          </div>


          <strong>
            ${moeda(custo.valor)}
          </strong>


          <span>
            Dia ${Number(
              custo.diaVencimento || 0
            )}
          </span>


          <span>
            ${escapar(
              custo.formaPagamento || "-"
            )}
          </span>


          <span>
            ${
              ativo
                ? "Ativo"
                : "Inativo"
            }
          </span>


          <div
            style="
              display:flex;
              gap:6px;
              justify-content:flex-end;
            "
          >

            <button
              type="button"
              class="small-btn"
              data-action="alternar-fixo"
              data-id="${escapar(custo.id)}"
              title="${
                ativo
                  ? "Desativar"
                  : "Ativar"
              }"
            >
              ${ativo ? "⏸" : "▶"}
            </button>


            <button
              type="button"
              class="small-btn"
              data-action="editar-fixo"
              data-id="${escapar(custo.id)}"
              title="Editar"
            >
              ✎
            </button>


            <button
              type="button"
              class="small-btn danger-btn"
              data-action="excluir-fixo"
              data-id="${escapar(custo.id)}"
              title="Excluir"
            >
              ×
            </button>

          </div>

        </div>

      `;

    })
    .join("");


  return `

    <div class="panel-header">

      <div>

        <h3>
          Custos fixos
        </h3>

        <p class="muted">
          Contas recorrentes que fazem parte
          do seu orçamento mensal.
        </p>

      </div>


      <button
        type="button"
        class="primary-btn"
        data-action="novo-fixo"
      >
        + Novo custo fixo
      </button>

    </div>


    ${
      custos.length === 0

        ? `

          <div
            class="empty"
            style="padding:50px 20px;"
          >
            Nenhum custo fixo cadastrado.
          </div>

        `

        : `

          <div
            class="finance-list"
            style="margin-top:20px;"
          >

            <div
              class="finance-row finance-header"
              style="
                display:grid;
                grid-template-columns:
                  1.5fr
                  1fr
                  .8fr
                  1fr
                  .7fr
                  auto;
                gap:16px;
                padding:10px 0;
                font-size:12px;
                text-transform:uppercase;
                opacity:.6;
              "
            >

              <span>
                Conta
              </span>

              <span>
                Valor
              </span>

              <span>
                Vencimento
              </span>

              <span>
                Pagamento
              </span>

              <span>
                Status
              </span>

              <span>
                Ações
              </span>

            </div>

            ${linhas}

          </div>

        `
    }

  `;

}


/* =========================================================
   STATUS
========================================================= */

function capitalizarStatus(status) {

  const mapa = {
    paga: "Paga",
    pendente: "Pendente",
    vencida: "Vencida"
  };

  return mapa[status] || "Pendente";

}


/* =========================================================
   MODAL BASE
========================================================= */

function abrirModalFinanceiro(conteudo) {

  fecharModalFinanceiro();


  const modal =
    document.createElement("div");

  modal.id =
    "aureaFinanceModal";

  modal.innerHTML = `

    <div
      class="aurea-modal-overlay"
      data-modal-close="true"
    >

      <div
        class="aurea-modal"
        role="dialog"
        aria-modal="true"
        onclick="event.stopPropagation()"
      >

        ${conteudo}

      </div>

    </div>

  `;


  document.body.appendChild(modal);


  const overlay =
    modal.querySelector(
      ".aurea-modal-overlay"
    );


  if (overlay) {

    overlay.addEventListener(
      "click",
      event => {

        if (
          event.target === overlay
        ) {

          fecharModalFinanceiro();

        }

      }
    );

  }

}


function fecharModalFinanceiro() {

  const modal =
    document.getElementById(
      "aureaFinanceModal"
    );

  if (modal) {
    modal.remove();
  }

}


/* =========================================================
   FORMULÁRIO DE DESPESA
========================================================= */

function abrirFormularioDespesa(id = null) {

  const existente =
    id
      ? (DB.despesas || [])
          .find(item => item.id === id)
      : null;


  const { mes, ano } =
    obterPeriodo();


  const dataPadrao =
    existente?.vencimento ||
    `${ano}-${String(
      mes + 1
    ).padStart(2, "0")}-01`;


  abrirModalFinanceiro(`

    <div class="modal-header">

      <div>

        <h3>
          ${
            existente
              ? "Editar despesa"
              : "Nova despesa"
          }
        </h3>

        <p class="muted">
          Cadastre um gasto financeiro.
        </p>

      </div>

      <button
        type="button"
        class="small-btn"
        data-action="fechar-modal"
      >
        ×
      </button>

    </div>


    <form
      id="formDespesa"
      style="
        display:grid;
        gap:16px;
        margin-top:20px;
      "
    >

      <input
        type="hidden"
        name="id"
        value="${escapar(
          existente?.id || ""
        )}"
      >


      <label>
        Descrição

        <input
          type="text"
          name="descricao"
          required
          value="${escapar(
            existente?.descricao || ""
          )}"
          placeholder="Ex.: Mercado"
        >
      </label>


      <label>
        Valor

        <input
          type="number"
          name="valor"
          required
          min="0"
          step="0.01"
          value="${
            existente?.valor ?? ""
          }"
          placeholder="0,00"
        >
      </label>


      <label>
        Categoria

        <select
          name="categoria"
          required
        >

          ${gerarOptions(
            categoriasDespesa,
            existente?.categoria || ""
          )}

        </select>

      </label>


      <label>
        Tipo

        <select name="tipo">

          <option
            value="Variável"
            ${
              existente?.tipo === "Variável"
                ? "selected"
                : ""
            }
          >
            Variável
          </option>

          <option
            value="Fixa"
            ${
              existente?.tipo === "Fixa"
                ? "selected"
                : ""
            }
          >
            Fixa
          </option>

        </select>

      </label>


      <label>
        Data de vencimento

        <input
          type="date"
          name="vencimento"
          required
          value="${escapar(
            obterDataInput(dataPadrao)
          )}"
        >

      </label>


      <label>
        Forma de pagamento

        <select name="formaPagamento">

          ${gerarOptions(
            formasPagamento,
            existente?.formaPagamento || "Pix"
          )}

        </select>

      </label>


      <label>
        Status

        <select name="status">

          <option
            value="pendente"
            ${
              existente?.status === "pendente" ||
              !existente
                ? "selected"
                : ""
            }
          >
            Pendente
          </option>

          <option
            value="paga"
            ${
              existente?.status === "paga"
                ? "selected"
                : ""
            }
          >
            Paga
          </option>

          <option
            value="vencida"
            ${
              existente?.status === "vencida"
                ? "selected"
                : ""
            }
          >
            Vencida
          </option>

        </select>

      </label>


      <label>
        Observação

        <textarea
          name="observacao"
          rows="3"
          placeholder="Opcional"
        >${escapar(
          existente?.observacao || ""
        )}</textarea>

      </label>


      <div
        style="
          display:flex;
          justify-content:flex-end;
          gap:10px;
          margin-top:8px;
        "
      >

        <button
          type="button"
          class="secondary-btn"
          data-action="fechar-modal"
        >
          Cancelar
        </button>


        <button
          type="submit"
          class="primary-btn"
        >
          ${
            existente
              ? "Salvar alterações"
              : "Cadastrar despesa"
          }
        </button>

      </div>

    </form>

  `);


  const form =
    document.getElementById(
      "formDespesa"
    );


  if (form) {

    form.addEventListener(
      "submit",
      salvarDespesa
    );

  }

}


/* =========================================================
   SALVAR DESPESA
========================================================= */

function salvarDespesa(event) {

  event.preventDefault();


  const form =
    event.currentTarget;


  const dados =
    new FormData(form);


  const descricao =
    String(
      dados.get("descricao") || ""
    ).trim();


  const valor =
    Number(
      dados.get("valor")
    );


  const categoria =
    String(
      dados.get("categoria") || ""
    );


  const vencimento =
    String(
      dados.get("vencimento") || ""
    );


  if (!campoPreenchido(descricao)) {

    toastFinanceiro(
      "Informe a descrição da despesa."
    );

    return;

  }


  if (!valorValido(valor) || valor <= 0) {

    toastFinanceiro(
      "Informe um valor válido."
    );

    return;

  }


  if (!vencimento) {

    toastFinanceiro(
      "Informe a data de vencimento."
    );

    return;

  }


  const data =
    new Date(
      `${vencimento}T00:00:00`
    );


  if (Number.isNaN(data.getTime())) {

    toastFinanceiro(
      "A data informada é inválida."
    );

    return;

  }


  const id =
    String(
      dados.get("id") || ""
    );


  const { mes, ano } =
    obterPeriodo();


  const registro = {

    descricao,

    valor,

    categoria,

    tipo:
      String(
        dados.get("tipo") ||
        "Variável"
      ),

    vencimento,

    dataPagamento:
      dados.get("status") === "paga"
        ? dataAtual()
        : null,

    formaPagamento:
      String(
        dados.get("formaPagamento") ||
        "Pix"
      ),

    status:
      String(
        dados.get("status") ||
        "pendente"
      ),

    mes,

    ano,

    observacao:
      String(
        dados.get("observacao") ||
        ""
      ).trim()

  };


  if (id) {

    atualizarRegistro(
      "despesas",
      id,
      registro
    );

    toastFinanceiro(
      "Despesa atualizada."
    );

  } else {

    adicionarRegistro(
      "despesas",
      registro
    );

    toastFinanceiro(
      "Despesa cadastrada."
    );

  }


  fecharModalFinanceiro();

  renderFinanceiro();

}


/* =========================================================
   FORMULÁRIO DE RECEITA
========================================================= */

function abrirFormularioReceita(id = null) {

  const existente =
    id
      ? (DB.receitas || [])
          .find(item => item.id === id)
      : null;


  const { mes, ano } =
    obterPeriodo();


  const dataPadrao =
    existente?.dataRecebimento ||
    `${ano}-${String(
      mes + 1
    ).padStart(2, "0")}-01`;


  abrirModalFinanceiro(`

    <div class="modal-header">

      <div>

        <h3>
          ${
            existente
              ? "Editar receita"
              : "Nova receita"
          }
        </h3>

        <p class="muted">
          Cadastre uma entrada de dinheiro.
        </p>

      </div>

      <button
        type="button"
        class="small-btn"
        data-action="fechar-modal"
      >
        ×
      </button>

    </div>


    <form
      id="formReceita"
      style="
        display:grid;
        gap:16px;
        margin-top:20px;
      "
    >

      <input
        type="hidden"
        name="id"
        value="${escapar(
          existente?.id || ""
        )}"
      >


      <label>
        Descrição

        <input
          type="text"
          name="descricao"
          required
          value="${escapar(
            existente?.descricao || ""
          )}"
          placeholder="Ex.: Salário"
        >
      </label>


      <label>
        Valor

        <input
          type="number"
          name="valor"
          required
          min="0"
          step="0.01"
          value="${
            existente?.valor ?? ""
          }"
          placeholder="0,00"
        >
      </label>


      <label>
        Categoria

        <select
          name="categoria"
          required
        >

          ${gerarOptions(
            categoriasReceita,
            existente?.categoria || "Salário"
          )}

        </select>

      </label>


      <label>
        Data de recebimento

        <input
          type="date"
          name="dataRecebimento"
          required
          value="${escapar(
            obterDataInput(dataPadrao)
          )}"
        >

      </label>


      <label>
        Recorrência

        <select name="recorrencia">

          <option
            value="Única"
            ${
              existente?.recorrencia === "Única"
                ? "selected"
                : ""
            }
          >
            Única
          </option>

          <option
            value="Mensal"
            ${
              existente?.recorrencia === "Mensal" ||
              !existente
                ? "selected"
                : ""
            }
          >
            Mensal
          </option>

          <option
            value="Anual"
            ${
              existente?.recorrencia === "Anual"
                ? "selected"
                : ""
            }
          >
            Anual
          </option>

        </select>

      </label>


      <label>
        Observação

        <textarea
          name="observacao"
          rows="3"
          placeholder="Opcional"
        >${escapar(
          existente?.observacao || ""
        )}</textarea>

      </label>


      <div
        style="
          display:flex;
          justify-content:flex-end;
          gap:10px;
        "
      >

        <button
          type="button"
          class="secondary-btn"
          data-action="fechar-modal"
        >
          Cancelar
        </button>


        <button
          type="submit"
          class="primary-btn"
        >
          ${
            existente
              ? "Salvar alterações"
              : "Cadastrar receita"
          }
        </button>

      </div>

    </form>

  `);


  const form =
    document.getElementById(
      "formReceita"
    );


  if (form) {

    form.addEventListener(
      "submit",
      salvarReceita
    );

  }

}


/* =========================================================
   SALVAR RECEITA
========================================================= */

function salvarReceita(event) {

  event.preventDefault();


  const dados =
    new FormData(
      event.currentTarget
    );


  const descricao =
    String(
      dados.get("descricao") || ""
    ).trim();


  const valor =
    Number(
      dados.get("valor")
    );


  const dataRecebimento =
    String(
      dados.get("dataRecebimento") || ""
    );


  if (!campoPreenchido(descricao)) {

    toastFinanceiro(
      "Informe a descrição da receita."
    );

    return;

  }


  if (!valorValido(valor) || valor <= 0) {

    toastFinanceiro(
      "Informe um valor válido."
    );

    return;

  }


  if (!dataRecebimento) {

    toastFinanceiro(
      "Informe a data de recebimento."
    );

    return;

  }


  const data =
    new Date(
      `${dataRecebimento}T00:00:00`
    );


  if (Number.isNaN(data.getTime())) {

    toastFinanceiro(
      "A data informada é inválida."
    );

    return;

  }


  const id =
    String(
      dados.get("id") || ""
    );


  const registro = {

    descricao,

    valor,

    categoria:
      String(
        dados.get("categoria") ||
        "Outros"
      ),

    dataRecebimento,

    recorrencia:
      String(
        dados.get("recorrencia") ||
        "Única"
      ),

    observacao:
      String(
        dados.get("observacao") ||
        ""
      ).trim(),

    mes:
      data.getMonth(),

    ano:
      data.getFullYear()

  };


  if (id) {

    atualizarRegistro(
      "receitas",
      id,
      registro
    );

    toastFinanceiro(
      "Receita atualizada."
    );

  } else {

    adicionarRegistro(
      "receitas",
      registro
    );

    toastFinanceiro(
      "Receita cadastrada."
    );

  }


  fecharModalFinanceiro();

  renderFinanceiro();

}


/* =========================================================
   FORMULÁRIO DE CUSTO FIXO
========================================================= */

function abrirFormularioFixo(id = null) {

  const existente =
    id
      ? (DB.custosFixos || [])
          .find(item => item.id === id)
      : null;


  abrirModalFinanceiro(`

    <div class="modal-header">

      <div>

        <h3>
          ${
            existente
              ? "Editar custo fixo"
              : "Novo custo fixo"
          }
        </h3>

        <p class="muted">
          Uma conta recorrente do seu orçamento.
        </p>

      </div>


      <button
        type="button"
        class="small-btn"
        data-action="fechar-modal"
      >
        ×
      </button>

    </div>


    <form
      id="formFixo"
      style="
        display:grid;
        gap:16px;
        margin-top:20px;
      "
    >

      <input
        type="hidden"
        name="id"
        value="${escapar(
          existente?.id || ""
        )}"
      >


      <label>
        Nome da conta

        <input
          type="text"
          name="nome"
          required
          value="${escapar(
            existente?.nome || ""
          )}"
          placeholder="Ex.: Internet"
        >

      </label>


      <label>
        Valor

        <input
          type="number"
          name="valor"
          required
          min="0"
          step="0.01"
          value="${
            existente?.valor ?? ""
          }"
          placeholder="0,00"
        >

      </label>


      <label>
        Categoria

        <select
          name="categoria"
          required
        >

          ${gerarOptions(
            categoriasDespesa,
            existente?.categoria || "Contas da Casa"
          )}

        </select>

      </label>


      <label>
        Dia do vencimento

        <input
          type="number"
          name="diaVencimento"
          required
          min="1"
          max="31"
          value="${
            existente?.diaVencimento ?? 10
          }"
        >

      </label>


      <label>
        Forma de pagamento

        <select name="formaPagamento">

          ${gerarOptions(
            formasPagamento,
            existente?.formaPagamento || "Pix"
          )}

        </select>

      </label>


      <label>
        Recorrência

        <select name="recorrencia">

          <option
            value="Mensal"
            selected
          >
            Mensal
          </option>

          <option
            value="Anual"
          >
            Anual
          </option>

        </select>

      </label>


      <div
        style="
          display:flex;
          justify-content:flex-end;
          gap:10px;
        "
      >

        <button
          type="button"
          class="secondary-btn"
          data-action="fechar-modal"
        >
          Cancelar
        </button>


        <button
          type="submit"
          class="primary-btn"
        >
          ${
            existente
              ? "Salvar alterações"
              : "Cadastrar custo fixo"
          }
        </button>

      </div>

    </form>

  `);


  const form =
    document.getElementById(
      "formFixo"
    );


  if (form) {

    form.addEventListener(
      "submit",
      salvarFixo
    );

  }

}


/* =========================================================
   SALVAR CUSTO FIXO
========================================================= */

function salvarFixo(event) {

  event.preventDefault();


  const dados =
    new FormData(
      event.currentTarget
    );


  const nome =
    String(
      dados.get("nome") || ""
    ).trim();


  const valor =
    Number(
      dados.get("valor")
    );


  const dia =
    Number(
      dados.get("diaVencimento")
    );


  if (!campoPreenchido(nome)) {

    toastFinanceiro(
      "Informe o nome da conta."
    );

    return;

  }


  if (!valorValido(valor) || valor <= 0) {

    toastFinanceiro(
      "Informe um valor válido."
    );

    return;

  }


  if (
    !Number.isInteger(dia) ||
    dia < 1 ||
    dia > 31
  ) {

    toastFinanceiro(
      "O dia deve estar entre 1 e 31."
    );

    return;

  }


  const id =
    String(
      dados.get("id") || ""
    );


  const registro = {

    nome,

    valor,

    categoria:
      String(
        dados.get("categoria") ||
        "Contas da Casa"
      ),

    diaVencimento:
      dia,

    formaPagamento:
      String(
        dados.get("formaPagamento") ||
        "Pix"
      ),

    recorrencia:
      String(
        dados.get("recorrencia") ||
        "Mensal"
      ),

    ativo:
      existenteAtivo(
        id
      )

  };


  if (id) {

    atualizarRegistro(
      "custosFixos",
      id,
      registro
    );

    toastFinanceiro(
      "Custo fixo atualizado."
    );

  } else {

    adicionarRegistro(
      "custosFixos",
      {
        ...registro,
        ativo: true
      }
    );

    toastFinanceiro(
      "Custo fixo cadastrado."
    );

  }


  fecharModalFinanceiro();

  renderFinanceiro();

}


function existenteAtivo(id) {

  if (!id) {
    return true;
  }

  const existente =
    (DB.custosFixos || [])
      .find(item => item.id === id);

  return existente
    ? existente.ativo !== false
    : true;

}


/* =========================================================
   PAGAR DESPESA
========================================================= */

function pagarDespesa(id) {

  const despesa =
    (DB.despesas || [])
      .find(item => item.id === id);


  if (!despesa) {
    return;
  }


  atualizarRegistro(
    "despesas",
    id,
    {
      status: "paga",
      dataPagamento: dataAtual()
    }
  );


  toastFinanceiro(
    "Despesa marcada como paga."
  );


  renderFinanceiro();

}


/* =========================================================
   ALTERNAR CUSTO FIXO
========================================================= */

function alternarFixo(id) {

  const custo =
    (DB.custosFixos || [])
      .find(item => item.id === id);


  if (!custo) {
    return;
  }


  atualizarRegistro(
    "custosFixos",
    id,
    {
      ativo:
        custo.ativo === false
    }
  );


  toastFinanceiro(
    custo.ativo === false
      ? "Custo fixo ativado."
      : "Custo fixo desativado."
  );


  renderFinanceiro();

}


/* =========================================================
   EXCLUSÃO
========================================================= */

function excluirFinanceiro(
  colecao,
  id,
  nome
) {

  const confirmar =
    confirm(
      `Deseja realmente excluir ${nome}?`
    );


  if (!confirmar) {
    return;
  }


  const removido =
    excluirRegistro(
      colecao,
      id
    );


  if (!removido) {

    toastFinanceiro(
      "Não foi possível excluir."
    );

    return;

  }


  toastFinanceiro(
    "Registro excluído."
  );


  renderFinanceiro();

}


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventosFinanceiro() {

  const container =
    document.getElementById(
      "financeiroPage"
    );


  if (!container) {
    return;
  }


  container
    .querySelectorAll(
      "[data-finance-tab]"
    )
    .forEach(botao => {

      botao.addEventListener(
        "click",
        () => {

          abaFinanceiro =
            botao.dataset.financeTab;

          renderFinanceiro();

        }
      );

    });


  container
    .querySelectorAll(
      "[data-action]"
    )
    .forEach(botao => {

      botao.addEventListener(
        "click",
        () => {

          const action =
            botao.dataset.action;

          const id =
            botao.dataset.id;


          if (
            action ===
            "nova-despesa"
          ) {

            abrirFormularioDespesa();
            return;

          }


          if (
            action ===
            "editar-despesa"
          ) {

            abrirFormularioDespesa(id);
            return;

          }


          if (
            action ===
            "excluir-despesa"
          ) {

            excluirFinanceiro(
              "despesas",
              id,
              "esta despesa"
            );

            return;

          }


          if (
            action ===
            "pagar-despesa"
          ) {

            pagarDespesa(id);
            return;

          }


          if (
            action ===
            "nova-receita"
          ) {

            abrirFormularioReceita();
            return;

          }


          if (
            action ===
            "editar-receita"
          ) {

            abrirFormularioReceita(id);
            return;

          }


          if (
            action ===
            "excluir-receita"
          ) {

            excluirFinanceiro(
              "receitas",
              id,
              "esta receita"
            );

            return;

          }


          if (
            action ===
            "novo-fixo"
          ) {

            abrirFormularioFixo();
            return;

          }


          if (
            action ===
            "editar-fixo"
          ) {

            abrirFormularioFixo(id);
            return;

          }


          if (
            action ===
            "excluir-fixo"
          ) {

            excluirFinanceiro(
              "custosFixos",
              id,
              "este custo fixo"
            );

            return;

          }


          if (
            action ===
            "alternar-fixo"
          ) {

            alternarFixo(id);
            return;

          }


          if (
            action ===
            "fechar-modal"
          ) {

            fecharModalFinanceiro();

          }

        }
      );

    });

}


/* =========================================================
   RENDER PRINCIPAL
========================================================= */

function renderFinanceiro() {

  const container =
    document.getElementById(
      "content"
    );


  if (!container) {
    return;
  }


  container.innerHTML = `

    <div
      class="page"
      id="financeiroPage"
    >

      ${renderResumoFinanceiro()}

      ${renderAbas()}

    </div>

  `;


  configurarEventosFinanceiro();

}


/* =========================================================
   API DO MÓDULO
========================================================= */

export {

  renderFinanceiro,

  receitasFinanceiro,

  despesasFinanceiro,

  saldoFinanceiro

};
