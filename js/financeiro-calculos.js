"use strict";

import {
  DB,
  pertenceAoMes
} from "./database.js";


/* ============================================================
   PERÍODO
============================================================ */

function despesasDoPeriodo(mes, ano) {

  return (DB.despesas || [])
    .filter(item =>
      pertenceAoMes(item, mes, ano)
    );

}


function receitasDoPeriodo(mes, ano) {

  return (DB.receitas || [])
    .filter(item =>
      pertenceAoMes(item, mes, ano)
    );

}


/* ============================================================
   SOMA
============================================================ */

function somar(lista) {

  return lista.reduce(
    (total, item) =>
      total + Number(item.valor || 0),
    0
  );

}


/* ============================================================
   RECEITAS
============================================================ */

function totalReceitas(
  mes,
  ano
) {

  return somar(
    receitasDoPeriodo(mes, ano)
  );

}


/* ============================================================
   DESPESAS
============================================================ */

function totalDespesas(
  mes,
  ano
) {

  return somar(
    despesasDoPeriodo(mes, ano)
  );

}


/* ============================================================
   SALDO
============================================================ */

function saldo(
  mes,
  ano
) {

  return (
    totalReceitas(mes, ano) -
    totalDespesas(mes, ano)
  );

}


/* ============================================================
   PENDENTES
============================================================ */

function despesasPendentes(
  mes,
  ano
) {

  return despesasDoPeriodo(
    mes,
    ano
  ).filter(
    item => item.status !== "paga"
  );

}


function totalPendente(
  mes,
  ano
) {

  return somar(
    despesasPendentes(
      mes,
      ano
    )
  );

}


/* ============================================================
   FIXAS
============================================================ */

function despesasFixas(
  mes,
  ano
) {

  return despesasDoPeriodo(
    mes,
    ano
  ).filter(
    item =>
      String(item.tipo).toLowerCase() === "fixa"
  );

}


function totalFixas(
  mes,
  ano
) {

  return somar(
    despesasFixas(
      mes,
      ano
    )
  );

}


/* ============================================================
   VARIÁVEIS
============================================================ */

function despesasVariaveis(
  mes,
  ano
) {

  return despesasDoPeriodo(
    mes,
    ano
  ).filter(
    item =>
      String(item.tipo).toLowerCase() !== "fixa"
  );

}


function totalVariaveis(
  mes,
  ano
) {

  return somar(
    despesasVariaveis(
      mes,
      ano
    )
  );

}


/* ============================================================
   COMPROMETIMENTO
============================================================ */

function percentualComprometimento(
  mes,
  ano
) {

  const receita =
    totalReceitas(mes, ano);

  const despesa =
    totalDespesas(mes, ano);


  if (receita <= 0) {
    return 0;
  }


  return (
    despesa / receita
  ) * 100;

}


/* ============================================================
   CATEGORIAS
============================================================ */

function gastosPorCategoria(
  mes,
  ano
) {

  const despesas =
    despesasDoPeriodo(
      mes,
      ano
    );


  const resultado = {};


  despesas.forEach(item => {

    const categoria =
      item.categoria ||
      "Outros";


    resultado[categoria] =
      (resultado[categoria] || 0) +
      Number(item.valor || 0);

  });


  return resultado;

}


/* ============================================================
   MAIOR CATEGORIA
============================================================ */

function maiorCategoria(
  mes,
  ano
) {

  const categorias =
    gastosPorCategoria(
      mes,
      ano
    );


  const entradas =
    Object.entries(categorias);


  if (!entradas.length) {
    return null;
  }


  entradas.sort(
    (a, b) => b[1] - a[1]
  );


  return {

    categoria: entradas[0][0],

    valor: entradas[0][1]

  };

}


/* ============================================================
   RESUMO
============================================================ */

function resumoFinanceiro(
  mes,
  ano
) {

  const receitas =
    totalReceitas(
      mes,
      ano
    );

  const despesas =
    totalDespesas(
      mes,
      ano
    );

  const saldoAtual =
    receitas - despesas;


  return {

    receitas,

    despesas,

    saldo: saldoAtual,

    pendente:
      totalPendente(
        mes,
        ano
      ),

    fixas:
      totalFixas(
        mes,
        ano
      ),

    variaveis:
      totalVariaveis(
        mes,
        ano
      ),

    comprometimento:
      percentualComprometimento(
        mes,
        ano
      ),

    maiorCategoria:
      maiorCategoria(
        mes,
        ano
      )

  };

}


/* ============================================================
   EXPORT
============================================================ */

export {

  despesasDoPeriodo,

  receitasDoPeriodo,

  totalReceitas,

  totalDespesas,

  saldo,

  despesasPendentes,

  totalPendente,

  despesasFixas,

  totalFixas,

  despesasVariaveis,

  totalVariaveis,

  percentualComprometimento,

  gastosPorCategoria,

  maiorCategoria,

  resumoFinanceiro

};
