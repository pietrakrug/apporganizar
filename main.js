//=============================
// BANCO DE DADOS
//=============================

const DB = {

    receitas: [],
    custosFixos: [],
    custosVariaveis: [],
    dividas: [],
    investimentos: [],
    limites: [],
    desejos: []

};


carregarDados();


function carregarDados(){

    const dados = localStorage.getItem("organizaDB");

    if(dados){

        Object.assign(DB, JSON.parse(dados));

    }

}


function salvarDados(){

    localStorage.setItem(
        "organizaDB",
        JSON.stringify(DB)
    );

}



//=============================
// TELAS
//=============================

const paginas = {


dashboard: `

<h2>Dashboard</h2>

<div class="cards">

<div class="card">
<h3>Receitas</h3>
<p>R$ 0,00</p>
</div>

<div class="card">
<h3>Despesas</h3>
<p>R$ 0,00</p>
</div>

<div class="card">
<h3>Saldo</h3>
<p>R$ 0,00</p>
</div>

<div class="card">
<h3>Investimentos</h3>
<p>R$ 0,00</p>
</div>

</div>

<div class="painel">

<h3>Alertas Inteligentes</h3>

<p>Nenhum alerta.</p>

</div>


`,


financeiro: `

<h2>Meu Financeiro</h2>


<div class="cards">


<div class="card">

<h3>Receitas</h3>

<p id="cardReceitas">
R$ 0,00
</p>

</div>



<div class="card">

<h3>Custos</h3>

<p id="cardCustos">
R$ 0,00
</p>

</div>



<div class="card">

<h3>Dívidas</h3>

<p id="cardDividas">
R$ 0,00
</p>

</div>



<div class="card">

<h3>Investimentos</h3>

<p id="cardInvestimentos">
R$ 0,00
</p>

</div>


</div>



<div class="painel">


<h3>Receitas</h3>


<button id="novaReceita">

+ Nova Receita

</button>


<div id="listaReceitas">

Nenhuma receita cadastrada.

</div>


</div>


`,


investimentos: `

<h2>Investimentos</h2>

<p>Em breve...</p>

`,


limites: `

<h2>Limites</h2>

<p>Em breve...</p>

`,


desejos: `

<h2>Desejos</h2>

<p>Em breve...</p>

`


};




//=============================
// NAVEGAÇÃO
//=============================


const conteudo =
document.getElementById("conteudo");


conteudo.innerHTML =
paginas.dashboard;



document.querySelectorAll(".menu")
.forEach(botao=>{


botao.onclick = ()=>{


document.querySelectorAll(".menu")
.forEach(x =>
x.classList.remove("active")
);



botao.classList.add("active");



document.getElementById("tituloPagina")
.innerHTML =
botao.innerHTML;



conteudo.innerHTML =
paginas[botao.dataset.page];



if(botao.dataset.page === "financeiro"){

    renderReceitas();

}


};


});




//=============================
// RECEITAS
//=============================


document.addEventListener(
"click",
function(e){


if(e.target.id === "novaReceita"){

    adicionarReceita();

}


});




function adicionarReceita(){


const descricao =
prompt("Descrição da receita");


if(!descricao){

    return;

}



const valor =
Number(prompt("Valor da receita"));



if(isNaN(valor)){

    return;

}



DB.receitas.push({

    id: Date.now(),

    descricao: descricao,

    valor: valor

});



salvarDados();


renderReceitas();


}




function renderReceitas(){


const lista =
document.getElementById("listaReceitas");



if(!lista){

    return;

}



if(DB.receitas.length === 0){


lista.innerHTML =
"Nenhuma receita cadastrada.";


return;


}



let html = "";

let total = 0;



DB.receitas.forEach(receita=>{


total += receita.valor;



html += `

<div class="card">

<h4>
${receita.descricao}
</h4>


<p>

R$ ${receita.valor.toLocaleString(
"pt-BR",
{
minimumFractionDigits:2
}
)}

</p>


</div>

`;



});



lista.innerHTML = html;



document.getElementById("cardReceitas")
.innerHTML =
"R$ " +
total.toLocaleString(
"pt-BR",
{
minimumFractionDigits:2
}
);



}
