"use strict";

/* =====================================================
   AUREA — SERVICES
   Regras e cálculos financeiros do sistema

   Este arquivo NÃO renderiza HTML.
   Ele apenas trabalha com os dados do DB.
===================================================== */


/* =====================================================
   PERÍODO ATUAL
===================================================== */

function obterPeriodoAtual() {
  return {
    mes: Number(DB.config.mes),
    ano: Number(DB.config.ano)
  };
}


/* =====================================================
   FILTRAR REGISTROS DO MÊS
===================================================== */

function registrosDoMes(lista, mes = mesAtual(), ano = anoAtual()) {
  if (!Array.isArray(lista)) {
    return [];
  }

  return lista.filter(item =>
    pertenceAoMes(item, mes, ano)
  );
}


/* =====================================================
   RECEITAS DO MÊS
===================================================== */

function receitasDoMes(mes = mesAtual(), ano = anoAtual()) {
  return registrosDoMes(
    DB.receitas,
    mes,
    ano
  );
}


function totalReceitasDoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return receitasDoMes(mes, ano).reduce(
    (total, item) =>
      total + numero(item.valor),
    0
  );
}


/* =====================================================
   DESPESAS DO MÊS
===================================================== */

function despesasDoMes(mes = mesAtual(), ano = anoAtual()) {
  return registrosDoMes(
    DB.despesas,
    mes,
    ano
  );
}


function totalDespesasDoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return despesasDoMes(mes, ano).reduce(
    (total, item) =>
      total + numero(item.valor),
    0
  );
}


/* =====================================================
   DESPESAS FIXAS DO MÊS
===================================================== */

function despesasFixasDoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return despesasDoMes(mes, ano)
    .filter(item =>
      String(item.tipo || "").toLowerCase() === "fixa"
    );
}


function totalDespesasFixasDoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return despesasFixasDoMes(mes, ano).reduce(
    (total, item) =>
      total + numero(item.valor),
    0
  );
}


/* =====================================================
   DESPESAS VARIÁVEIS
===================================================== */

function despesasVariaveisDoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return despesasDoMes(mes, ano)
    .filter(item =>
      String(item.tipo || "").toLowerCase() !== "fixa"
    );
}


function totalDespesasVariaveisDoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return despesasVariaveisDoMes(mes, ano).reduce(
    (total, item) =>
      total + numero(item.valor),
    0
  );
}


/* =====================================================
   SALDO DO MÊS
===================================================== */

function saldoDoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return (
    totalReceitasDoMes(mes, ano) -
    totalDespesasDoMes(mes, ano)
  );
}


/* =====================================================
   PERCENTUAL ECONOMIZADO
===================================================== */

function percentualEconomizado(
  mes = mesAtual(),
  ano = anoAtual()
) {
  const receitas =
    totalReceitasDoMes(mes, ano);

  if (receitas <= 0) {
    return 0;
  }

  const saldo =
    saldoDoMes(mes, ano);

  return Math.max(
    0,
    (saldo / receitas) * 100
  );
}


/* =====================================================
   PERCENTUAL DA RENDA UTILIZADA
===================================================== */

function percentualRendaUtilizada(
  mes = mesAtual(),
  ano = anoAtual()
) {
  const receitas =
    totalReceitasDoMes(mes, ano);

  if (receitas <= 0) {
    return 0;
  }

  return (
    totalDespesasDoMes(mes, ano) /
    receitas
  ) * 100;
}


/* =====================================================
   INVESTIMENTOS
===================================================== */

function totalInvestimentos() {
  return DB.investimentos.reduce(
    (total, item) =>
      total + numero(item.valor),
    0
  );
}


function investimentosDoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return registrosDoMes(
    DB.investimentos,
    mes,
    ano
  );
}


function totalInvestidoNoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return investimentosDoMes(mes, ano).reduce(
    (total, item) =>
      total + numero(item.valor),
    0
  );
}


/* =====================================================
   DESEJOS
===================================================== */

function totalDesejos() {
  return DB.desejos.reduce(
    (total, item) =>
      total + numero(item.valor),
    0
  );
}


function totalGuardadoDesejos() {
  return DB.desejos.reduce(
    (total, item) =>
      total + numero(item.guardado),
    0
  );
}


function totalFaltaDesejos() {
  return Math.max(
    0,
    totalDesejos() -
    totalGuardadoDesejos()
  );
}


/* =====================================================
   DADOS DE UMA META
===================================================== */

function calcularDesejo(desejo) {
  const valor =
    numero(desejo.valor);

  const guardado =
    numero(desejo.guardado);

  const restante =
    Math.max(0, valor - guardado);

  let meses = 0;

  /*
    O prazo pode vir como:
    "5 meses"
    "5"
    ou número.
  */

  if (desejo.prazo !== undefined) {
    const texto =
      String(desejo.prazo);

    const encontrado =
      texto.match(/\d+/);

    if (encontrado) {
      meses =
        Number(encontrado[0]);
    }
  }

  const valorMensal =
    meses > 0
      ? restante / meses
      : 0;

  const valorSemanal =
    meses > 0
      ? restante / (meses * 4.345)
      : 0;

  const percentualGuardado =
    valor > 0
      ? (guardado / valor) * 100
      : 0;

  return {
    valor,
    guardado,
    restante,
    meses,
    valorMensal,
    valorSemanal,
    percentualGuardado
  };
}


/* =====================================================
   GASTOS POR CATEGORIA
===================================================== */

function gastosPorCategoria(
  mes = mesAtual(),
  ano = anoAtual()
) {
  const resultado = {};

  despesasDoMes(mes, ano).forEach(item => {

    const categoria =
      item.categoria || "Outros";

    if (!resultado[categoria]) {
      resultado[categoria] = 0;
    }

    resultado[categoria] +=
      numero(item.valor);
  });

  return resultado;
}


/* =====================================================
   GASTO DE UMA CATEGORIA
===================================================== */

function gastoDaCategoria(
  categoria,
  mes = mesAtual(),
  ano = anoAtual()
) {
  return despesasDoMes(mes, ano)
    .filter(item =>
      item.categoria === categoria
    )
    .reduce(
      (total, item) =>
        total + numero(item.valor),
      0
    );
}


/* =====================================================
   LIMITE DE UMA CATEGORIA
===================================================== */

function limiteDaCategoria(
  categoria,
  mes = mesAtual(),
  ano = anoAtual()
) {
  const limite =
    DB.limites.find(item =>
      item.categoria === categoria &&
      Number(item.mes) === Number(mes) &&
      Number(item.ano) === Number(ano)
    );

  return limite
    ? numero(limite.limite)
    : 0;
}


/* =====================================================
   STATUS DO LIMITE
===================================================== */

function analisarLimite(
  limite,
  mes = mesAtual(),
  ano = anoAtual()
) {
  const gasto =
    gastoDaCategoria(
      limite.categoria,
      mes,
      ano
    );

  const valorLimite =
    numero(limite.limite);

  const restante =
    valorLimite - gasto;

  const percentualUso =
    valorLimite > 0
      ? (gasto / valorLimite) * 100
      : 0;

  let status = "normal";

  if (percentualUso >= 100) {
    status = "excedido";
  } else if (percentualUso >= 80) {
    status = "alerta";
  }

  const dias =
    diasRestantesNoMes(
      mes,
      ano
    );

  const mediaDiaria =
    restante > 0
      ? restante / dias
      : 0;

  return {
    categoria: limite.categoria,
    limite: valorLimite,
    gasto,
    restante,
    percentualUso,
    mediaDiaria,
    status
  };
}


/* =====================================================
   TODOS OS LIMITES DO MÊS
===================================================== */

function limitesDoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return DB.limites.filter(item =>
    Number(item.mes) === Number(mes) &&
    Number(item.ano) === Number(ano)
  );
}


/* =====================================================
   CONTAS FIXAS
===================================================== */

function custosFixosAtivos() {
  return DB.custosFixos.filter(
    item => item.ativo !== false
  );
}


/* =====================================================
   TOTAL DOS CUSTOS FIXOS
===================================================== */

function totalCustosFixos() {
  return custosFixosAtivos().reduce(
    (total, item) =>
      total + numero(item.valor),
    0
  );
}


/* =====================================================
   VERIFICAR SE DESPESA JÁ FOI GERADA
===================================================== */

function despesaFixaJaGerada(
  custoFixo,
  mes,
  ano
) {
  return DB.despesas.some(item =>
    item.custoFixoId === custoFixo.id &&
    Number(item.mes) === Number(mes) &&
    Number(item.ano) === Number(ano)
  );
}


/* =====================================================
   GERAR DESPESAS FIXAS DO MÊS
===================================================== */

function gerarDespesasFixasDoMes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  const custos =
    custosFixosAtivos();

  let quantidadeGerada = 0;

  custos.forEach(custo => {

    if (
      despesaFixaJaGerada(
        custo,
        mes,
        ano
      )
    ) {
      return;
    }

    const dia =
      String(
        custo.diaVencimento || 1
      ).padStart(2, "0");

    const mesFormatado =
      String(Number(mes) + 1)
        .padStart(2, "0");

    const data =
      `${ano}-${mesFormatado}-${dia}`;

    DB.despesas.push({

      id: gerarId("despesa"),

      custoFixoId:
        custo.id,

      descricao:
        custo.nome,

      valor:
        numero(custo.valor),

      categoria:
        custo.categoria || "Outros",

      tipo:
        "Fixa",

      vencimento:
        data,

      data:
        data,

      pagamento:
        custo.formaPagamento ||
        "Não informado",

      status:
        "pendente",

      mes:
        Number(mes),

      ano:
        Number(ano),

      observacao:
        "",

      criadoEm:
        dataAtualISO(),

      atualizadoEm:
        dataAtualISO()
    });

    quantidadeGerada++;
  });

  if (quantidadeGerada > 0) {
    salvar();
  }

  return quantidadeGerada;
}


/* =====================================================
   VALOR COMPROMETIDO COM FIXAS
===================================================== */

function valorComprometidoComFixas(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return totalDespesasFixasDoMes(
    mes,
    ano
  );
}


/* =====================================================
   VALOR DISPONÍVEL
===================================================== */

function valorDisponivel(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return Math.max(
    0,
    saldoDoMes(mes, ano)
  );
}


/* =====================================================
   VALOR DISPONÍVEL PARA METAS
===================================================== */

function valorDisponivelParaMetas(
  mes = mesAtual(),
  ano = anoAtual()
) {
  const saldo =
    saldoDoMes(mes, ano);

  const investimentos =
    totalInvestidoNoMes(
      mes,
      ano
    );

  return Math.max(
    0,
    saldo - investimentos
  );
}


/* =====================================================
   MÉDIA DOS MESES ANTERIORES
===================================================== */

function mediaDespesasAnteriores(
  quantidade = 3
) {
  let total = 0;
  let mesesValidos = 0;

  const mesAtualNumero =
    mesAtual();

  const anoAtualNumero =
    anoAtual();

  for (
    let i = 1;
    i <= quantidade;
    i++
  ) {

    let mes =
      mesAtualNumero - i;

    let ano =
      anoAtualNumero;

    if (mes < 0) {
      mes += 12;
      ano--;
    }

    const despesas =
      totalDespesasDoMes(
        mes,
        ano
      );

    if (despesas > 0) {
      total += despesas;
      mesesValidos++;
    }
  }

  if (mesesValidos === 0) {
    return 0;
  }

  return total / mesesValidos;
}


/* =====================================================
   COMPARAR DESPESAS COM MÉDIA
===================================================== */

function compararDespesasComMedia() {
  const atual =
    totalDespesasDoMes();

  const media =
    mediaDespesasAnteriores();

  if (media <= 0) {
    return {
      atual,
      media,
      variacao: 0,
      acima: false
    };
  }

  const variacao =
    ((atual - media) / media) * 100;

  return {
    atual,
    media,
    variacao,
    acima: atual > media
  };
}


/* =====================================================
   DESPESAS PENDENTES
===================================================== */

function despesasPendentes(
  mes = mesAtual(),
  ano = anoAtual()
) {
  return despesasDoMes(
    mes,
    ano
  ).filter(item =>
    String(item.status).toLowerCase() ===
    "pendente"
  );
}


/* =====================================================
   DESPESAS VENCIDAS
===================================================== */

function despesasVencidas(
  mes = mesAtual(),
  ano = anoAtual()
) {
  const hoje =
    dataHoje();

  return despesasDoMes(
    mes,
    ano
  ).filter(item => {

    if (
      String(item.status).toLowerCase() ===
      "paga"
    ) {
      return false;
    }

    return (
      item.vencimento &&
      item.vencimento < hoje
    );
  });
}


/* =====================================================
   DESPESAS PRÓXIMAS DO VENCIMENTO
===================================================== */

function despesasProximasVencimento(
  dias = 3,
  mes = mesAtual(),
  ano = anoAtual()
) {
  const hoje =
    new Date();

  const limite =
    new Date();

  limite.setDate(
    limite.getDate() + dias
  );

  return despesasDoMes(
    mes,
    ano
  ).filter(item => {

    if (
      String(item.status).toLowerCase() ===
      "paga"
    ) {
      return false;
    }

    if (!item.vencimento) {
      return false;
    }

    const vencimento =
      new Date(
        `${item.vencimento}T00:00:00`
      );

    return (
      vencimento >= hoje &&
      vencimento <= limite
    );
  });
}


/* =====================================================
   ANÁLISE FINANCEIRA DO MÊS
===================================================== */

function resumoFinanceiro(
  mes = mesAtual(),
  ano = anoAtual()
) {

  const receitas =
    totalReceitasDoMes(
      mes,
      ano
    );

  const despesas =
    totalDespesasDoMes(
      mes,
      ano
    );

  const fixas =
    totalDespesasFixasDoMes(
      mes,
      ano
    );

  const variaveis =
    totalDespesasVariaveisDoMes(
      mes,
      ano
    );

  const saldo =
    receitas - despesas;

  const economizado =
    percentualEconomizado(
      mes,
      ano
    );

  const investido =
    totalInvestidoNoMes(
      mes,
      ano
    );

  return {

    receitas,

    despesas,

    fixas,

    variaveis,

    saldo,

    investido,

    economizado,

    percentualUtilizado:
      receitas > 0
        ? (despesas / receitas) * 100
        : 0,

    disponivel:
      Math.max(0, saldo)

  };
}


/* =====================================================
   COMPARAÇÃO ENTRE DOIS MESES
===================================================== */

function compararMeses(
  mesAtualNumero,
  anoAtualNumero,
  mesAnterior,
  anoAnterior
) {

  const atual =
    resumoFinanceiro(
      mesAtualNumero,
      anoAtualNumero
    );

  const anterior =
    resumoFinanceiro(
      mesAnterior,
      anoAnterior
    );

  return {

    receitas:
      variacaoPercentual(
        atual.receitas,
        anterior.receitas
      ),

    despesas:
      variacaoPercentual(
        atual.despesas,
        anterior.despesas
      ),

    saldo:
      variacaoPercentual(
        atual.saldo,
        anterior.saldo
      ),

    investimentos:
      variacaoPercentual(
        atual.investido,
        anterior.investido
      ),

    economia:
      atual.economizado -
      anterior.economizado

  };
}


/* =====================================================
   MÊS ANTERIOR
===================================================== */

function obterMesAnterior(
  mes = mesAtual(),
  ano = anoAtual()
) {

  let novoMes =
    Number(mes) - 1;

  let novoAno =
    Number(ano);

  if (novoMes < 0) {
    novoMes = 11;
    novoAno--;
  }

  return {
    mes: novoMes,
    ano: novoAno
  };
}


/* =====================================================
   MÊS POSTERIOR
===================================================== */

function obterMesPosterior(
  mes = mesAtual(),
  ano = anoAtual()
) {

  let novoMes =
    Number(mes) + 1;

  let novoAno =
    Number(ano);

  if (novoMes > 11) {
    novoMes = 0;
    novoAno++;
  }

  return {
    mes: novoMes,
    ano: novoAno
  };
}


/* =====================================================
   PROJEÇÃO DO MÊS
===================================================== */

function projetarMes(
  mes = mesAtual(),
  ano = anoAtual()
) {

  const receitas =
    totalReceitasDoMes(
      mes,
      ano
    );

  const fixas =
    totalDespesasFixasDoMes(
      mes,
      ano
    );

  const variaveis =
    totalDespesasVariaveisDoMes(
      mes,
      ano
    );

  const investimentos =
    totalInvestidoNoMes(
      mes,
      ano
    );

  const metas =
    totalGuardadoDesejos();

  const saldo =
    receitas -
    fixas -
    variaveis -
    investimentos;

  return {

    receitas,

    fixas,

    variaveis,

    investimentos,

    metas,

    saldo

  };
}
