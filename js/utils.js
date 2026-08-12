"use strict";

/* ============================================================
   AUREA — UTILS.JS
   Funções utilitárias gerais
============================================================ */


/* ============================================================
   MOEDA
============================================================ */

function moeda(valor) {

  const numero = Number(valor || 0);

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

}


/* ============================================================
   ESCAPAR HTML
============================================================ */

function escapar(valor) {

  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* ============================================================
   DATA ATUAL
============================================================ */

function dataAtual() {

  const agora = new Date();

  const ano = agora.getFullYear();

  const mes = String(
    agora.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    agora.getDate()
  ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;

}


/* ============================================================
   FORMATAR DATA
============================================================ */

function formatarData(data) {

  if (!data) {
    return "-";
  }

  const texto = String(data);

  const partes = texto.slice(0, 10).split("-");

  if (partes.length !== 3) {
    return texto;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* ============================================================
   VALIDAR VALOR
============================================================ */

function valorValido(valor) {

  return (
    typeof valor === "number" &&
    Number.isFinite(valor)
  );

}


/* ============================================================
   CAMPO PREENCHIDO
============================================================ */

function campoPreenchido(valor) {

  return String(valor ?? "").trim().length > 0;

}


/* ============================================================
   NÚMERO
============================================================ */

function numero(valor) {

  const resultado = Number(valor);

  return Number.isFinite(resultado)
    ? resultado
    : 0;

}


/* ============================================================
   CAPITALIZAR
============================================================ */

function capitalizar(valor) {

  const texto = String(valor || "");

  if (!texto) {
    return "";
  }

  return texto.charAt(0).toUpperCase() +
    texto.slice(1);

}


/* ============================================================
   DEBOUNCE
============================================================ */

function debounce(funcao, espera = 300) {

  let timeout;

  return (...args) => {

    clearTimeout(timeout);

    timeout = setTimeout(
      () => funcao(...args),
      espera
    );

  };

}


/* ============================================================
   EXPORT
============================================================ */

export {

  moeda,
  escapar,
  dataAtual,
  formatarData,
  valorValido,
  campoPreenchido,
  numero,
  capitalizar,
  debounce

};
