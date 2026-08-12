"use strict";

/* ============================================================
   AUREA — MAIN.JS
   Ponto central da aplicação
   ============================================================ */

import {
  DB,
  salvarBanco,
  definirPeriodo,
  obterPeriodoAtual
} from "./database.js";


/* ============================================================
   ESTADO DA APLICAÇÃO
   ============================================================ */

let paginaAtual = "dashboard";


/* ============================================================
   CONFIGURAÇÃO DAS PÁGINAS
   ============================================================ */

const paginas = {

  dashboard: {
    titulo: "Dashboard",
    subtitulo: "Acompanhe sua evolução financeira"
  },

  financeiro: {
    titulo: "Meu Financeiro",
    subtitulo: "Controle suas receitas, despesas e contas"
  },

  planejamento: {
    titulo: "Planejamento",
    subtitulo: "Prepare seus próximos meses"
  },

  tarefas: {
    titulo: "Tarefas",
    subtitulo: "Organize suas tarefas e acompanhe sua rotina"
  },

  relatorios: {
    titulo: "Relatórios",
    subtitulo: "Analise sua evolução financeira"
  },

  investimentos: {
    titulo: "Investimentos",
    subtitulo: "Acompanhe seu patrimônio e seus aportes"
  },

  limites: {
    titulo: "Limites",
    subtitulo: "Defina limites para seus gastos"
  },

  desejos: {
    titulo: "Desejos",
    subtitulo: "Transforme seus objetivos em planos"
  }

};


/* ============================================================
   ELEMENTOS PRINCIPAIS
   ============================================================ */

function obterElementos() {

  return {

    content:
      document.getElementById("content"),

    pageTitle:
      document.getElementById("pageTitle"),

    pageSubtitle:
      document.getElementById("pageSubtitle"),

    monthSelect:
      document.getElementById("monthSelect"),

    notificationButton:
      document.getElementById("notificationButton"),

    toast:
      document.getElementById("toast")

  };

}


/* ============================================================
   TOAST
   ============================================================ */

let toastTimer = null;


function mostrarToast(mensagem) {

  const toast =
    document.getElementById("toast");


  if (!toast) {

    console.log(mensagem);

    return;

  }


  toast.textContent = mensagem;

  toast.classList.add("show");


  clearTimeout(toastTimer);


  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2500);

}


/* ============================================================
   TELA TEMPORÁRIA
   ============================================================ */

/*
   Neste momento as páginas ainda serão construídas.

   Portanto, o main.js mostra uma estrutura temporária
   para podermos testar a arquitetura antes de adicionar
   todos os módulos.
*/

function renderPaginaTemporaria(nome) {

  const elementos =
    obterElementos();


  if (!elementos.content) {
    return;
  }


  const pagina =
    paginas[nome];


  if (!pagina) {
    return;
  }


  elementos.content.innerHTML = `

    <div class="page">

      <div class="panel">

        <h3>
          ${pagina.titulo}
        </h3>

        <p class="muted">
          Este módulo está sendo construído.
        </p>

        <p class="muted">
          A estrutura do AUREA já está conectada
          ao banco de dados.
        </p>

      </div>

    </div>

  `;

}


/* ============================================================
   ATUALIZAR CABEÇALHO
   ============================================================ */

function atualizarCabecalho(nome) {

  const elementos =
    obterElementos();


  const pagina =
    paginas[nome];


  if (!pagina) {
    return;
  }


  if (elementos.pageTitle) {

    elementos.pageTitle.textContent =
      pagina.titulo;

  }


  if (elementos.pageSubtitle) {

    elementos.pageSubtitle.textContent =
      pagina.subtitulo;

  }

}


/* ============================================================
   ATUALIZAR MENU
   ============================================================ */

function atualizarMenu(nome) {

  document
    .querySelectorAll(".menu")
    .forEach(botao => {

      const ativo =
        botao.dataset.page === nome;

      botao.classList.toggle(
        "active",
        ativo
      );

    });

}


/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function carregarPagina(nome) {

  if (!paginas[nome]) {

    console.warn(
      `Página "${nome}" não encontrada.`
    );

    nome = "dashboard";

  }


  paginaAtual = nome;


  atualizarCabecalho(nome);

  atualizarMenu(nome);

  renderPaginaTemporaria(nome);


  console.log(
    `AUREA: página carregada → ${nome}`
  );

}


/* ============================================================
   EVENTOS DO MENU
   ============================================================ */

function configurarMenu() {

  const botoes =
    document.querySelectorAll(".menu");


  botoes.forEach(botao => {

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


/* ============================================================
   SELETOR DE MÊS
   ============================================================ */

function configurarMes() {

  const seletor =
    document.getElementById("monthSelect");


  if (!seletor) {
    return;
  }


  const periodo =
    obterPeriodoAtual();


  /*
     O index.html atualmente possui os meses
     de janeiro a dezembro de 2026.

     O valor do option corresponde ao mês:
     
     Janeiro = 0
     Fevereiro = 1
     ...
     Dezembro = 11
  */

  seletor.value =
    String(periodo.mes);


  seletor.addEventListener(
    "change",
    () => {

      const mes =
        Number(seletor.value);


      const ano =
        obterAnoDoSelect(seletor);


      definirPeriodo(
        mes,
        ano
      );


      /*
         Recarrega a página atual para que,
         futuramente, os dados daquele mês sejam
         recalculados.
      */

      carregarPagina(
        paginaAtual
      );


      mostrarToast(
        `Período alterado para ${seletor.options[seletor.selectedIndex].text}`
      );

    }
  );

}


/* ============================================================
   ANO DO SELECT
   ============================================================ */

function obterAnoDoSelect(seletor) {

  const texto =
    seletor.options[
      seletor.selectedIndex
    ]?.text || "";


  const resultado =
    texto.match(/\d{4}/);


  if (resultado) {

    return Number(
      resultado[0]
    );

  }


  return DB.config.ano;

}


/* ============================================================
   NOTIFICAÇÕES
   ============================================================ */

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

      mostrarToast(
        "O sistema de alertas inteligentes será conectado ao Dashboard."
      );

    }
  );

}


/* ============================================================
   EXPOSIÇÃO CONTROLADA
   ============================================================ */

window.AUREA = {

  DB,

  carregarPagina,

  mostrarToast,

  salvarBanco,

  obterPeriodoAtual,

  definirPeriodo

};


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function iniciarAplicacao() {

  console.log(
    "===================================="
  );

  console.log(
    "AUREA iniciado"
  );

  console.log(
    "Banco de dados carregado:",
    DB
  );

  console.log(
    "===================================="
  );


  configurarMenu();

  configurarMes();

  configurarNotificacoes();


  carregarPagina(
    "dashboard"
  );

}


/* ============================================================
   DOM READY
   ============================================================ */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    iniciarAplicacao
  );

} else {

  iniciarAplicacao();

}
