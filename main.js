// ======================================
// AUREA
// MAIN.JS
// PARTE 1/3
// ======================================


// ==============================
// BANCO DE DADOS
// ==============================


const DB = {

receitas: [],

despesas: [],

investimentos: [],

limites: [],

desejos: [],

config:{

mes:5,

ano:2026

}

};





// ==============================
// LOCAL STORAGE
// ==============================


function carregarDados(){

const dados =
localStorage.getItem("aureaDB");


if(dados){

Object.assign(
DB,
JSON.parse(dados)
);

}


}



function salvarDados(){

localStorage.setItem(
"aureaDB",
JSON.stringify(DB)
);

}



carregarDados();







// ==============================
// UTILIDADES
// ==============================


function moeda(valor){

return Number(valor || 0)
.toLocaleString(
"pt-BR",
{

style:"currency",

currency:"BRL"

}

);

}





function id(){

return Date.now();

}







// ==============================
// CÁLCULOS
// ==============================



function receitasTotal(){


return DB.receitas.reduce(

(total,item)=>

total + Number(item.valor),

0

);


}




function despesasTotal(){


return DB.despesas.reduce(

(total,item)=>

total + Number(item.valor),

0

);


}




function saldoAtual(){


return receitasTotal()
-
despesasTotal();


}





function investimentosTotal(){


return DB.investimentos.reduce(

(total,item)=>

total + Number(item.valor),

0

);


}








// ==============================
// NAVEGAÇÃO
// ==============================


const conteudo =
document.getElementById("conteudo");



const paginas = [

"dashboard",

"financeiro",

"investimentos",

"limites",

"desejos"

];






function abrirPagina(nome){


document
.querySelectorAll(".containerTela")
.forEach(tela=>{

tela.style.display="none";

});



const tela =
document.getElementById(nome);



if(tela){

tela.style.display="block";

}



}



document
.querySelectorAll(".menu")
.forEach(botao=>{


botao.onclick=function(){



document
.querySelectorAll(".menu")
.forEach(btn=>{

btn.classList.remove("active");

});



this.classList.add("active");



document
.getElementById("tituloPagina")
.innerHTML=this.innerText;



abrirPagina(
this.dataset.page
);



};


});









// ==============================
// ESTRUTURA DAS TELAS
// ==============================



conteudo.innerHTML = `



<section id="dashboard" class="containerTela">


<div id="dashboardConteudo"></div>


</section>






<section id="financeiro" class="containerTela" style="display:none">


<div id="financeiroConteudo"></div>


</section>






<section id="investimentos" class="containerTela" style="display:none">


<div id="investimentosConteudo"></div>


</section>






<section id="limites" class="containerTela" style="display:none">


<div id="limitesConteudo"></div>


</section>






<section id="desejos" class="containerTela" style="display:none">


<div id="desejosConteudo"></div>


</section>



`;





abrirPagina("dashboard");



// continua na PARTE 2
// ======================================
// AUREA
// MAIN.JS
// PARTE 2/3
// DASHBOARD + FINANCEIRO
// ======================================




// ==============================
// DASHBOARD
// ==============================


function renderDashboard(){


const area =
document.getElementById(
"dashboardConteudo"
);



if(!area)return;



area.innerHTML = `



<div class="cards">


<div class="card">

<h3>

Receitas

</h3>

<p>

${moeda(receitasTotal())}

</p>

</div>





<div class="card">

<h3>

Despesas

</h3>

<p>

${moeda(despesasTotal())}

</p>

</div>






<div class="card">

<h3>

Saldo disponível

</h3>

<p>

${moeda(saldoAtual())}

</p>

</div>







<div class="card">

<h3>

Investimentos

</h3>

<p>

${moeda(investimentosTotal())}

</p>

</div>



</div>







<div class="painel">


<h3>

Alertas Inteligentes

</h3>


<div id="alertas">

</div>


</div>








<div class="painel">


<h3>

Gastos por categoria

</h3>



<div class="donut"></div>


<div id="categoriasGrafico"></div>



</div>






<div class="painel">


<h3>

Últimas movimentações

</h3>


<div id="ultimasMovimentacoes">

</div>



</div>



`;



gerarAlertas();

renderCategorias();

renderMovimentacoes();



}







function gerarAlertas(){



const area =
document.getElementById(
"alertas"
);



if(!area)return;



let mensagens=[];



if(saldoAtual()<0){


mensagens.push(

"⚠️ Suas despesas estão acima das receitas."

);


}



if(receitasTotal()>0){



const porcentagem =

(despesasTotal()/receitasTotal())*100;



if(porcentagem>80){


mensagens.push(

`⚠️ Você já comprometeu ${porcentagem.toFixed(0)}% da renda.`

);



}else{


mensagens.push(

`✅ Controle saudável: ${porcentagem.toFixed(0)}% utilizado.`

);



}



}





if(mensagens.length===0){


mensagens.push(

"✅ Nenhum alerta financeiro."

);



}



area.innerHTML =

mensagens
.map(x=>`<p>${x}</p>`)
.join("");



}








function renderCategorias(){


const area =
document.getElementById(
"categoriasGrafico"
);



if(!area)return;



const categorias={};



DB.despesas.forEach(item=>{


const cat =
item.categoria || "Outros";



categorias[cat]=

(categorias[cat]||0)

+

Number(item.valor);



});





area.innerHTML =

Object.entries(categorias)

.map(item=>`


<p>

${item[0]}

-
${moeda(item[1])}

</p>


`)

.join("");



}









function renderMovimentacoes(){



const area =
document.getElementById(
"ultimasMovimentacoes"
);



if(!area)return;



let dados=[

...DB.receitas.map(x=>({

nome:x.nome,

valor:x.valor,

tipo:"Receita"

})),



...DB.despesas.map(x=>({

nome:x.nome,

valor:x.valor,

tipo:"Despesa"

}))


];



area.innerHTML =

dados.slice(-5)
.reverse()

.map(x=>`


<div class="item">


<strong>

${x.nome}

</strong>


<span>

${x.tipo==="Receita"?"+":"-"}

${moeda(x.valor)}

</span>


</div>


`)

.join("");



}









renderDashboard();







// ==============================
// FINANCEIRO
// ==============================


function renderFinanceiro(){



const area =

document.getElementById(

"financeiroConteudo"

);



if(!area)return;




area.innerHTML = `



<div class="cards">


<div class="card">

<h3>

Receita mensal

</h3>

<p>

${moeda(receitasTotal())}

</p>


</div>



<div class="card">

<h3>

Custos

</h3>


<p>

${moeda(despesasTotal())}

</p>


</div>



</div>









<div class="painel">


<h3>

Nova movimentação

</h3>




<input id="nomeMovimento"

placeholder="Descrição">





<input id="valorMovimento"

type="number"

placeholder="Valor">





<select id="tipoMovimento">


<option value="receita">

Receita

</option>


<option value="despesa">

Despesa

</option>


</select>





<input id="categoriaMovimento"

placeholder="Categoria">





<button id="salvarMovimento">

Adicionar

</button>



</div>








<div class="painel">


<h3>

Histórico

</h3>


<div id="listaMovimentos"></div>



</div>



`;



renderMovimentos();



}








function salvarMovimento(){


const nome =

nomeMovimento.value;



const valor =

Number(valorMovimento.value);



const tipo =

tipoMovimento.value;



const categoria =

categoriaMovimento.value;




if(!nome || !valor)return;





if(tipo==="receita"){


DB.receitas.push({

id:id(),

nome,

valor,

categoria

});


}else{


DB.despesas.push({

id:id(),

nome,

valor,

categoria

});


}





salvarDados();



renderFinanceiro();



renderDashboard();



}








function renderMovimentos(){


const area =

document.getElementById(

"listaMovimentos"

);



if(!area)return;





let dados=[

...DB.receitas.map(x=>({...x,tipo:"Receita"})),

...DB.despesas.map(x=>({...x,tipo:"Despesa"}))

];





area.innerHTML =



dados.map(x=>`


<div class="item">


<strong>

${x.nome}

</strong>


<span>

${moeda(x.valor)}

</span>


</div>


`).join("");



}







document.addEventListener(

"click",

function(e){


if(e.target.id==="salvarMovimento"){


salvarMovimento();


}



});



// continua na PARTE 3
// ======================================
// AUREA
// MAIN.JS
// PARTE 3/3
// INVESTIMENTOS + LIMITES + DESEJOS
// ======================================






// ==============================
// INVESTIMENTOS
// ==============================


function renderInvestimentos(){


const area =
document.getElementById(
"investimentosConteudo"
);



if(!area)return;



area.innerHTML = `



<div class="cards">


<div class="card">

<h3>

Total investido

</h3>


<p>

${moeda(investimentosTotal())}

</p>


</div>


</div>






<div class="painel">


<h3>

Novo aporte

</h3>



<input id="nomeInvestimento"

placeholder="Nome do investimento">





<input id="valorInvestimento"

type="number"

placeholder="Valor">






<button id="salvarInvestimento">

Adicionar

</button>



</div>








<div class="painel">


<h3>

Carteira

</h3>



<div id="listaInvestimentos">

</div>


</div>



`;



listarInvestimentos();



}









function salvarInvestimento(){


const nome =

nomeInvestimento.value;



const valor =

Number(valorInvestimento.value);



if(!nome || !valor)return;




DB.investimentos.push({

id:id(),

nome,

valor

});



salvarDados();



renderInvestimentos();

renderDashboard();



}








function listarInvestimentos(){



const area =

document.getElementById(

"listaInvestimentos"

);



if(!area)return;





area.innerHTML =



DB.investimentos.map(item=>`



<div class="item">


<strong>

${item.nome}

</strong>


<span>

${moeda(item.valor)}

</span>


</div>



`).join("");



}








// ==============================
// LIMITES
// ==============================


function renderLimites(){


const area =

document.getElementById(

"limitesConteudo"

);



if(!area)return;



area.innerHTML = `



<div class="painel">


<h3>

Criar limite

</h3>



<input id="nomeLimite"

placeholder="Categoria">





<input id="valorLimite"

type="number"

placeholder="Valor máximo">






<button id="salvarLimite">

Salvar

</button>



</div>







<div class="painel">


<h3>

Meus limites

</h3>


<div id="listaLimites">

</div>



</div>



`;



listarLimites();



}









function salvarLimite(){



const categoria =

nomeLimite.value;



const valor =

Number(valorLimite.value);





if(!categoria || !valor)return;




DB.limites.push({

id:id(),

categoria,

valor

});



salvarDados();



renderLimites();



}









function listarLimites(){



const area =

document.getElementById(

"listaLimites"

);



if(!area)return;



area.innerHTML =



DB.limites.map(item=>{


const gasto =

DB.despesas

.filter(x=>

x.categoria===item.categoria

)

.reduce(

(t,x)=>t+x.valor,

0

);



const percentual =

(gasto/item.valor)*100;




return `



<div class="item">


<div>


<strong>

${item.categoria}

</strong>



<p>

${moeda(gasto)}

de

${moeda(item.valor)}

</p>


</div>




<strong>

${percentual.toFixed(0)}%

</strong>



</div>



`;



}).join("");



}









// ==============================
// DESEJOS
// ==============================


function renderDesejos(){



const area =

document.getElementById(

"desejosConteudo"

);



if(!area)return;





area.innerHTML = `



<div class="cards">


<div class="card">

<h3>

Total das metas

</h3>


<p>

${moeda(
DB.desejos.reduce(
(t,x)=>t+x.valor,
0
)
)}

</p>


</div>




<div class="card">


<h3>

Guardado

</h3>


<p>

${moeda(

DB.desejos.reduce(

(t,x)=>

t+(x.guardado||0),

0

)

)}

</p>


</div>



</div>








<div class="painel">


<h3>

Novo desejo

</h3>




<input id="nomeDesejo"

placeholder="Ex: Viagem">





<input id="valorDesejo"

type="number"

placeholder="Valor da meta">





<button id="salvarDesejo">

Criar meta

</button>


</div>








<div class="painel">


<h3>

Minhas metas

</h3>


<div id="listaDesejos">

</div>


</div>



`;



listarDesejos();



}









function salvarDesejo(){



const nome =

nomeDesejo.value;



const valor =

Number(valorDesejo.value);



if(!nome || !valor)return;





DB.desejos.push({

id:id(),

nome,

valor,

guardado:0

});



salvarDados();



renderDesejos();



}









function listarDesejos(){



const area =

document.getElementById(

"listaDesejos"

);



if(!area)return;





area.innerHTML =



DB.desejos.map(item=>{


const percentual =

(item.guardado/item.valor)*100;



return `



<div class="item">


<div>


<strong>

${item.nome}

</strong>


<p>

Meta:

${moeda(item.valor)}

</p>


<p>

Guardado:

${moeda(item.guardado)}

</p>



</div>



<strong>

${percentual.toFixed(0)}%

</strong>



</div>



`;



}).join("");



}











// ==============================
// EVENTOS FINAIS
// ==============================



document.addEventListener(

"click",

function(e){



if(e.target.id==="salvarInvestimento"){


salvarInvestimento();


}



if(e.target.id==="salvarLimite"){


salvarLimite();


}



if(e.target.id==="salvarDesejo"){


salvarDesejo();


}



});








// ==============================
// CARREGAMENTO FINAL
// ==============================



renderDashboard();

renderFinanceiro();

renderInvestimentos();

renderLimites();

renderDesejos();



console.log(

"AUREA iniciado"

);
