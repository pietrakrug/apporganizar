"use strict";

/* =====================================================
   AUREA
   BANCO DE DADOS
===================================================== */

const STORAGE_KEY = "AUREA_DB";

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
        mes: new Date().getMonth(),
        ano: new Date().getFullYear()
    }
};


function carregarBanco() {

    const bancoSalvo = localStorage.getItem(STORAGE_KEY);

    if (!bancoSalvo) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(bancoInicial)
        );

        return structuredClone(bancoInicial);
    }

    try {

        const banco = JSON.parse(bancoSalvo);

        return {
            ...bancoInicial,

            ...banco,

            receitas: Array.isArray(banco.receitas)
                ? banco.receitas
                : [],

            despesas: Array.isArray(banco.despesas)
                ? banco.despesas
                : [],

            custosFixos: Array.isArray(banco.custosFixos)
                ? banco.custosFixos
                : [],

            investimentos: Array.isArray(banco.investimentos)
                ? banco.investimentos
                : [],

            limites: Array.isArray(banco.limites)
                ? banco.limites
                : [],

            desejos: Array.isArray(banco.desejos)
                ? banco.desejos
                : [],

            tarefas: Array.isArray(banco.tarefas)
                ? banco.tarefas
                : [],

            planejamentos: Array.isArray(banco.planejamentos)
                ? banco.planejamentos
                : [],

            relatorios: Array.isArray(banco.relatorios)
                ? banco.relatorios
                : []
        };

    } catch (erro) {

        console.error(
            "Erro ao carregar banco:",
            erro
        );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(bancoInicial)
        );

        return structuredClone(bancoInicial);
    }
}


let DB = carregarBanco();


function salvarBanco() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DB)
    );
}
