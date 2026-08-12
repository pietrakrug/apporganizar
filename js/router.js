"use strict";

/* =====================================================
   AUREA
   ROUTER / NAVEGAÇÃO
===================================================== */

const paginas = {

    dashboard: {
        titulo: "Dashboard",
        subtitulo: "Acompanhe sua evolução financeira"
    },

    financeiro: {
        titulo: "Meu Financeiro",
        subtitulo: "Controle suas receitas, despesas e contas"
    },

    planejamento: {
        titulo: "Planejamento",
        subtitulo: "Organize seu dinheiro antes de gastá-lo"
    },

    tarefas: {
        titulo: "Tarefas",
        subtitulo: "Organize suas tarefas financeiras e pessoais"
    },

    relatorios: {
        titulo: "Relatórios",
        subtitulo: "Entenda sua evolução financeira ao longo do tempo"
    }

};


/* =====================================================
   PÁGINA ATUAL
===================================================== */

let paginaAtual = "dashboard";


/* =====================================================
   ATUALIZAR TÍTULO
===================================================== */

function atualizarCabecalho(pagina) {

    const dados = paginas[pagina];

    if (!dados) return;

    const titulo =
        document.getElementById("pageTitle");

    const subtitulo =
        document.getElementById("pageSubtitle");


    if (titulo) {
        titulo.textContent = dados.titulo;
    }


    if (subtitulo) {
        subtitulo.textContent = dados.subtitulo;
    }

}


/* =====================================================
   ATUALIZAR MENU
===================================================== */

function atualizarMenu(pagina) {

    document
        .querySelectorAll(".menu")
        .forEach(botao => {

            botao.classList.toggle(
                "active",
                botao.dataset.page === pagina
            );

        });

}


/* =====================================================
   RENDERIZAÇÃO TEMPORÁRIA
===================================================== */

function renderPagina(pagina) {

    const content =
        document.getElementById("content");

    if (!content) {

        console.error(
            'AUREA: elemento "#content" não encontrado.'
        );

        return;
    }


    /*
        Por enquanto estamos apenas criando
        a estrutura de navegação.

        Os módulos reais serão conectados
        posteriormente.
    */

    const mensagens = {

        dashboard: `
            <div class="page">

                <div class="panel">

                    <h3>Dashboard</h3>

                    <p class="muted">
                        Visão geral das suas finanças.
                    </p>

                </div>

            </div>
        `,


        financeiro: `
            <div class="page">

                <div class="panel">

                    <h3>Meu Financeiro</h3>

                    <p class="muted">
                        Aqui ficarão suas receitas,
                        despesas e custos fixos.
                    </p>

                </div>

            </div>
        `,


        planejamento: `
            <div class="page">

                <div class="panel">

                    <h3>Planejamento</h3>

                    <p class="muted">
                        Aqui você poderá planejar
                        seus próximos meses, limites
                        e desejos.
                    </p>

                </div>

            </div>
        `,


        tarefas: `
            <div class="page">

                <div class="panel">

                    <h3>Tarefas</h3>

                    <p class="muted">
                        Aqui ficarão suas tarefas
                        financeiras, pessoais e profissionais.
                    </p>

                </div>

            </div>
        `,


        relatorios: `
            <div class="page">

                <div class="panel">

                    <h3>Relatórios</h3>

                    <p class="muted">
                        Aqui você poderá comparar
                        sua evolução financeira.
                    </p>

                </div>

            </div>
        `

    };


    content.innerHTML =
        mensagens[pagina] ||
        mensagens.dashboard;

}


/* =====================================================
   NAVEGAR
===================================================== */

function navegarPara(pagina) {

    if (!paginas[pagina]) {

        console.warn(
            "AUREA: página inexistente:",
            pagina
        );

        pagina = "dashboard";
    }


    paginaAtual = pagina;


    atualizarCabecalho(pagina);

    atualizarMenu(pagina);

    renderPagina(pagina);

}


/* =====================================================
   CONECTAR MENU
===================================================== */

function configurarNavegacao() {

    const botoes =
        document.querySelectorAll(".menu");


    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                const pagina =
                    botao.dataset.page;

                navegarPara(pagina);

            }
        );

    });

}


/* =====================================================
   INICIALIZAR ROUTER
===================================================== */

function iniciarRouter() {

    configurarNavegacao();

    navegarPara("dashboard");

}
