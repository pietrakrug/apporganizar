"use strict";

/* ============================================================
   AUREA — DATABASE.JS
   Banco de dados + LocalStorage
   ============================================================ */

const STORAGE_KEY = "AUREA_DB";

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

function gerarId(prefixo = "item") {
  if (window.crypto && crypto.randomUUID) {
    return `${prefixo}-${crypto.randomUUID()}`;
  }

  return `${prefixo}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}


/* ============================================================
   ESTRUTURA DO BANCO
   ============================================================ */

function criarBancoInicial() {

  const agora = new Date();

  return {

    /* --------------------------------------------------------
       RECEITAS
    -------------------------------------------------------- */

    receitas: [
      {
        id: gerarId("receita"),
        descricao: "Salário principal",
        valor: 6600,
        categoria: "Salário",

        dataRecebimento: agora.toISOString().slice(0, 10),

        recorrencia: "Mensal",

        observacao: "",

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      }
    ],


    /* --------------------------------------------------------
       DESPESAS
    -------------------------------------------------------- */

    despesas: [
      {
        id: gerarId("despesa"),

        descricao: "Aluguel",

        valor: 1300,

        categoria: "Moradia",

        tipo: "Fixa",

        vencimento: `${agora.getFullYear()}-${String(
          agora.getMonth() + 1
        ).padStart(2, "0")}-05`,

        dataPagamento: null,

        formaPagamento: "Cartão de débito",

        status: "pendente",

        observacao: "",

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "Net Claro",

        valor: 70,

        categoria: "Internet/Telefone",

        tipo: "Fixa",

        vencimento: `${agora.getFullYear()}-${String(
          agora.getMonth() + 1
        ).padStart(2, "0")}-10`,

        dataPagamento: null,

        formaPagamento: "Pix",

        status: "pendente",

        observacao: "",

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "Academia",

        valor: 150,

        categoria: "Academia",

        tipo: "Fixa",

        vencimento: `${agora.getFullYear()}-${String(
          agora.getMonth() + 1
        ).padStart(2, "0")}-10`,

        dataPagamento: null,

        formaPagamento: "Pix",

        status: "pendente",

        observacao: "",

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "Curso de inglês",

        valor: 70,

        categoria: "Educação",

        tipo: "Fixa",

        vencimento: `${agora.getFullYear()}-${String(
          agora.getMonth() + 1
        ).padStart(2, "0")}-15`,

        dataPagamento: null,

        formaPagamento: "Pix",

        status: "pendente",

        observacao: "",

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "Água",

        valor: 45,

        categoria: "Contas da Casa",

        tipo: "Fixa",

        vencimento: `${agora.getFullYear()}-${String(
          agora.getMonth() + 1
        ).padStart(2, "0")}-12`,

        dataPagamento: null,

        formaPagamento: "Pix",

        status: "pendente",

        observacao: "",

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "Transporte",

        valor: 50,

        categoria: "Transporte",

        tipo: "Variável",

        vencimento: `${agora.getFullYear()}-${String(
          agora.getMonth() + 1
        ).padStart(2, "0")}-20`,

        dataPagamento: null,

        formaPagamento: "Pix",

        status: "paga",

        observacao: "",

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "iFood",

        valor: 65,

        categoria: "Delivery",

        tipo: "Variável",

        vencimento: `${agora.getFullYear()}-${String(
          agora.getMonth() + 1
        ).padStart(2, "0")}-20`,

        dataPagamento: agora.toISOString().slice(0, 10),

        formaPagamento: "Cartão",

        status: "paga",

        observacao: "",

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      }
    ],


    /* --------------------------------------------------------
       CUSTOS FIXOS
    -------------------------------------------------------- */

    custosFixos: [

      {
        id: gerarId("fixo"),

        nome: "Aluguel",

        valor: 1300,

        categoria: "Moradia",

        diaVencimento: 5,

        formaPagamento: "Cartão de débito",

        recorrencia: "Mensal",

        ativo: true,

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("fixo"),

        nome: "Net Claro",

        valor: 70,

        categoria: "Internet/Telefone",

        diaVencimento: 10,

        formaPagamento: "Pix",

        recorrencia: "Mensal",

        ativo: true,

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("fixo"),

        nome: "Academia",

        valor: 150,

        categoria: "Academia",

        diaVencimento: 10,

        formaPagamento: "Pix",

        recorrencia: "Mensal",

        ativo: true,

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("fixo"),

        nome: "Curso de inglês",

        valor: 70,

        categoria: "Educação",

        diaVencimento: 15,

        formaPagamento: "Pix",

        recorrencia: "Mensal",

        ativo: true,

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("fixo"),

        nome: "Água",

        valor: 45,

        categoria: "Contas da Casa",

        diaVencimento: 12,

        formaPagamento: "Pix",

        recorrencia: "Mensal",

        ativo: true,

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      }

    ],


    /* --------------------------------------------------------
       INVESTIMENTOS
    -------------------------------------------------------- */

    investimentos: [

      {
        id: gerarId("investimento"),

        nome: "Investimentos existentes",

        valor: 31500,

        tipo: "Patrimônio",

        instituicao: "",

        data: agora.toISOString().slice(0, 10),

        observacao: "",

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      }

    ],


    /* --------------------------------------------------------
       LIMITES
    -------------------------------------------------------- */

    limites: [

      {
        id: gerarId("limite"),

        categoria: "Alimentação",

        limite: 800,

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Transporte",

        limite: 250,

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Delivery",

        limite: 180,

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Lazer",

        limite: 300,

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Vestuário",

        limite: 300,

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Beleza",

        limite: 250,

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Pets",

        limite: 200,

        mes: agora.getMonth(),
        ano: agora.getFullYear(),

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      }

    ],


    /* --------------------------------------------------------
       DESEJOS / METAS
    -------------------------------------------------------- */

    desejos: [

      {
        id: gerarId("desejo"),

        nome: "Apple iPad Wi-Fi 128 GB",

        valor: 3399,

        guardado: 1200,

        dataDesejada: null,

        prazoMeses: 5,

        prioridade: "Alta",

        categoria: "Tecnologia",

        imagem: "",

        icone: "📱",

        observacao: "",

        status: "Em andamento",

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      }

    ],


    /* --------------------------------------------------------
       TAREFAS
    -------------------------------------------------------- */

    tarefas: [

      {
        id: gerarId("tarefa"),

        titulo: "Conferir saldo bancário",

        categoria: "Financeiro",

        prioridade: "Alta",

        status: "pendente",

        recorrente: true,

        data: agora.toISOString().slice(0, 10),

        observacao: "",

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("tarefa"),

        titulo: "Registrar despesas do dia",

        categoria: "Financeiro",

        prioridade: "Média",

        status: "pendente",

        recorrente: true,

        data: agora.toISOString().slice(0, 10),

        observacao: "",

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("tarefa"),

        titulo: "Conferir contas próximas do vencimento",

        categoria: "Financeiro",

        prioridade: "Alta",

        status: "pendente",

        recorrente: true,

        data: agora.toISOString().slice(0, 10),

        observacao: "",

        criadoEm: agora.toISOString(),
        atualizadoEm: agora.toISOString()
      }

    ],


    /* --------------------------------------------------------
       PLANEJAMENTOS
    -------------------------------------------------------- */

    planejamentos: [],


    /* --------------------------------------------------------
       RELATÓRIOS
       
       Não vamos armazenar relatórios manualmente agora.
       Eles serão calculados posteriormente a partir dos
       demais dados.
    -------------------------------------------------------- */

    relatorios: [],


    /* --------------------------------------------------------
       DÍVIDAS
    -------------------------------------------------------- */

    dividas: [],


    /* --------------------------------------------------------
       CONFIGURAÇÕES
    -------------------------------------------------------- */

    config: {

      mes: agora.getMonth(),

      ano: agora.getFullYear(),

      moeda: "BRL",

      primeiroDiaSemana: 1

    }

  };
}


/* ============================================================
   GARANTIR ESTRUTURA
   ============================================================ */

function normalizarBanco(banco) {

  const inicial = criarBancoInicial();

  return {

    receitas: Array.isArray(banco?.receitas)
      ? banco.receitas
      : inicial.receitas,

    despesas: Array.isArray(banco?.despesas)
      ? banco.despesas
      : inicial.despesas,

    custosFixos: Array.isArray(banco?.custosFixos)
      ? banco.custosFixos
      : inicial.custosFixos,

    investimentos: Array.isArray(banco?.investimentos)
      ? banco.investimentos
      : inicial.investimentos,

    limites: Array.isArray(banco?.limites)
      ? banco.limites
      : inicial.limites,

    desejos: Array.isArray(banco?.desejos)
      ? banco.desejos
      : inicial.desejos,

    tarefas: Array.isArray(banco?.tarefas)
      ? banco.tarefas
      : inicial.tarefas,

    planejamentos: Array.isArray(banco?.planejamentos)
      ? banco.planejamentos
      : inicial.planejamentos,

    relatorios: Array.isArray(banco?.relatorios)
      ? banco.relatorios
      : inicial.relatorios,

    dividas: Array.isArray(banco?.dividas)
      ? banco.dividas
      : [],

    config: {

      ...inicial.config,

      ...(banco?.config || {})

    }

  };
}


/* ============================================================
   CARREGAR BANCO
   ============================================================ */

function carregarBanco() {

  const dadosSalvos =
    localStorage.getItem(STORAGE_KEY);


  /* Primeiro acesso */

  if (!dadosSalvos) {

    const bancoInicial =
      criarBancoInicial();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoInicial)
    );

    return bancoInicial;
  }


  /* Banco existente */

  try {

    const banco =
      JSON.parse(dadosSalvos);

    const bancoNormalizado =
      normalizarBanco(banco);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoNormalizado)
    );

    return bancoNormalizado;

  } catch (erro) {

    console.error(
      "Erro ao carregar banco AUREA:",
      erro
    );


    const bancoInicial =
      criarBancoInicial();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoInicial)
    );

    return bancoInicial;
  }
}


/* ============================================================
   BANCO GLOBAL
   ============================================================ */

let DB = carregarBanco();


/* ============================================================
   SALVAR BANCO
   ============================================================ */

function salvarBanco() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(DB)
  );
}


/* ============================================================
   RESETAR BANCO
   ============================================================ */

function resetarBanco() {

  const confirmacao = confirm(
    "Isso apagará todos os dados do AUREA. Deseja continuar?"
  );

  if (!confirmacao) {
    return false;
  }

  DB = criarBancoInicial();

  salvarBanco();

  return true;
}


/* ============================================================
   CONSULTAS POR PERÍODO
   ============================================================ */

function pertenceAoMes(item, mes, ano) {

  return (
    Number(item.mes) === Number(mes) &&
    Number(item.ano) === Number(ano)
  );
}


function obterMesAtual() {

  return Number(DB.config.mes);
}


function obterAnoAtual() {

  return Number(DB.config.ano);
}


function obterPeriodoAtual() {

  return {

    mes: obterMesAtual(),

    ano: obterAnoAtual()

  };
}


function definirPeriodo(mes, ano) {

  DB.config.mes = Number(mes);

  DB.config.ano = Number(ano);

  salvarBanco();

}


/* ============================================================
   GERENCIAMENTO GENÉRICO
   ============================================================ */

function adicionarRegistro(
  colecao,
  registro
) {

  if (!Array.isArray(DB[colecao])) {

    console.error(
      `Coleção "${colecao}" não existe no banco.`
    );

    return null;
  }

  const agora =
    new Date().toISOString();

  const novoRegistro = {

    id: registro.id || gerarId(colecao),

    ...registro,

    criadoEm:
      registro.criadoEm || agora,

    atualizadoEm:
      agora

  };

  DB[colecao].push(novoRegistro);

  salvarBanco();

  return novoRegistro;
}


function atualizarRegistro(
  colecao,
  id,
  alteracoes
) {

  if (!Array.isArray(DB[colecao])) {
    return null;
  }

  const indice =
    DB[colecao].findIndex(
      item => item.id === id
    );

  if (indice === -1) {
    return null;
  }

  DB[colecao][indice] = {

    ...DB[colecao][indice],

    ...alteracoes,

    atualizadoEm:
      new Date().toISOString()

  };

  salvarBanco();

  return DB[colecao][indice];
}


function excluirRegistro(
  colecao,
  id
) {

  if (!Array.isArray(DB[colecao])) {
    return false;
  }

  const tamanhoAntes =
    DB[colecao].length;

  DB[colecao] =
    DB[colecao].filter(
      item => item.id !== id
    );

  const removido =
    DB[colecao].length <
    tamanhoAntes;

  if (removido) {
    salvarBanco();
  }

  return removido;
}


function buscarRegistro(
  colecao,
  id
) {

  if (!Array.isArray(DB[colecao])) {
    return null;
  }

  return DB[colecao].find(
    item => item.id === id
  ) || null;
}


/* ============================================================
   EXPORTAÇÃO PARA OS OUTROS MÓDULOS
   ============================================================ */

export {

  STORAGE_KEY,

  DB,

  gerarId,

  criarBancoInicial,

  carregarBanco,

  salvarBanco,

  resetarBanco,

  pertenceAoMes,

  obterMesAtual,

  obterAnoAtual,

  obterPeriodoAtual,

  definirPeriodo,

  adicionarRegistro,

  atualizarRegistro,

  excluirRegistro,

  buscarRegistro

};
