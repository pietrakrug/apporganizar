//================================
// BANCO DE DADOS
//================================

const DB = {

    receitas: [],
    custosFixos: [],
    custosVariaveis: [],
    dividas: [],
    investimentos: [],
    limites: [],
    desejos: []

};


//================================
// LOCAL STORAGE
//================================


function carregarDados(){

    const dados =
    localStorage.getItem("organizaDB");


    if(dados){

        try{

            Object.assign(
                DB,
                JSON.parse(dados)
            );

        }catch(e){

            console.log(
                "Erro ao carregar dados",
                e
            );

        }

    }

}



function salvarDados(){

    localStorage.setItem(
        "organizaDB",
        JSON.stringify(DB)
    );

}



carregarDados();





//================================
// FORMATAÇÃO
//================================


function moeda(valor){

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style:"currency",
            currency:"BRL"
        }
    );

}






//================================
// TELAS
//================================


const paginas = {


dashboard: `

<h2>Dashboard</h2>


<div class="cards">


<div class="card">

<h3>Receitas</h3>

<p id="dashboardReceitas">
R$ 0,00
</p>

</div>



<div class="card">

<h3>Despesas</h3>

<p id="dashboardDespesas">
R$ 0,00
</p>

</div>




<div class="card">

<h3>Saldo do Mês</h3>

<p id="dashboardSaldo">
R$ 0,00
</p>

</div>




<div class="card">

<h3>Investimentos</h3>

<p id="dashboardInvestimentos">
R$ 0,00
</p>

</div>



</div>



<div class="painel">

<h3>Alertas Inteligentes</h3>

<p id="alertas">

Nenhum alerta.

</p>


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



<div id="formReceita" style="display:none">


<input id="descricaoReceita"
placeholder="Descrição">


<input id="valorReceita"
type="number"
placeholder="Valor">



<input id="dataReceita"
type="date">



<input id="categoriaReceita"
placeholder="Categoria">



<button id="salvarReceita">
Salvar
</button>


<button id="cancelarReceita">
Cancelar
</button>



</div>



<div id="listaReceitas">

Nenhuma receita cadastrada.

</div>


</div>






<div class="painel">

<h3>Custos Fixos</h3>


<button id="novoCustoFixo">
+ Novo Custo Fixo
</button>



<div id="formCustoFixo" style="display:none">


<input id="nomeCustoFixo"
placeholder="Nome">


<input id="valorCustoFixo"
type="number"
placeholder="Valor">



<input id="categoriaCustoFixo"
placeholder="Categoria">



<input id="pagamentoCustoFixo"
placeholder="Pagamento">



<button id="salvarCustoFixo">
Salvar
</button>


<button id="cancelarCustoFixo">
Cancelar
</button>



</div>



<div id="listaCustosFixos">

Nenhum custo fixo cadastrado.

</div>


</div>





<div class="painel">

<h3>Custos Variáveis</h3>


<button id="novoCustoVariavel">
+ Novo Custo Variável
</button>



<div id="formCustoVariavel" style="display:none">


<input id="nomeCustoVariavel"
placeholder="Nome">



<input id="valorCustoVariavel"
type="number"
placeholder="Valor">



<input id="dataCustoVariavel"
type="date">



<input id="categoriaCustoVariavel"
placeholder="Categoria">



<button id="salvarCustoVariavel">
Salvar
</button>


<button id="cancelarCustoVariavel">
Cancelar
</button>



</div>



<div id="listaCustosVariaveis">

Nenhum custo variável cadastrado.

</div>


</div>



`,




investimentos:`

<h2>Investimentos</h2>

<p>Em desenvolvimento</p>

`,




limites:`

<h2>Limites</h2>

<p>Em desenvolvimento</p>

`,




desejos:`

<h2>Desejos</h2>

<p>Em desenvolvimento</p>

`



};






//================================
// NAVEGAÇÃO
//================================


const conteudo =
document.getElementById("conteudo");



conteudo.innerHTML =
paginas.dashboard;



document.querySelectorAll(".menu")
.forEach(botao=>{


botao.onclick = ()=>{


document.querySelectorAll(".menu")
.forEach(x=>
x.classList.remove("active")
);



botao.classList.add("active");



document.getElementById("tituloPagina")
.innerHTML =
botao.innerHTML;



conteudo.innerHTML =
paginas[botao.dataset.page];



if(botao.dataset.page==="financeiro"){

atualizarFinanceiro();

}



if(botao.dataset.page==="dashboard"){

atualizarDashboard();

}



};



});
//================================
// BANCO DE DADOS
//================================

const DB = {

    receitas: [],
    custosFixos: [],
    custosVariaveis: [],
    dividas: [],
    investimentos: [],
    limites: [],
    desejos: []

};


//================================
// LOCAL STORAGE
//================================


function carregarDados(){

    const dados =
    localStorage.getItem("organizaDB");


    if(dados){

        try{

            Object.assign(
                DB,
                JSON.parse(dados)
            );

        }catch(e){

            console.log(
                "Erro ao carregar dados",
                e
            );

        }

    }

}



function salvarDados(){

    localStorage.setItem(
        "organizaDB",
        JSON.stringify(DB)
    );

}



carregarDados();





//================================
// FORMATAÇÃO
//================================


function moeda(valor){

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style:"currency",
            currency:"BRL"
        }
    );

}






//================================
// TELAS
//================================


const paginas = {


dashboard: `

<h2>Dashboard</h2>


<div class="cards">


<div class="card">

<h3>Receitas</h3>

<p id="dashboardReceitas">
R$ 0,00
</p>

</div>



<div class="card">

<h3>Despesas</h3>

<p id="dashboardDespesas">
R$ 0,00
</p>

</div>




<div class="card">

<h3>Saldo do Mês</h3>

<p id="dashboardSaldo">
R$ 0,00
</p>

</div>




<div class="card">

<h3>Investimentos</h3>

<p id="dashboardInvestimentos">
R$ 0,00
</p>

</div>



</div>



<div class="painel">

<h3>Alertas Inteligentes</h3>

<p id="alertas">

Nenhum alerta.

</p>


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



<div id="formReceita" style="display:none">


<input id="descricaoReceita"
placeholder="Descrição">


<input id="valorReceita"
type="number"
placeholder="Valor">



<input id="dataReceita"
type="date">



<input id="categoriaReceita"
placeholder="Categoria">



<button id="salvarReceita">
Salvar
</button>


<button id="cancelarReceita">
Cancelar
</button>



</div>



<div id="listaReceitas">

Nenhuma receita cadastrada.

</div>


</div>






<div class="painel">

<h3>Custos Fixos</h3>


<button id="novoCustoFixo">
+ Novo Custo Fixo
</button>



<div id="formCustoFixo" style="display:none">


<input id="nomeCustoFixo"
placeholder="Nome">


<input id="valorCustoFixo"
type="number"
placeholder="Valor">



<input id="categoriaCustoFixo"
placeholder="Categoria">



<input id="pagamentoCustoFixo"
placeholder="Pagamento">



<button id="salvarCustoFixo">
Salvar
</button>


<button id="cancelarCustoFixo">
Cancelar
</button>



</div>



<div id="listaCustosFixos">

Nenhum custo fixo cadastrado.

</div>


</div>





<div class="painel">

<h3>Custos Variáveis</h3>


<button id="novoCustoVariavel">
+ Novo Custo Variável
</button>



<div id="formCustoVariavel" style="display:none">


<input id="nomeCustoVariavel"
placeholder="Nome">



<input id="valorCustoVariavel"
type="number"
placeholder="Valor">



<input id="dataCustoVariavel"
type="date">



<input id="categoriaCustoVariavel"
placeholder="Categoria">



<button id="salvarCustoVariavel">
Salvar
</button>


<button id="cancelarCustoVariavel">
Cancelar
</button>



</div>



<div id="listaCustosVariaveis">

Nenhum custo variável cadastrado.

</div>


</div>



`,




investimentos:`

<h2>Investimentos</h2>

<p>Em desenvolvimento</p>

`,




limites:`

<h2>Limites</h2>

<p>Em desenvolvimento</p>

`,




desejos:`

<h2>Desejos</h2>

<p>Em desenvolvimento</p>

`



};






//================================
// NAVEGAÇÃO
//================================


const conteudo =
document.getElementById("conteudo");



conteudo.innerHTML =
paginas.dashboard;



document.querySelectorAll(".menu")
.forEach(botao=>{


botao.onclick = ()=>{


document.querySelectorAll(".menu")
.forEach(x=>
x.classList.remove("active")
);



botao.classList.add("active");



document.getElementById("tituloPagina")
.innerHTML =
botao.innerHTML;



conteudo.innerHTML =
paginas[botao.dataset.page];



if(botao.dataset.page==="financeiro"){

atualizarFinanceiro();

}



if(botao.dataset.page==="dashboard"){

atualizarDashboard();

}



};



});
//================================
// CÁLCULOS FINANCEIROS
//================================



function totalReceitas(){


return DB.receitas.reduce(

(total,item)=>
total + Number(item.valor),

0

);


}




function totalCustosFixos(){


return DB.custosFixos.reduce(

(total,item)=>
total + Number(item.valor),

0

);


}





function totalCustosVariaveis(){


return DB.custosVariaveis.reduce(

(total,item)=>
total + Number(item.valor),

0

);


}





function totalDespesas(){


return (

totalCustosFixos()

+

totalCustosVariaveis()

);


}





function totalInvestimentos(){


return DB.investimentos.reduce(

(total,item)=>
total + Number(item.valor || 0),

0

);


}







//================================
// ATUALIZA FINANCEIRO
//================================



function atualizarFinanceiro(){


renderReceitas();


renderCustosFixos();


renderCustosVariaveis();



const receitas =
totalReceitas();



const despesas =
totalDespesas();



const investimentos =
totalInvestimentos();



if(document.getElementById("cardReceitas")){


document.getElementById("cardReceitas")
.innerHTML =
moeda(receitas);



}



if(document.getElementById("cardCustos")){


document.getElementById("cardCustos")
.innerHTML =
moeda(despesas);



}



if(document.getElementById("cardInvestimentos")){


document.getElementById("cardInvestimentos")
.innerHTML =
moeda(investimentos);



}



atualizarDashboard();



}








//================================
// DASHBOARD
//================================



function atualizarDashboard(){



const receitas =
totalReceitas();



const despesas =
totalDespesas();



const saldo =
receitas - despesas;



const investimentos =
totalInvestimentos();





if(document.getElementById("dashboardReceitas")){


document.getElementById("dashboardReceitas")
.innerHTML =
moeda(receitas);



}




if(document.getElementById("dashboardDespesas")){


document.getElementById("dashboardDespesas")
.innerHTML =
moeda(despesas);



}





if(document.getElementById("dashboardSaldo")){


document.getElementById("dashboardSaldo")
.innerHTML =
moeda(saldo);



}




if(document.getElementById("dashboardInvestimentos")){


document.getElementById("dashboardInvestimentos")
.innerHTML =
moeda(investimentos);



}





// ALERTAS


const alerta =
document.getElementById("alertas");



if(alerta){


if(saldo < 0){


alerta.innerHTML =

"⚠️ Suas despesas estão maiores que suas receitas.";



}

else if(receitas > 0 && despesas > receitas * 0.8){


alerta.innerHTML =

"⚠️ Você já utilizou mais de 80% da sua receita.";



}

else{


alerta.innerHTML =

"✅ Sua situação financeira está equilibrada.";



}


}



}








//================================
// INICIALIZAÇÃO
//================================



atualizarDashboard();
