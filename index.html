"use strict";

/* ============================================================
   AUREA — DATABASE.JS
   Banco de dados + LocalStorage
   ============================================================ */

const STORAGE_KEY = "AUREA_DB";
const DB_VERSION = 2;

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

function gerarId(prefixo = "item") {

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


/* ============================================================
   DATA ATUAL
   ============================================================ */

function obterAgora() {
  return new Date();
}

function dataHoje() {
  return new Date().toISOString().slice(0, 10);
}


/* ============================================================
   BANCO INICIAL
   ============================================================ */

function criarBancoInicial() {

  const agora = obterAgora();

  const ano = agora.getFullYear();
  const mes = agora.getMonth();

  return {

    versao: DB_VERSION,

    /* ========================================================
       RECEITAS
       ======================================================== */

    receitas: [

      {
        id: gerarId("receita"),

        descricao: "Salário principal",

        valor: 6600,

        categoria: "Salário",

        dataRecebimento:
          `${ano}-${String(mes + 1).padStart(2, "0")}-05`,

        recorrencia: "Mensal",

        observacao: "",

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      }

    ],


    /* ========================================================
       DESPESAS
       ======================================================== */

    despesas: [

      {
        id: gerarId("despesa"),

        descricao: "Aluguel",

        valor: 1300,

        categoria: "Moradia",

        tipo: "Fixa",

        vencimento:
          `${ano}-${String(mes + 1).padStart(2, "0")}-05`,

        dataPagamento: null,

        formaPagamento: "Cartão de débito",

        status: "pendente",

        observacao: "",

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "Net Claro",

        valor: 70,

        categoria: "Internet/Telefone",

        tipo: "Fixa",

        vencimento:
          `${ano}-${String(mes + 1).padStart(2, "0")}-10`,

        dataPagamento: null,

        formaPagamento: "Pix",

        status: "pendente",

        observacao: "",

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "Academia",

        valor: 150,

        categoria: "Academia",

        tipo: "Fixa",

        vencimento:
          `${ano}-${String(mes + 1).padStart(2, "0")}-10`,

        dataPagamento: null,

        formaPagamento: "Pix",

        status: "pendente",

        observacao: "",

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "Curso de inglês",

        valor: 70,

        categoria: "Educação",

        tipo: "Fixa",

        vencimento:
          `${ano}-${String(mes + 1).padStart(2, "0")}-15`,

        dataPagamento: null,

        formaPagamento: "Pix",

        status: "pendente",

        observacao: "",

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "Água",

        valor: 45,

        categoria: "Contas da Casa",

        tipo: "Fixa",

        vencimento:
          `${ano}-${String(mes + 1).padStart(2, "0")}-12`,

        dataPagamento: null,

        formaPagamento: "Pix",

        status: "pendente",

        observacao: "",

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "Transporte",

        valor: 50,

        categoria: "Transporte",

        tipo: "Variável",

        vencimento:
          `${ano}-${String(mes + 1).padStart(2, "0")}-20`,

        dataPagamento: dataHoje(),

        formaPagamento: "Pix",

        status: "paga",

        observacao: "",

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("despesa"),

        descricao: "iFood",

        valor: 65,

        categoria: "Delivery",

        tipo: "Variável",

        vencimento:
          `${ano}-${String(mes + 1).padStart(2, "0")}-20`,

        dataPagamento: dataHoje(),

        formaPagamento: "Cartão",

        status: "paga",

        observacao: "",

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      }

    ],


    /* ========================================================
       CUSTOS FIXOS
       ======================================================== */

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


    /* ========================================================
       INVESTIMENTOS
       ======================================================== */

    investimentos: [

      {
        id: gerarId("investimento"),

        nome: "Investimentos existentes",

        valor: 31500,

        tipo: "Patrimônio",

        instituicao: "",

        data: dataHoje(),

        observacao: "",

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      }

    ],


    /* ========================================================
       LIMITES
       ======================================================== */

    limites: [

      {
        id: gerarId("limite"),

        categoria: "Alimentação",

        limite: 800,

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Transporte",

        limite: 250,

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Delivery",

        limite: 180,

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Lazer",

        limite: 300,

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Vestuário",

        limite: 300,

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Beleza",

        limite: 250,

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      },

      {
        id: gerarId("limite"),

        categoria: "Pets",

        limite: 200,

        mes,

        ano,

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      }

    ],


    /* ========================================================
       DESEJOS
       ======================================================== */

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


    /* ========================================================
       TAREFAS
       ======================================================== */

    tarefas: [

      {
        id: gerarId("tarefa"),

        titulo: "Conferir saldo bancário",

        categoria: "Financeiro",

        prioridade: "Alta",

        status: "pendente",

        recorrente: true,

        data: dataHoje(),

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

        data: dataHoje(),

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

        data: dataHoje(),

        observacao: "",

        criadoEm: agora.toISOString(),

        atualizadoEm: agora.toISOString()
      }

    ],


    /* ========================================================
       PLANEJAMENTOS
       ======================================================== */

    planejamentos: [],


    /* ========================================================
       RELATÓRIOS
       ======================================================== */

    relatorios: [],


    /* ========================================================
       DÍVIDAS
       ======================================================== */

    dividas: [],


    /* ========================================================
       CONFIGURAÇÕES
       ======================================================== */

    config: {

      mes,

      ano,

      moeda: "BRL",

      primeiroDiaSemana: 1

    }

  };
}


/* ============================================================
   NORMALIZAR REGISTROS
   ============================================================ */

function normalizarBanco(banco) {

  const inicial = criarBancoInicial();

  const resultado = {

    versao: DB_VERSION,

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
      : [],

    relatorios: Array.isArray(banco?.relatorios)
      ? banco.relatorios
      : [],

    dividas: Array.isArray(banco?.dividas)
      ? banco.dividas
      : [],

    config: {

      ...inicial.config,

      ...(banco?.config || {})

    }

  };


  /* ========================================================
     CORRIGIR VERSÃO
     ======================================================== */

  resultado.versao = DB_VERSION;


  /* ========================================================
     GARANTIR CONFIGURAÇÃO VÁLIDA
     ======================================================== */

  if (
    !Number.isInteger(Number(resultado.config.mes)) ||
    Number(resultado.config.mes) < 0 ||
    Number(resultado.config.mes) > 11
  ) {

    resultado.config.mes =
      inicial.config.mes;

  }


  if (
    !Number.isInteger(Number(resultado.config.ano)) ||
    Number(resultado.config.ano) < 2000
  ) {

    resultado.config.ano =
      inicial.config.ano;

  }


  /* ========================================================
     GARANTIR CAMPOS DAS DESPESAS
     ======================================================== */

  resultado.despesas =
    resultado.despesas.map(despesa => ({

      ...despesa,

      id:
        despesa.id ||
        gerarId("despesa"),

      descricao:
        despesa.descricao || "Despesa",

      valor:
        Number(despesa.valor) || 0,

      categoria:
        despesa.categoria || "Outros",

      tipo:
        despesa.tipo || "Variável",

      status:
        despesa.status || "pendente",

      formaPagamento:
        despesa.formaPagamento || "Pix",

      observacao:
        despesa.observacao || "",

      mes:
        Number.isInteger(Number(despesa.mes))
          ? Number(despesa.mes)
          : resultado.config.mes,

      ano:
        Number.isInteger(Number(despesa.ano))
          ? Number(despesa.ano)
          : resultado.config.ano

    }));


  /* ========================================================
     GARANTIR CAMPOS DAS RECEITAS
     ======================================================== */

  resultado.receitas =
    resultado.receitas.map(receita => ({

      ...receita,

      id:
        receita.id ||
        gerarId("receita"),

      descricao:
        receita.descricao || "Receita",

      valor:
        Number(receita.valor) || 0,

      categoria:
        receita.categoria || "Outros",

      recorrencia:
        receita.recorrencia || "Única",

      observacao:
        receita.observacao || "",

      mes:
        Number.isInteger(Number(receita.mes))
          ? Number(receita.mes)
          : resultado.config.mes,

      ano:
        Number.isInteger(Number(receita.ano))
          ? Number(receita.ano)
          : resultado.config.ano

    }));


  /* ========================================================
     GARANTIR CAMPOS DOS CUSTOS FIXOS
     ======================================================== */

  resultado.custosFixos =
    resultado.custosFixos.map(custo => ({

      ...custo,

      id:
        custo.id ||
        gerarId("fixo"),

      nome:
        custo.nome || "Custo fixo",

      valor:
        Number(custo.valor) || 0,

      categoria:
        custo.categoria || "Outros",

      diaVencimento:
        Number(custo.diaVencimento) || 1,

      formaPagamento:
        custo.formaPagamento || "Pix",

      recorrencia:
        custo.recorrencia || "Mensal",

      ativo:
        custo.ativo !== false

    }));


  return resultado;
}


/* ============================================================
   MIGRAÇÃO
   ============================================================ */

function migrarBanco(banco) {

  if (!banco) {
    return criarBancoInicial();
  }


  const versaoAtual =
    Number(banco.versao || 1);


  /* ========================================================
     BANCO ANTIGO
     ======================================================== */

  if (versaoAtual < DB_VERSION) {

    console.log(
      `AUREA: migrando banco v${versaoAtual} → v${DB_VERSION}`
    );

    banco =
      normalizarBanco(banco);

    banco.versao =
      DB_VERSION;

    return banco;
  }


  return normalizarBanco(banco);
}


/* ============================================================
   CARREGAR BANCO
   ============================================================ */

function carregarBanco() {

  const dadosSalvos =
    localStorage.getItem(STORAGE_KEY);


  /* ========================================================
     PRIMEIRO ACESSO
     ======================================================== */

  if (!dadosSalvos) {

    const bancoInicial =
      criarBancoInicial();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoInicial)
    );

    return bancoInicial;
  }


  /* ========================================================
     BANCO EXISTENTE
     ======================================================== */

  try {

    const banco =
      JSON.parse(dadosSalvos);


    const bancoMigrado =
      migrarBanco(banco);


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bancoMigrado)
    );


    return bancoMigrado;

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

let DB =
  carregarBanco();


/* ============================================================
   SALVAR BANCO
   ============================================================ */

function salvarBanco() {

  DB.versao =
    DB_VERSION;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(DB)
  );
}


/* ============================================================
   RESETAR BANCO
   ============================================================ */

function resetarBanco() {

  const confirmacao =
    confirm(
      "Isso apagará todos os dados do AUREA. Deseja continuar?"
    );


  if (!confirmacao) {
    return false;
  }


  DB =
    criarBancoInicial();


  salvarBanco();


  return true;
}


/* ============================================================
   CONSULTAS POR PERÍODO
   ============================================================ */

function pertenceAoMes(
  item,
  mes,
  ano
) {

  return (

    Number(item?.mes) === Number(mes) &&

    Number(item?.ano) === Number(ano)

  );
}


function obterMesAtual() {

  return Number(
    DB.config?.mes
  );
}


function obterAnoAtual() {

  return Number(
    DB.config?.ano
  );
}


function obterPeriodoAtual() {

  return {

    mes:
      obterMesAtual(),

    ano:
      obterAnoAtual()

  };
}


function definirPeriodo(
  mes,
  ano
) {

  DB.config.mes =
    Number(mes);

  DB.config.ano =
    Number(ano);

  salvarBanco();
}


/* ============================================================
   GERENCIAMENTO GENÉRICO
   ============================================================ */

function adicionarRegistro(
  colecao,
  registro
) {

  if (
    !Array.isArray(DB[colecao])
  ) {

    console.error(
      `Coleção "${colecao}" não existe no banco.`
    );

    return null;
  }


  const agora =
    new Date().toISOString();


  const novoRegistro = {

    id:
      registro?.id ||
      gerarId(colecao),

    ...registro,

    criadoEm:
      registro?.criadoEm ||
      agora,

    atualizadoEm:
      agora

  };


  DB[colecao].push(
    novoRegistro
  );


  salvarBanco();


  return novoRegistro;
}


/* ============================================================
   ATUALIZAR
   ============================================================ */

function atualizarRegistro(
  colecao,
  id,
  alteracoes
) {

  if (
    !Array.isArray(DB[colecao])
  ) {

    console.error(
      `Coleção "${colecao}" não existe.`
    );

    return null;
  }


  const indice =
    DB[colecao].findIndex(
      item =>
        String(item.id) === String(id)
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


/* ============================================================
   EXCLUIR
   ============================================================ */

function excluirRegistro(
  colecao,
  id
) {

  if (
    !Array.isArray(DB[colecao])
  ) {

    return false;
  }


  const tamanhoAntes =
    DB[colecao].length;


  DB[colecao] =
    DB[colecao].filter(
      item =>
        String(item.id) !== String(id)
    );


  const removido =
    DB[colecao].length <
    tamanhoAntes;


  if (removido) {
    salvarBanco();
  }


  return removido;
}


/* ============================================================
   BUSCAR
   ============================================================ */

function buscarRegistro(
  colecao,
  id
) {

  if (
    !Array.isArray(DB[colecao])
  ) {

    return null;
  }


  return (
    DB[colecao].find(
      item =>
        String(item.id) === String(id)
    ) || null
  );
}


/* ============================================================
   EXPORTAÇÃO
   ============================================================ */

export {

  STORAGE_KEY,

  DB,

  DB_VERSION,

  gerarId,

  criarBancoInicial,

  carregarBanco,

  migrarBanco,

  normalizarBanco,

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
