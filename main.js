/* =====================================
   AUREA
   MAIN.JS
   PARTE 1/5
===================================== */


/* ===============================
BANCO DE DADOS
================================ */


const DB = {

receitas: [],

despesas: [],

investimentos: [],

limites: [],

desejos: [],

config: {

mes: new Date().getMonth(),

ano: new Date().getFullYear()

}

};





/* ===============================
LOCAL STORAGE
================================ */


function salvar(){

localStorage.setItem(
"AUREA_DB",
JSON.stringify(DB)
);

}



function carregar(){

const dados =
localStorage.getItem("AUREA_DB");


if(dados){

Object.assign(
DB,
JSON.parse(dados)
);

}

}



carregar();





/* ===============================
AUXILIARES
================================ */


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





function mostrar(id){

const elemento =
document.getElementById(id);


if(elemento){

elemento.style.display="block";

}

}





function esconder(id){

const elemento =
document.getElementById(id);


if(elemento){

elemento.style.display="none";

}

}





/* ===============================
NAVEGAÇÃO
================================ */


const conteudo =
document.getElementById("conteudo");



const paginas = {


dashboard:`

<div class="containerTela">

<div class="cards">

<div class="card">

<h3>Receitas</h3>

<p id="dashReceitas">
R$ 0,00
</p>

</div>


<div class="card">

<h3>Despesas</h3>

<p id="dashDespesas">
R$ 0,00
</p>

</div>



<div class="card">

<h3>Saldo Atual</h3>

<p id="dashSaldo">
R$ 0,00
</p>

</div>



<div class="card">

<h3>Investimentos</h3>

<p id="dashInvestimentos">
R$ 0,00
</p>

</div>


</div>



<div class="painel">

<h3>
Resumo Financeiro
</h3>


<div id="resumoFinanceiro">

</div>


</div>


</div>

`,





financeiro:`

<div class="containerTela">


<div class="painel">


<h3>
Meu Financeiro
</h3>


<button id="novoLancamento">
+ Novo lançamento
</button>


<div id="formLancamento"
style="display:none">


<input 
id="descricao"
placeholder="Descrição">


<input
id="valor"
type="number"
placeholder="Valor">


<select id="tipo">


<option value="receita">
Receita
</option>


<option value="despesa">
Despesa
</option>


</select>



<button id="salvarLancamento">

Salvar

</button>


</div>


</div>



<div class="painel">


<h3>
Histórico
</h3>


<div id="listaFinanceiro">

</div>


</div>


</div>

`,





investimentos:`

<div class="containerTela">


<div class="painel">

<h3>
Meus Investimentos
</h3>


<button id="novoInvestimento">

+ Novo investimento

</button>


<div id="formInvestimento"
style="display:none">


<input id="nomeInvestimento"
placeholder="Nome">


<input 
id="valorInvestimento"
type="number"
placeholder="Valor">


<button id="salvarInvestimento">

Salvar

</button>


</div>


</div>


<div class="painel">

<h3>
Carteira

</h3>


<div id="listaInvestimentos">

</div>


</div>


</div>

`,





limites:`

<div class="containerTela">


<div class="painel">


<h3>
Limites de gastos
</h3>


<input
id="categoriaLimite"
placeholder="Categoria">


<input
id="valorLimite"
type="number"
placeholder="Limite">


<button id="salvarLimite">

Salvar limite

</button>


</div>


<div class="painel">


<div id="listaLimites">

</div>


</div>


</div>

`,





desejos:`

<div class="containerTela">


<div class="painel">


<h3>
Metas e desejos

</h3>


<input
id="nomeDesejo"
placeholder="Objetivo">


<input
id="valorDesejo"
type="number"
placeholder="Valor da meta">


<button id="salvarDesejo">

Criar meta

</button>


</div>



<div class="painel">


<div id="listaDesejos">

</div>


</div>


</div>

`


};





function carregarPagina(nome){


conteudo.innerHTML =
paginas[nome];


if(nome==="dashboard")
renderDashboard();


if(nome==="financeiro")
renderFinanceiro();


if(nome==="investimentos")
renderInvestimentos();


if(nome==="limites")
renderLimites();


if(nome==="desejos")
renderDesejos();


}



carregarPagina("dashboard");





document
.querySelectorAll(".menu")
.forEach(botao=>{


botao.onclick=function(){


document
.querySelectorAll(".menu")
.forEach(x=>
x.classList.remove("active")
);



botao.classList.add("active");



carregarPagina(
botao.dataset.page
);



document
.getElementById("tituloPagina")
.innerHTML =
botao.innerText;


};


});
/* =====================================
   AUREA
   MAIN.JS
   PARTE 2/5

   DASHBOARD + FINANCEIRO
===================================== */



/* ===============================
CÁLCULOS
================================ */


function totalReceitas(){

return DB.receitas.reduce(
(total,item)=>
total + Number(item.valor),
0
);

}





function totalDespesas(){

return DB.despesas.reduce(
(total,item)=>
total + Number(item.valor),
0
);

}





function totalInvestimentos(){

return DB.investimentos.reduce(
(total,item)=>
total + Number(item.valor),
0
);

}





function saldo(){

return totalReceitas()
-
totalDespesas();

}







/* ===============================
DASHBOARD
================================ */


function renderDashboard(){


document.getElementById(
"dashReceitas"
).innerHTML =
moeda(totalReceitas());



document.getElementById(
"dashDespesas"
).innerHTML =
moeda(totalDespesas());



document.getElementById(
"dashSaldo"
).innerHTML =
moeda(saldo());



document.getElementById(
"dashInvestimentos"
).innerHTML =
moeda(totalInvestimentos());




const resumo =
document.getElementById(
"resumoFinanceiro"
);



if(resumo){


let mensagem="";



if(saldo()<0){


mensagem=`

<p>
⚠️ Atenção: suas despesas estão maiores que suas receitas.
</p>

`;



}else{


mensagem=`

<p>
✅ Sua organização financeira está positiva.
</p>

`;

}



const percentual =
totalReceitas()>0
?
(totalDespesas()/totalReceitas())*100
:
0;



mensagem += `


<p>

Você utilizou 
<strong>
${percentual.toFixed(0)}%
</strong>

da sua renda.

</p>


`;



resumo.innerHTML =
mensagem;


}



}





/* ===============================
FINANCEIRO
================================ */


function renderFinanceiro(){


renderListaFinanceiro();


const botaoNovo =
document.getElementById(
"novoLancamento"
);



if(botaoNovo){


botaoNovo.onclick=function(){

mostrar(
"formLancamento"
);

};


}





const salvar =
document.getElementById(
"salvarLancamento"
);



if(salvar){


salvar.onclick=function(){


const descricao =
document.getElementById(
"descricao"
).value;



const valor =
Number(
document.getElementById(
"valor"
).value
);



const tipo =
document.getElementById(
"tipo"
).value;




if(!descricao || !valor){

alert(
"Preencha os dados"
);

return;

}



const item={

id:id(),

descricao,

valor,

data:new Date(),

tipo

};




if(tipo==="receita"){

DB.receitas.push(item);

}else{

DB.despesas.push(item);

}



salvar();



renderFinanceiro();



};


}



}





function renderListaFinanceiro(){


const lista =
document.getElementById(
"listaFinanceiro"
);



if(!lista)return;



let html="";





DB.receitas.forEach(item=>{


html += `

<div class="item">

<div>

<strong>
${item.descricao}
</strong>


<br>

<span class="receita">

+ ${moeda(item.valor)}

</span>

</div>



</div>


`;



});







DB.despesas.forEach(item=>{


html += `

<div class="item">

<div>

<strong>
${item.descricao}
</strong>


<br>


<span class="despesa">

- ${moeda(item.valor)}

</span>


</div>


</div>

`;



});





if(html===""){

html=`

<p class="vazio">

Nenhum lançamento cadastrado.

</p>

`;

}



lista.innerHTML=html;



}

/* =====================================
   AUREA
   MAIN.JS
   PARTE 3/5

   INVESTIMENTOS + LIMITES
===================================== */



/* ===============================
INVESTIMENTOS
================================ */


function renderInvestimentos(){


renderListaInvestimentos();



const novo =
document.getElementById(
"novoInvestimento"
);



if(novo){


novo.onclick=function(){

mostrar(
"formInvestimento"
);

};


}




const salvarInvest =
document.getElementById(
"salvarInvestimento"
);



if(salvarInvest){


salvarInvest.onclick=function(){



const nome =
document.getElementById(
"nomeInvestimento"
).value;



const valor =
Number(
document.getElementById(
"valorInvestimento"
).value
);



if(!nome || !valor){

alert(
"Preencha os dados do investimento"
);

return;

}



DB.investimentos.push({

id:id(),

nome,

valor,

data:new Date()

});



salvar();



renderInvestimentos();



};


}



}





function renderListaInvestimentos(){


const lista =
document.getElementById(
"listaInvestimentos"
);



if(!lista)return;




if(DB.investimentos.length===0){


lista.innerHTML=`

<p class="vazio">

Nenhum investimento cadastrado.

</p>

`;

return;


}




lista.innerHTML =

DB.investimentos.map(item=>{


return `

<div class="item">


<div>


<strong>

${item.nome}

</strong>


<br>


<span class="investimento">

${moeda(item.valor)}

</span>


</div>


</div>


`;


}).join("");



}







/* ===============================
LIMITES
================================ */



function renderLimites(){


renderListaLimites();



const salvarLimite =
document.getElementById(
"salvarLimite"
);



if(salvarLimite){



salvarLimite.onclick=function(){



const categoria =
document.getElementById(
"categoriaLimite"
).value;



const valor =
Number(
document.getElementById(
"valorLimite"
).value
);




if(!categoria || !valor){

alert(
"Informe categoria e valor"
);

return;

}



DB.limites.push({

id:id(),

categoria,

valor

});



salvar();



renderLimites();



};



}



}






function gastoCategoria(categoria){



let total=0;



DB.despesas.forEach(item=>{


if(item.categoria===categoria){


total += Number(item.valor);


}


});



return total;



}






function renderListaLimites(){


const lista =
document.getElementById(
"listaLimites"
);



if(!lista)return;




if(DB.limites.length===0){


lista.innerHTML=`

<p class="vazio">

Nenhum limite criado.

</p>

`;

return;


}





lista.innerHTML =


DB.limites.map(item=>{


const gasto =
gastoCategoria(
item.categoria
);



const percentual =
(item.valor>0)
?
(gasto/item.valor)*100
:
0;



return `


<div class="item">


<div>


<strong>

${item.categoria}

</strong>


<br>


<span>

${moeda(gasto)}

de

${moeda(item.valor)}

</span>


<div class="progress">


<span style="width:${Math.min(percentual,100)}%">

</span>


</div>


</div>



</div>


`;



}).join("");



}
/* =====================================
AUREA
MAIN.JS
PARTE 4/5

DESEJOS + EXCLUSÕES + UTILIDADES
===================================== */



/* ===============================
DESEJOS
================================ */


function renderDesejos(){


renderListaDesejos();



const novo =
document.getElementById(
"novoDesejo"
);



if(novo){


novo.onclick=function(){


mostrar(
"formDesejo"
);


};


}





const salvarDesejo =
document.getElementById(
"salvarDesejo"
);



if(salvarDesejo){


salvarDesejo.onclick=function(){



const nome =
document.getElementById(
"nomeDesejo"
).value;



const valor =
Number(
document.getElementById(
"valorDesejo"
).value
);



const prazo =
document.getElementById(
"prazoDesejo"
).value;



if(!nome || !valor){


alert(
"Preencha os dados do desejo"
);


return;


}




DB.desejos.push({


id:id(),

nome,

valor,

prazo,

criado:new Date()



});




salvar();



renderDesejos();



};



}



}





function renderListaDesejos(){



const lista =
document.getElementById(
"listaDesejos"
);



if(!lista)return;



if(DB.desejos.length===0){


lista.innerHTML=`

<p class="vazio">

Nenhuma meta criada ainda.

</p>

`;


return;


}





lista.innerHTML =


DB.desejos.map(item=>{


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


${item.prazo ?
`
<small>
Prazo: ${item.prazo}
</small>
`
:
""}


</div>



<button onclick="removerDesejo(${item.id})">

Excluir

</button>


</div>


`;


}).join("");



}





function removerDesejo(idDesejo){


DB.desejos =

DB.desejos.filter(

item=>item.id !== idDesejo

);



salvar();



renderDesejos();



}








/* ===============================
EXCLUSÃO FINANCEIRA
================================ */



function removerLancamento(idLancamento){



DB.receitas =

DB.receitas.filter(

item=>item.id !== idLancamento

);



DB.despesas =

DB.despesas.filter(

item=>item.id !== idLancamento

);



salvar();



renderFinanceiro();



}





function removerInvestimento(idInvestimento){



DB.investimentos =

DB.investimentos.filter(

item=>item.id !== idInvestimento

);



salvar();



renderInvestimentos();



}





function removerLimite(idLimite){



DB.limites =

DB.limites.filter(

item=>item.id !== idLimite

);



salvar();



renderLimites();



}







/* ===============================
ATUALIZA DASHBOARD
================================ */



function atualizarTudo(){


salvar();


renderDashboard();


}






/* ===============================
MÊS SELECIONADO
================================ */



const seletorMes =
document.getElementById(
"mesSelecionado"
);



if(seletorMes){


seletorMes.onchange=function(){


DB.config.mes =
this.selectedIndex;



salvar();



};



}
/* =====================================
AUREA
MAIN.JS
PARTE 5/5

FINALIZAÇÃO + GRÁFICOS + ALERTAS
===================================== */



/* ===============================
FORMATAÇÃO DE DATAS
================================ */


function dataFormatada(data){


return new Date(data)
.toLocaleDateString(
"pt-BR"
);


}






/* ===============================
CÁLCULO DE PERCENTUAL
================================ */



function percentual(valor,total){


if(!total || total===0){

return 0;

}


return (

(valor / total) * 100

).toFixed(0);


}








/* ===============================
ALERTAS FINANCEIROS
================================ */



function gerarAlertas(){


const alerta =
document.getElementById(
"alertas"
);



if(!alerta)return;



let mensagens=[];



const saldoAtual =
saldo();



if(saldoAtual < 0){


mensagens.push(`

⚠️ Seu saldo está negativo.

`);


}



const total =
totalReceitas();



const gastos =
totalDespesas();



if(total > 0 && gastos > total*0.8){


mensagens.push(`

⚠️ Você já utilizou mais de 80% da sua renda.

`);


}



if(DB.desejos.length>0){


mensagens.push(`

✨ Você possui ${DB.desejos.length} metas financeiras.

`);


}



if(mensagens.length===0){


mensagens.push(`

✅ Sua organização financeira está em dia.

`);


}




alerta.innerHTML = mensagens.join("");



}







/* ===============================
GRÁFICO DE CATEGORIAS
================================ */



function gerarCategorias(){



const grafico =
document.getElementById(
"categoriasGrafico"
);



if(!grafico)return;



let categorias={};



DB.despesas.forEach(item=>{


let cat =
item.categoria ||
"Outros";



if(!categorias[cat]){

categorias[cat]=0;

}



categorias[cat]+=Number(item.valor);



});



if(Object.keys(categorias).length===0){


grafico.innerHTML=`

<p class="vazio">

Nenhuma despesa cadastrada.

</p>

`;


return;


}




grafico.innerHTML =


Object.entries(categorias)

.map(([nome,valor])=>{


return `


<p>


<span>

${nome}

</span>


<strong>

${moeda(valor)}

</strong>


</p>


`;


})


.join("");



}






/* ===============================
INICIALIZAÇÃO FINAL
================================ */



window.onload=function(){



carregar();



carregarPagina(
"dashboard"
);



gerarAlertas();



gerarCategorias();



};






/* ===============================
EXPOR FUNÇÕES
PARA HTML
================================ */



window.removerDesejo =
removerDesejo;



window.removerLancamento =
removerLancamento;



window.removerInvestimento =
removerInvestimento;



window.removerLimite =
removerLimite;



window.moeda =
moeda;
