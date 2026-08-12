"use strict";

/* =========================================================
   AUREA
   UTILS.JS
   Funções utilitárias compartilhadas pelo sistema
========================================================= */


/* =========================================================
   MOEDA
========================================================= */

function moeda(valor) {

  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

}


/* =========================================================
   NÚMERO
========================================================= */

function numero(valor) {

  const resultado = Number(valor);

  return Number.isFinite(resultado)
    ? resultado
    : 0;

}


/* =========================================================
   ID
========================================================= */

function gerarId(prefixo = "id") {

  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {

    return `${prefixo}-${window.crypto.randomUUID()}`;

  }

  return (
    prefixo +
    "-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(16)
      .slice(2)
  );

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapar(valor) {

  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   DATA ATUAL
========================================================= */

function dataAtual() {

  const agora = new Date();

  const ano =
    agora.getFullYear();

  const mes =
    String(
      agora.getMonth() + 1
    ).padStart(2, "0");

  const dia =
    String(
      agora.getDate()
    ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;

}


/* =========================================================
   DATA / HORA
========================================================= */

function dataHoraAtual() {

  return new Date().toISOString();

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(data) {

  if (!data) {
    return "-";
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return "-";
  }

  return valor.toLocaleDateString(
    "pt-BR"
  );

}


/* =========================================================
   FORMATAR DATA PARA INPUT
========================================================= */

function formatarDataInput(data) {

  if (!data) {
    return "";
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return "";
  }

  const ano =
    valor.getFullYear();

  const mes =
    String(
      valor.getMonth() + 1
    ).padStart(2, "0");

  const dia =
    String(
      valor.getDate()
    ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;

}


/* =========================================================
   CONVERTER INPUT DE DATA
========================================================= */

function dataDoInput(valor) {

  if (!valor) {
    return null;
  }

  const partes =
    valor.split("-");

  if (partes.length !== 3) {
    return null;
  }

  const ano =
    Number(partes[0]);

  const mes =
    Number(partes[1]) - 1;

  const dia =
    Number(partes[2]);

  const data =
    new Date(
      ano,
      mes,
      dia
    );

  if (
    Number.isNaN(
      data.getTime()
    )
  ) {
    return null;
  }

  return data;

}


/* =========================================================
   MÊS
========================================================= */

function obterMesAtual() {

  return new Date().getMonth();

}


/* =========================================================
   ANO
========================================================= */

function obterAnoAtual() {

  return new Date().getFullYear();

}


/* =========================================================
   NOME DO MÊS
========================================================= */

function nomeMes(
  mes,
  formato = "longo"
) {

  const nomesLongos = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];


  const nomesCurtos = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Jul",
    "Set",
    "Out",
    "Nov",
    "Dez"
  ];


  const indice =
    Number(mes);


  if (
    indice < 0 ||
    indice > 11 ||
    !Number.isInteger(indice)
  ) {

    return "";

  }


  return formato === "curto"
    ? nomesCurtos[indice]
    : nomesLongos[indice];

}


/* =========================================================
   PERÍODO
========================================================= */

function periodoTexto(
  mes,
  ano
) {

  return `${nomeMes(mes)} de ${ano}`;

}


/* =========================================================
   COMPARAR PERÍODO
========================================================= */

function mesmoPeriodo(
  item,
  mes,
  ano
) {

  if (!item) {
    return false;
  }


  /*
    Registros novos devem possuir
    mes e ano.
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
    Compatibilidade com registros
    antigos que possuem apenas data.
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
   FILTRAR POR PERÍODO
========================================================= */

function filtrarPeriodo(
  lista,
  mes,
  ano
) {

  if (!Array.isArray(lista)) {
    return [];
  }

  return lista.filter(
    item =>
      mesmoPeriodo(
        item,
        mes,
        ano
      )
  );

}


/* =========================================================
   FILTRAR POR MÊS E ANO ATUAIS
========================================================= */

function filtrarMesAtual(
  lista
) {

  const hoje =
    new Date();

  return filtrarPeriodo(
    lista,
    hoje.getMonth(),
    hoje.getFullYear()
  );

}


/* =========================================================
   PERCENTUAL
========================================================= */

function percentual(
  valor,
  total
) {

  const numeroValor =
    Number(valor || 0);

  const numeroTotal =
    Number(total || 0);


  if (
    numeroTotal <= 0
  ) {

    return 0;

  }


  return (
    numeroValor /
    numeroTotal
  ) * 100;

}


/* =========================================================
   PERCENTUAL LIMITADO
========================================================= */

function percentualLimitado(
  valor,
  total
) {

  return Math.min(
    100,
    Math.max(
      0,
      percentual(
        valor,
        total
      )
    )
  );

}


/* =========================================================
   DIFERENÇA PERCENTUAL
========================================================= */

function variacaoPercentual(
  atual,
  anterior
) {

  const valorAtual =
    Number(atual || 0);

  const valorAnterior =
    Number(anterior || 0);


  if (
    valorAnterior === 0
  ) {

    if (
      valorAtual === 0
    ) {
      return 0;
    }

    return 100;

  }


  return (
    (
      valorAtual -
      valorAnterior
    ) /
    Math.abs(valorAnterior)
  ) * 100;

}


/* =========================================================
   TEXTO DE VARIAÇÃO
========================================================= */

function textoVariacao(
  atual,
  anterior
) {

  const variacao =
    variacaoPercentual(
      atual,
      anterior
    );


  if (
    variacao > 0
  ) {

    return `+${variacao.toFixed(2)}%`;

  }


  return `${variacao.toFixed(2)}%`;

}


/* =========================================================
   SOMAR VALORES
========================================================= */

function somar(
  lista,
  campo = "valor"
) {

  if (!Array.isArray(lista)) {
    return 0;
  }


  return lista.reduce(
    (
      total,
      item
    ) => {

      return (
        total +
        Number(
          item?.[campo] || 0
        )
      );

    },
    0
  );

}


/* =========================================================
   MÉDIA
========================================================= */

function media(
  lista,
  campo = "valor"
) {

  if (
    !Array.isArray(lista) ||
    lista.length === 0
  ) {

    return 0;

  }


  return (
    somar(
      lista,
      campo
    ) /
    lista.length
  );

}


/* =========================================================
   DIAS NO MÊS
========================================================= */

function diasNoMes(
  mes,
  ano
) {

  return new Date(
    Number(ano),
    Number(mes) + 1,
    0
  ).getDate();

}


/* =========================================================
   DIAS RESTANTES NO MÊS
========================================================= */

function diasRestantesNoMes(
  mes,
  ano
) {

  const hoje =
    new Date();

  const mesNumero =
    Number(mes);

  const anoNumero =
    Number(ano);


  /*
    Se for um mês passado,
    não há dias restantes.
  */

  if (
    anoNumero < hoje.getFullYear() ||
    (
      anoNumero ===
      hoje.getFullYear() &&
      mesNumero <
      hoje.getMonth()
    )
  ) {

    return 0;

  }


  /*
    Se for um mês futuro,
    retorna todos os dias.
  */

  if (
    anoNumero >
    hoje.getFullYear() ||
    (
      anoNumero ===
      hoje.getFullYear() &&
      mesNumero >
      hoje.getMonth()
    )
  ) {

    return diasNoMes(
      mesNumero,
      anoNumero
    );

  }


  return Math.max(
    0,
    diasNoMes(
      mesNumero,
      anoNumero
    ) -
    hoje.getDate()
  );

}


/* =========================================================
   MÉDIA DIÁRIA DISPONÍVEL
========================================================= */

function mediaDiaria(
  valor,
  dias
) {

  const numeroValor =
    Number(valor || 0);

  const numeroDias =
    Number(dias || 0);


  if (
    numeroDias <= 0
  ) {

    return 0;

  }


  return (
    numeroValor /
    numeroDias
  );

}


/* =========================================================
   STATUS DE LIMITE
========================================================= */

function statusLimite(
  gasto,
  limite
) {

  const valorGasto =
    Number(gasto || 0);

  const valorLimite =
    Number(limite || 0);


  if (
    valorLimite <= 0
  ) {

    return {
      status: "sem-limite",
      percentual: 0,
      restante: 0
    };

  }


  const percentualUso =
    percentual(
      valorGasto,
      valorLimite
    );


  const restante =
    valorLimite -
    valorGasto;


  if (
    valorGasto >
    valorLimite
  ) {

    return {
      status: "excedido",
      percentual: percentualUso,
      restante
    };

  }


  if (
    percentualUso >= 90
  ) {

    return {
      status: "critico",
      percentual: percentualUso,
      restante
    };

  }


  if (
    percentualUso >= 80
  ) {

    return {
      status: "atencao",
      percentual: percentualUso,
      restante
    };

  }


  return {
    status: "normal",
    percentual: percentualUso,
    restante
  };

}


/* =========================================================
   STATUS DE META
========================================================= */

function statusMeta(
  valor,
  guardado
) {

  const objetivo =
    Number(valor || 0);

  const economizado =
    Number(guardado || 0);


  if (
    objetivo <= 0
  ) {

    return {
      status: "invalida",
      percentual: 0,
      restante: 0
    };

  }


  const percentualGuardado =
    percentual(
      economizado,
      objetivo
    );


  const restante =
    Math.max(
      0,
      objetivo -
      economizado
    );


  if (
    economizado >= objetivo
  ) {

    return {
      status: "concluida",
      percentual: 100,
      restante: 0
    };

  }


  return {
    status: "em-andamento",
    percentual:
      Math.min(
        100,
        percentualGuardado
      ),
    restante
  };

}


/* =========================================================
   PRAZO EM MESES
========================================================= */

function extrairMeses(
  prazo
) {

  if (
    prazo === null ||
    prazo === undefined
  ) {

    return 0;

  }


  /*
    Aceita:

    "5"
    "5 meses"
    "5 mês"
  */

  const texto =
    String(prazo)
      .toLowerCase()
      .trim();


  const resultado =
    texto.match(
      /(\d+(?:[.,]\d+)?)/
    );


  if (!resultado) {
    return 0;
  }


  return Number(
    resultado[1]
      .replace(",", ".")
  );

}


/* =========================================================
   CÁLCULO DE META
========================================================= */

function calcularMeta(
  valor,
  guardado,
  meses
) {

  const objetivo =
    Number(valor || 0);

  const economizado =
    Number(guardado || 0);

  const prazo =
    Number(meses || 0);


  const restante =
    Math.max(
      0,
      objetivo -
      economizado
    );


  const mensal =
    prazo > 0
      ? restante / prazo
      : 0;


  const semanal =
    mensal * 12 / 52;


  return {

    valor: objetivo,

    guardado:
      economizado,

    restante,

    meses:
      prazo,

    mensal,

    semanal,

    percentual:
      objetivo > 0
        ? Math.min(
            100,
            economizado /
            objetivo *
            100
          )
        : 0

  };

}


/* =========================================================
   ORDENAR POR DATA
========================================================= */

function ordenarPorData(
  lista,
  crescente = false
) {

  if (!Array.isArray(lista)) {
    return [];
  }


  return [...lista].sort(
    (
      a,
      b
    ) => {

      const dataA =
        new Date(
          a?.data ||
          a?.vencimento ||
          0
        ).getTime();


      const dataB =
        new Date(
          b?.data ||
          b?.vencimento ||
          0
        ).getTime();


      return crescente
        ? dataA - dataB
        : dataB - dataA;

    }
  );

}


/* =========================================================
   ORDENAR POR VALOR
========================================================= */

function ordenarPorValor(
  lista,
  crescente = false
) {

  if (!Array.isArray(lista)) {
    return [];
  }


  return [...lista].sort(
    (
      a,
      b
    ) => {

      const valorA =
        Number(
          a?.valor || 0
        );

      const valorB =
        Number(
          b?.valor || 0
        );


      return crescente
        ? valorA - valorB
        : valorB - valorA;

    }
  );

}


/* =========================================================
   AGRUPAR POR CATEGORIA
========================================================= */

function agruparPorCategoria(
  lista,
  campoValor = "valor"
) {

  const resultado = {};


  if (!Array.isArray(lista)) {
    return resultado;
  }


  lista.forEach(
    item => {

      const categoria =
        item?.categoria ||
        "Outros";


      if (
        !resultado[categoria]
      ) {

        resultado[categoria] =
          0;

      }


      resultado[categoria] +=
        Number(
          item?.[campoValor] ||
          0
        );

    }
  );


  return resultado;

}


/* =========================================================
   CAPITALIZAR TEXTO
========================================================= */

function capitalizar(
  texto
) {

  if (!texto) {
    return "";
  }


  return String(texto)
    .charAt(0)
    .toUpperCase() +
    String(texto)
      .slice(1);

}


/* =========================================================
   VALOR VÁLIDO
========================================================= */

function valorValido(
  valor
) {

  const numeroValor =
    Number(valor);


  return (
    Number.isFinite(
      numeroValor
    ) &&
    numeroValor >= 0
  );

}


/* =========================================================
   CAMPO OBRIGATÓRIO
========================================================= */

function campoPreenchido(
  valor
) {

  return (
    valor !== null &&
    valor !== undefined &&
    String(valor).trim() !== ""
  );

}


/* =========================================================
   DEBOUNCE
========================================================= */

function debounce(
  funcao,
  atraso = 300
) {

  let timer;


  return function (...args) {

    clearTimeout(timer);


    timer = setTimeout(
      () => {

        funcao.apply(
          this,
          args
        );

      },
      atraso
    );

  };

}


/* =========================================================
   EXPORTAÇÕES
========================================================= */

export {

  moeda,

  numero,

  gerarId,

  escapar,

  dataAtual,

  dataHoraAtual,

  formatarData,

  formatarDataInput,

  dataDoInput,

  obterMesAtual,

  obterAnoAtual,

  nomeMes,

  periodoTexto,

  mesmoPeriodo,

  filtrarPeriodo,

  filtrarMesAtual,

  percentual,

  percentualLimitado,

  variacaoPercentual,

  textoVariacao,

  somar,

  media,

  diasNoMes,

  diasRestantesNoMes,

  mediaDiaria,

  statusLimite,

  statusMeta,

  extrairMeses,

  calcularMeta,

  ordenarPorData,

  ordenarPorValor,

  agruparPorCategoria,

  capitalizar,

  valorValido,

  campoPreenchido,

  debounce

};
