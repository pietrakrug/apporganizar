"use strict";

/* =====================================================
   AUREA — UTILITÁRIOS
   Funções gerais utilizadas por todo o sistema
===================================================== */

/* =====================================================
   ID
===================================================== */

function gerarId(prefixo = "item") {
  if (window.crypto && crypto.randomUUID) {
    return `${prefixo}-${crypto.randomUUID()}`;
  }

  return `${prefixo}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}


/* =====================================================
   MOEDA
===================================================== */

function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


/* =====================================================
   NÚMERO
===================================================== */

function numero(valor) {
  const resultado = Number(valor);

  return Number.isFinite(resultado) ? resultado : 0;
}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escapar(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =====================================================
   DATA
===================================================== */

function dataHoje() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}


function dataAtualISO() {
  return new Date().toISOString();
}


/* =====================================================
   FORMATAR DATA
===================================================== */

function formatarData(data) {
  if (!data) {
    return "—";
  }

  const valor = String(data).slice(0, 10);
  const partes = valor.split("-");

  if (partes.length !== 3) {
    return data;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


/* =====================================================
   MÊS / ANO
===================================================== */

function mesAtual() {
  return DB.config.mes;
}


function anoAtual() {
  return DB.config.ano;
}


/* =====================================================
   CHAVE DE PERÍODO
===================================================== */

function chavePeriodo(mes, ano) {
  return `${ano}-${String(mes).padStart(2, "0")}`;
}


/* =====================================================
   VERIFICAR SE PERTENCE AO MÊS
===================================================== */

function pertenceAoMes(item, mes, ano) {
  if (!item) {
    return false;
  }

  /*
    O sistema trabalha internamente com mês de 0 a 11.
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
    Compatibilidade com registros antigos
    que possuem apenas "data".
  */

  if (item.data) {
    const data = new Date(item.data);

    if (Number.isNaN(data.getTime())) {
      return false;
    }

    return (
      data.getMonth() === Number(mes) &&
      data.getFullYear() === Number(ano)
    );
  }

  return false;
}


/* =====================================================
   DIAS DO MÊS
===================================================== */

function diasNoMes(mes, ano) {
  return new Date(
    Number(ano),
    Number(mes) + 1,
    0
  ).getDate();
}


/* =====================================================
   DIAS RESTANTES
===================================================== */

function diasRestantesNoMes(mes, ano) {
  const hoje = new Date();

  const mesmoMes =
    hoje.getMonth() === Number(mes) &&
    hoje.getFullYear() === Number(ano);

  if (!mesmoMes) {
    return diasNoMes(mes, ano);
  }

  return Math.max(
    1,
    diasNoMes(mes, ano) - hoje.getDate()
  );
}


/* =====================================================
   PERCENTUAL
===================================================== */

function percentual(parte, total) {
  const p = Number(parte) || 0;
  const t = Number(total) || 0;

  if (t <= 0) {
    return 0;
  }

  return (p / t) * 100;
}


/* =====================================================
   LIMITAR PERCENTUAL
===================================================== */

function limitarPercentual(valor) {
  return Math.max(
    0,
    Math.min(100, Number(valor) || 0)
  );
}


/* =====================================================
   DIFERENÇA PERCENTUAL
===================================================== */

function variacaoPercentual(atual, anterior) {
  const a = Number(atual) || 0;
  const b = Number(anterior) || 0;

  if (b === 0) {
    if (a === 0) {
      return 0;
    }

    return 100;
  }

  return ((a - b) / Math.abs(b)) * 100;
}


/* =====================================================
   CLASSE DA VARIAÇÃO
===================================================== */

function classeVariacao(valor) {
  const numeroVariacao = Number(valor) || 0;

  if (numeroVariacao > 0) {
    return "positive";
  }

  if (numeroVariacao < 0) {
    return "negative";
  }

  return "neutral";
}


/* =====================================================
   TOAST
===================================================== */

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(mensagem);
    return;
  }

  toast.textContent = mensagem;

  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


/* =====================================================
   CONFIRMAÇÃO
===================================================== */

function confirmar(mensagem) {
  return window.confirm(mensagem);
}


/* =====================================================
   TEXTO DE PRIORIDADE
===================================================== */

function textoPrioridade(prioridade) {
  const prioridades = {
    baixa: "Baixa",
    media: "Média",
    alta: "Alta",
    urgente: "Urgente"
  };

  return prioridades[prioridade] || "Média";
}


/* =====================================================
   TEXTO DE STATUS
===================================================== */

function textoStatus(status) {
  const statusMap = {
    pendente: "Pendente",
    paga: "Paga",
    vencida: "Vencida",
    concluida: "Concluída",
    ativa: "Ativa",
    inativa: "Inativa"
  };

  return statusMap[status] || status || "—";
}


/* =====================================================
   NOME DO MÊS
===================================================== */

function nomeMes(mes) {
  const meses = [
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

  return meses[Number(mes)] || "";
}


/* =====================================================
   NOME DO PERÍODO
===================================================== */

function nomePeriodo(mes, ano) {
  return `${nomeMes(mes)} ${ano}`;
}


/* =====================================================
   CLONAR OBJETO
===================================================== */

function clonar(objeto) {
  return JSON.parse(JSON.stringify(objeto));
}


/* =====================================================
   DEBOUNCE
===================================================== */

function debounce(funcao, atraso = 300) {
  let temporizador;

  return function (...args) {
    clearTimeout(temporizador);

    temporizador = setTimeout(() => {
      funcao.apply(this, args);
    }, atraso);
  };
}
