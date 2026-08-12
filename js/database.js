"use strict";

/* =========================================================
   AUREA — DATABASE.JS
   Banco de dados e persistência da aplicação
========================================================= */

const STORAGE_KEY = "AUREA_DB";


/* =========================================================
   BANCO INICIAL
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
   GERADOR DE ID
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


/* =========================================================
   CLONAR BANCO INICIAL
========================================================= */

function clonarBancoInicial() {

  return JSON.parse(
    JSON.stringify(bancoInicial)
  );

}


/* =========================================================
   NORMALIZAR BANCO
========================================================= */

/*
 * Garante que um banco antigo não quebre
 * quando adicionarmos novas estruturas.
 */

function normalizarBanco(banco) {

  return {

    receitas: Array.isArray(banco?.receitas)
      ? banco.receitas
      : [],

    despesas: Array.isArray(banco?.despesas)
      ? banco.despesas
      : [],

    custosFixos: Array.isArray(
      banco?.custosFixos
    )
      ? banco.custosFixos
      : [],

    investimentos: Array.isArray(
      banco?.investimentos
    )
      ? banco.investimentos
      : [],

    limites: Array.isArray(
      banco?.limites
    )
      ? banco.limites
      : [],

    desejos: Array.isArray(
      banco?.desejos
    )
      ? banco.desejos
      : [],

    tarefas: Array.isArray(
      banco?.tarefas
    )
      ? banco.tarefas
      : [],

    planejamentos: Array.isArray(
      banco?.planejamentos
    )
      ? banco.planejamentos
      : [],

    relatorios: Array.isArray(
      banco?.relatorios
    )
      ? banco.relatorios
      : [],

    config: {

      ...bancoInicial.config,

      ...(banco?.config || {})

    }

  };

}


/* =========================================================
   CARREGAR BANCO
========================================================= */

function carregarBanco() {

  const bancoSalvo =
    localStorage.getItem(STORAGE_KEY);


  /*
   * Primeiro acesso.
   */

  if (!bancoSalvo) {

    const bancoNovo =
      clonarBancoInicial();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoNovo)
    );

    return bancoNovo;

  }


  /*
   * Banco já existente.
   */

  try {

    const banco =
      JSON.parse(bancoSalvo);

    const bancoNormalizado =
      normalizarBanco(banco);


    /*
     * Salva novamente já normalizado.
     * Isso garante que novas estruturas
     * sejam adicionadas ao banco antigo.
     */

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoNormalizado)
    );


    return bancoNormalizado;

  } catch (erro) {

    console.error(
      "AUREA: erro ao carregar banco.",
      erro
    );


    const bancoNovo =
      clonarBancoInicial();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoNovo)
    );


    return bancoNovo;

  }

}


/* =========================================================
   SALVAR BANCO
========================================================= */

function salvarBanco(DB) {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DB)
    );

    return true;

  } catch (erro) {

    console.error(
      "AUREA: erro ao salvar banco.",
      erro
    );

    return false;

  }

}


/* =========================================================
   RESETAR BANCO
========================================================= */

function resetarBanco() {

  const bancoNovo =
    clonarBancoInicial();


  salvarBanco(bancoNovo);


  return bancoNovo;

}


/* =========================================================
   LIMPAR BANCO
========================================================= */

function limparBanco() {

  localStorage.removeItem(
    STORAGE_KEY
  );

}


/* =========================================================
   CONTEXTO DO PERÍODO
========================================================= */

function obterMesAtual(DB) {

  return Number(
    DB?.config?.mesAtual ??
    new Date().getMonth()
  );

}


function obterAnoAtual(DB) {

  return Number(
    DB?.config?.anoAtual ??
    new Date().getFullYear()
  );

}


/* =========================================================
   ALTERAR PERÍODO
========================================================= */

function definirPeriodo(
  DB,
  mes,
  ano
) {

  DB.config.mesAtual =
    Number(mes);

  DB.config.anoAtual =
    Number(ano);


  salvarBanco(DB);

}


/* =========================================================
   VERIFICAR SE REGISTRO PERTENCE AO MÊS
========================================================= */

function pertenceAoMes(
  item,
  mes,
  ano
) {

  if (!item) {
    return false;
  }


  /*
   * Registros novos terão
   * mes e ano próprios.
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
   * que possuem apenas uma data.
   */

  if (item.data) {

    const data =
      new Date(item.data);


    if (
      Number.isNaN(
        data.getTime()
      )
    ) {

      return false;

    }


    return (
      data.getMonth() === Number(mes) &&
      data.getFullYear() === Number(ano)
    );

  }


  return false;

}


/* =========================================================
   FILTRAR REGISTROS POR PERÍODO
========================================================= */

function filtrarPorPeriodo(
  registros,
  mes,
  ano
) {

  if (!Array.isArray(registros)) {

    return [];

  }


  return registros.filter(
    item =>
      pertenceAoMes(
        item,
        mes,
        ano
      )
  );

}


/* =========================================================
   GERAR DATA DO REGISTRO
========================================================= */

function criarDataAtual() {

  return new Date().toISOString();

}


/* =========================================================
   EXPOSIÇÃO GLOBAL
========================================================= */

window.AUREA_DB = {

  STORAGE_KEY,

  bancoInicial,

  gerarId,

  carregarBanco,

  salvarBanco,

  resetarBanco,

  limparBanco,

  normalizarBanco,

  obterMesAtual,

  obterAnoAtual,

  definirPeriodo,

  pertenceAoMes,

  filtrarPorPeriodo,

  criarDataAtual

};
