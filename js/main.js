"use strict";

/* =====================================================
   AUREA
   MAIN.JS
   Inicialização global da aplicação
===================================================== */


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarRouter();

        configurarNotificacoes();

        configurarMes();

        console.log("AUREA iniciada com sucesso.");

    }
);


/* =====================================================
   NOTIFICAÇÕES
===================================================== */

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
                "Você não possui novas notificações."
            );

        }
    );

}


/* =====================================================
   SELETOR DE MÊS
===================================================== */

function configurarMes() {

    const seletor =
        document.getElementById(
            "monthSelect"
        );


    if (!seletor) {
        return;
    }


    /*
        Recupera o mês salvo no banco.
    */

    const mesSalvo =
        Number(DB.config.mes);


    /*
        Garante que o valor esteja
        dentro dos meses disponíveis.
    */

    if (
        mesSalvo >= 0 &&
        mesSalvo < seletor.options.length
    ) {

        seletor.value =
            String(mesSalvo);

    }


    /*
        Quando o usuário troca o mês,
        salvamos a alteração no banco.
    */

    seletor.addEventListener(
        "change",
        () => {

            DB.config.mes =
                Number(seletor.value);


            salvarBanco();


            const nomeMes =
                seletor.options[
                    seletor.selectedIndex
                ].text;


            mostrarToast(
                `Período alterado para ${nomeMes}`
            );


            /*
                Re-renderiza a página atual.

                Isso será importante quando
                começarmos a filtrar receitas,
                despesas, limites etc. por mês.
            */

            if (
                typeof navegarPara ===
                "function"
            ) {

                navegarPara(paginaAtual);

            }

        }
    );

}


/* =====================================================
   VERIFICAÇÃO DO BANCO
===================================================== */

function verificarBanco() {

    if (
        typeof DB === "undefined"
    ) {

        console.error(
            "AUREA: banco de dados não carregado."
        );

        return false;

    }


    if (
        typeof salvarBanco !==
        "function"
    ) {

        console.error(
            "AUREA: função salvarBanco() não encontrada."
        );

        return false;

    }


    return true;

}


/* =====================================================
   DEBUG
===================================================== */

function mostrarEstadoAurea() {

    console.log(
        "========== AUREA =========="
    );

    console.log(
        "Página:",
        typeof paginaAtual !== "undefined"
            ? paginaAtual
            : "não definida"
    );

    console.log(
        "Mês:",
        DB.config.mes
    );

    console.log(
        "Ano:",
        DB.config.ano
    );

    console.log(
        "Receitas:",
        DB.receitas.length
    );

    console.log(
        "Despesas:",
        DB.despesas.length
    );

    console.log(
        "Custos fixos:",
        DB.custosFixos.length
    );

    console.log(
        "Investimentos:",
        DB.investimentos.length
    );

    console.log(
        "Limites:",
        DB.limites.length
    );

    console.log(
        "Desejos:",
        DB.desejos.length
    );

    console.log(
        "Tarefas:",
        DB.tarefas.length
    );

    console.log(
        "Planejamentos:",
        DB.planejamentos.length
    );

    console.log(
        "Relatórios:",
        DB.relatorios.length
    );

    console.log(
        "============================"
    );

}


/* =====================================================
   EXPOSIÇÃO PARA DEBUG
===================================================== */

window.AUREA = {

    banco: () => DB,

    pagina: () => paginaAtual,

    estado: () => mostrarEstadoAurea(),

    salvar: () => salvarBanco()

};
