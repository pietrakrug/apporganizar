
```javascript
"use strict";

/* =====================================================
   AUREA — DATABASE
   Banco de dados e persistência local
===================================================== */

const STORAGE_KEY = "AUREA_DB";

const VERSAO_BANCO = 2;


/* =====================================================
   BANCO PADRÃO
===================================================== */

function criarBancoInicial() {

    const agora = new Date();

    return {

        versao: VERSAO_BANCO,

        receitas: [],

        despesas: [],

        custosFixos: [],

        investimentos: [],

        limites: [],

        desejos: [],

        tarefas: [],

        planejamentos: [],

        config: {

            mesAtual: agora.getMonth(),

            anoAtual: agora.getFullYear()

        }

    };

}


/* =====================================================
   GERADOR DE ID
===================================================== */

function gerarId() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {

        return window.crypto.randomUUID();

    }

    return (
        Date.now() +
        "-" +
        Math.random()
            .toString(16)
            .slice(2)
    );

}


/* =====================================================
   MIGRAÇÃO DO BANCO ANTIGO
===================================================== */

function migrarBancoAntigo(bancoAntigo) {

    const novoBanco = criarBancoInicial();

    const agora = new Date();

    const mesAtual = agora.getMonth();

    const anoAtual = agora.getFullYear();


    /* -------------------------------------------------
       RECEITAS
    ------------------------------------------------- */

    if (Array.isArray(bancoAntigo.receitas)) {

        novoBanco.receitas =
            bancoAntigo.receitas.map(item => {

                const data =
                    item.data ||
                    agora.toISOString();

                const dataObj =
                    new Date(data);

                return {

                    id:
                        item.id ||
                        gerarId(),

                    descricao:
                        item.descricao ||
                        "Receita",

                    valor:
                        Number(item.valor) || 0,

                    categoria:
                        item.categoria ||
                        "Outros",

                    dataRecebimento:
                        item.dataRecebimento ||
                        data,

                    recorrencia:
                        item.recorrencia ||
                        "única",

                    mes:
                        Number.isInteger(item.mes)
                            ? item.mes
                            : dataObj.getMonth(),

                    ano:
                        Number.isInteger(item.ano)
                            ? item.ano
                            : dataObj.getFullYear(),

                    observacao:
                        item.observacao || "",

                    criadoEm:
                        item.criadoEm ||
                        data

                };

            });

    }


    /* -------------------------------------------------
       DESPESAS
    ------------------------------------------------- */

    if (Array.isArray(bancoAntigo.despesas)) {

        novoBanco.despesas =
            bancoAntigo.despesas.map(item => {

                const data =
                    item.data ||
                    agora.toISOString();

                const dataObj =
                    new Date(data);

                return {

                    id:
                        item.id ||
                        gerarId(),

                    descricao:
                        item.descricao ||
                        "Despesa",

                    valor:
                        Number(item.valor) || 0,

                    categoria:
                        item.categoria ||
                        "Outros",

                    vencimento:
                        item.vencimento ||
                        data.split("T")[0],

                    dataPagamento:
                        item.dataPagamento ||
                        "",

                    pagamento:
                        item.pagamento ||
                        "Não informado",

                    tipo:
                        item.tipo ||
                        "Variável",

                    status:
                        item.status ||
                        "paga",

                    mes:
                        Number.isInteger(item.mes)
                            ? item.mes
                            : dataObj.getMonth(),

                    ano:
                        Number.isInteger(item.ano)
                            ? item.ano
                            : dataObj.getFullYear(),

                    observacao:
                        item.observacao ||
                        "",

                    origem:
                        item.origem ||
                        "migracao",

                    origemId:
                        item.origemId ||
                        null,

                    criadoEm:
                        item.criadoEm ||
                        data

                };

            });

    }


    /* -------------------------------------------------
       INVESTIMENTOS
    ------------------------------------------------- */

    if (Array.isArray(bancoAntigo.investimentos)) {

        novoBanco.investimentos =
            bancoAntigo.investimentos.map(item => {

                const data =
                    item.data ||
                    agora.toISOString();

                const dataObj =
                    new Date(data);

                return {

                    id:
                        item.id ||
                        gerarId(),

                    nome:
                        item.nome ||
                        "Investimento",

                    valor:
                        Number(item.valor) || 0,

                    data:
                        data,

                    mes:
                        Number.isInteger(item.mes)
                            ? item.mes
                            : dataObj.getMonth(),

                    ano:
                        Number.isInteger(item.ano)
                            ? item.ano
                            : dataObj.getFullYear(),

                    tipo:
                        item.tipo ||
                        "patrimonio",

                    criadoEm:
                        item.criadoEm ||
                        data

                };

            });

    }


    /* -------------------------------------------------
       LIMITES
    ------------------------------------------------- */

    if (Array.isArray(bancoAntigo.limites)) {

        novoBanco.limites =
            bancoAntigo.limites.map(item => {

                return {

                    id:
                        item.id ||
                        gerarId(),

                    categoria:
                        item.categoria ||
                        "Outros",

                    limite:
                        Number(item.limite) || 0,

                    mes:
                        Number.isInteger(item.mes)
                            ? item.mes
                            : mesAtual,

                    ano:
                        Number.isInteger(item.ano)
                            ? item.ano
                            : anoAtual,

                    criadoEm:
                        item.criadoEm ||
                        agora.toISOString()

                };

            });

    }


    /* -------------------------------------------------
       DESEJOS
    ------------------------------------------------- */

    if (Array.isArray(bancoAntigo.desejos)) {

        novoBanco.desejos =
            bancoAntigo.desejos.map(item => {

                return {

                    id:
                        item.id ||
                        gerarId(),

                    nome:
                        item.nome ||
                        "Nova meta",

                    valor:
                        Number(item.valor) || 0,

                    guardado:
                        Number(item.guardado) || 0,

                    categoria:
                        item.categoria ||
                        "Outros",

                    prioridade:
                        item.prioridade ||
                        "media",

                    dataDesejada:
                        item.dataDesejada ||
                        "",

                    prazoMeses:
                        Number(item.prazoMeses) ||
                        extrairMeses(item.prazo),

                    imagem:
                        item.imagem ||
                        "",

                    icone:
                        item.icone ||
                        "✨",

                    observacao:
                        item.observacao ||
                        "",

                    status:
                        item.status ||
                        "em_andamento",

                    criadoEm:
                        item.criadoEm ||
                        item.data ||
                        agora.toISOString()

                };

            });

    }


    /* -------------------------------------------------
       DÍVIDAS ANTIGAS
    ------------------------------------------------- */

    /*
       O banco antigo possuía:

       dividas: 1250

       Na nova arquitetura, dívidas deverão
       futuramente ser registradas como despesas
       ou compromissos financeiros.

       Por enquanto preservamos o valor para
       evitar perda de informação.
    */

    if (
        bancoAntigo.dividas !== undefined &&
        Number(bancoAntigo.dividas) > 0
    ) {

        novoBanco.dividasLegado =
            Number(bancoAntigo.dividas);

    }


    /* -------------------------------------------------
       CONFIGURAÇÃO
    ------------------------------------------------- */

    if (bancoAntigo.config) {

        if (
            Number.isInteger(
                bancoAntigo.config.mes
            )
        ) {

            novoBanco.config.mesAtual =
                bancoAntigo.config.mes;

        }

        if (
            Number.isInteger(
                bancoAntigo.config.ano
            )
        ) {

            novoBanco.config.anoAtual =
                bancoAntigo.config.ano;

        }

    }


    return novoBanco;

}


/* =====================================================
   EXTRAIR PRAZO ANTIGO
===================================================== */

function extrairMeses(prazo) {

    if (!prazo) {
        return 0;
    }

    const texto =
        String(prazo)
            .toLowerCase()
            .trim();

    const numero =
        parseInt(texto, 10);

    if (Number.isNaN(numero)) {
        return 0;
    }

    return numero;

}


/* =====================================================
   GARANTIR ESTRUTURA
===================================================== */

function garantirEstruturaBanco(banco) {

    const estrutura =
        criarBancoInicial();


    Object.keys(estrutura).forEach(chave => {

        if (
            banco[chave] === undefined ||
            banco[chave] === null
        ) {

            banco[chave] =
                estrutura[chave];

        }

    });


    if (
        !banco.config ||
        typeof banco.config !== "object"
    ) {

        banco.config =
            estrutura.config;

    }


    if (
        !Number.isInteger(
            banco.config.mesAtual
        )
    ) {

        banco.config.mesAtual =
            estrutura.config.mesAtual;

    }


    if (
        !Number.isInteger(
            banco.config.anoAtual
        )
    ) {

        banco.config.anoAtual =
            estrutura.config.anoAtual;

    }


    banco.versao =
        VERSAO_BANCO;


    return banco;

}


/* =====================================================
   CARREGAR BANCO
===================================================== */

function carregarBanco() {

    const bancoSalvo =
        localStorage.getItem(STORAGE_KEY);


    /* -----------------------------------------------
       PRIMEIRO ACESSO
    ------------------------------------------------ */

    if (!bancoSalvo) {

        const bancoNovo =
            criarBancoInicial();

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(bancoNovo)
        );

        return bancoNovo;

    }


    /* -----------------------------------------------
       TENTAR LER
    ------------------------------------------------ */

    try {

        const banco =
            JSON.parse(bancoSalvo);


        /* -------------------------------------------
           BANCO ANTIGO
        -------------------------------------------- */

        if (
            !banco.versao ||
            banco.versao < VERSAO_BANCO
        ) {

            const bancoMigrado =
                migrarBancoAntigo(banco);

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(bancoMigrado)
            );

            console.log(
                "AUREA: banco antigo migrado com sucesso."
            );

            return bancoMigrado;

        }


        /* -------------------------------------------
           BANCO NOVO
        -------------------------------------------- */

        return garantirEstruturaBanco(banco);

    }

    catch (erro) {

        console.error(
            "AUREA: erro ao carregar banco.",
            erro
        );


        const bancoNovo =
            criarBancoInicial();


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(bancoNovo)
        );


        return bancoNovo;

    }

}


/* =====================================================
   BANCO GLOBAL
===================================================== */

let DB = carregarBanco();


/* =====================================================
   SALVAR BANCO
===================================================== */

function salvarBanco() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(DB)
        );

    }

    catch (erro) {

        console.error(
            "AUREA: erro ao salvar banco.",
            erro
        );

        throw erro;

    }

}
```
