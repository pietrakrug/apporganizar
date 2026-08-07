/* =====================================
AUREA
MAIN.JS
PARTE 1/4

BANCO DE DADOS + NAVEGAÇÃO + ESTRUTURA
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
localStorage.getItem(
"AUREA_DB"
);



if(dados){

const banco =
JSON.parse(dados);



DB.receitas =
banco.receitas || [];

DB.despesas =
banco.despesas || [];

DB.investimentos =
banco.investimentos || [];

DB.limites =
banco.limites || [];

DB.desejos =
banco.desejos || [];

DB.config =
banco.config || DB.config;


}



}



carregar();







/* ===============================
UTILIDADES
================================ */


function id(){

return Date.now();

}





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





function dataAtual(){

return new Date()
.toLocaleDateString(
"pt-BR"
);

}





function mostrar(id){

const el =
document.getElementById(id);



if(el){

el.style.display="block";

}

}





function esconder(id){

const el =
document.getElementById(id);



if(el){

el.style.display="none";

}

}









/* ===============================
CÁLCULOS PRINCIPAIS
================================ */


function totalReceitas(){

return DB.receitas.reduce(
((total,item)=>
total + Number(item.valor)),
0
);

}





function totalDespesas(){

return DB.despesas.reduce(
((total,item)=>
total + Number(item.valor)),
0
);

}





function totalInvestimentos(){

return DB.investimentos.reduce(
((total,item)=>
total + Number(item.valor)),
0
);

}





function saldo(){

return totalReceitas()
-
totalDespesas();

}









/* ===============================
ELEMENTO PRINCIPAL
================================ */


const conteudo =
document.getElementById(
"conteudo"
);








/* ===============================
PÁGINAS
================================ */


const paginas = {

dashboard:`

<div class="containerTela">


<div class="cards">


<div class="card">

<h3>
Receitas
</h3>

<p id="dashReceitas">
R$ 0,00
</p>

</div>



<div class="card">

<h3>
Despesas
</h3>

<p id="dashDespesas">
R$ 0,00
</p>

</div>




<div class="card">

<h3>
Saldo Atual
</h3>

<p id="dashSaldo">
R$ 0,00
</p>

</div>




<div class="card">

<h3>
Investimentos
</h3>

<p id="dashInvestimentos">
R$ 0,00
</p>

</div>


</div>




<div class="painel">

<h3>
Resumo financeiro
</h3>


<div id="resumoFinanceiro">

</div>


</div>




<div class="painel">

<h3>
Alertas
</h3>


<div id="alertas">

</div>


</div>




<div class="painel">

<h3>
Gastos por categoria
</h3>


<div id="categoriasGrafico">

</div>


</div>



</div>

`,





financeiro:`

<div class="containerTela">


<div class="painel">


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



<input 
id="categoria"
placeholder="Categoria">



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


<button id="novoInvestimento">
+ Novo investimento
</button>



<div id="formInvestimento"
style="display:none">


<input
id="nomeInvestimento"
placeholder="Nome investimento">


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
Meus investimentos
</h3>


<div id="listaInvestimentos">

</div>


</div>


</div>

`,





limites:`

<div class="containerTela">


<div class="painel">


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

<h3>
Controle de limites
</h3>


<div id="listaLimites">

</div>


</div>



</div>

`,





desejos:`

<div class="containerTela">


<div class="painel">


<input
id="nomeDesejo"
placeholder="Nome da meta">


<input
id="valorDesejo"
type="number"
placeholder="Valor">


<input
id="prazoDesejo"
placeholder="Prazo">


<button id="salvarDesejo">

Criar meta

</button>


</div>




<div class="painel">


<h3>
Meus objetivos
</h3>


<div id="listaDesejos">

</div>


</div>


</div>

`


};






/* ===============================
CARREGAR PÁGINA
================================ */


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






carregarPagina(
"dashboard"
);







/* ===============================
MENU
================================ */


document
.querySelectorAll(".menu")
.forEach(botao=>{


botao.onclick=function(){


document
.querySelectorAll(".menu")
.forEach(item=>

item.classList.remove(
"active"
)

);



botao.classList.add(
"active"
);



carregarPagina(
botao.dataset.page
);



const titulo =
document.getElementById(
"tituloPagina"
);



if(titulo){

titulo.innerHTML =
botao.innerText;

}



};


});
/* =====================================
AUREA
MAIN.JS
PARTE 2/4

DASHBOARD + FINANCEIRO
===================================== */



/* ===============================
DASHBOARD
================================ */


function renderDashboard(){


const receita =
document.getElementById(
"dashReceitas"
);



if(!receita)return;



document.getElementById(
"dashReceitas"
).innerHTML =
moeda(
totalReceitas()
);



document.getElementById(
"dashDespesas"
).innerHTML =
moeda(
totalDespesas()
);



document.getElementById(
"dashSaldo"
).innerHTML =
moeda(
saldo()
);



document.getElementById(
"dashInvestimentos"
).innerHTML =
moeda(
totalInvestimentos()
);





const resumo =
document.getElementById(
"resumoFinanceiro"
);



if(resumo){


let percentual = 0;



if(totalReceitas()>0){

percentual =
(totalDespesas()
/
totalReceitas())
*100;

}



resumo.innerHTML = `


<div class="item">

<strong>
Utilização da renda
</strong>


<span>
${percentual.toFixed(0)}%
</span>


</div>



<div class="item">

<strong>
Saldo disponível
</strong>


<span class="saldo">

${moeda(saldo())}

</span>


</div>


`;

}



gerarAlertas();

gerarCategorias();


}









/* ===============================
FINANCEIRO
================================ */



function renderFinanceiro(){



renderListaFinanceiro();




const novo =
document.getElementById(
"novoLancamento"
);



if(novo){



novo.onclick=function(){


mostrar(
"formLancamento"
);


};


}






const salvarBtn =
document.getElementById(
"salvarLancamento"
);



if(salvarBtn){



salvarBtn.onclick=function(){



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



const categoria =
document.getElementById(
"categoria"
).value ||
"Outros";





if(!descricao || !valor){


alert(
"Preencha todos os campos"
);


return;


}






const movimento = {


id:id(),


descricao,


valor,


categoria,


tipo,


data:new Date()


};







if(tipo==="receita"){


DB.receitas.push(
movimento
);


}else{


DB.despesas.push(
movimento
);


}






salvar();




renderFinanceiro();





};



}





}











/* ===============================
LISTA FINANCEIRA
================================ */



function renderListaFinanceiro(){



const lista =
document.getElementById(
"listaFinanceiro"
);




if(!lista)return;





let html = "";





DB.receitas.forEach(item=>{


html += `


<div class="item">


<div>

<strong>
${item.descricao}
</strong>


<small>

${item.categoria}

</small>


</div>



<span class="receita">

+ ${moeda(item.valor)}

</span>



<button onclick="removerLancamento(${item.id})">

Excluir

</button>


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


<small>

${item.categoria}

</small>


</div>



<span class="despesa">

- ${moeda(item.valor)}

</span>



<button onclick="removerLancamento(${item.id})">

Excluir

</button>


</div>


`;



});






if(html===""){



html = `


<div class="vazio">

Nenhum lançamento cadastrado.

</div>


`;



}




lista.innerHTML =
html;



}









/* ===============================
ATUALIZAÇÃO AUTOMÁTICA
================================ */



function atualizarTudo(){


salvar();


renderDashboard();


}









/* ===============================
EXPORTAR
================================ */



window.removerLancamento =
removerLancamento;



window.moeda =
moeda;



window.atualizarTudo =
atualizarTudo;
/* =====================================
AUREA
MAIN.JS
PARTE 3/4

INVESTIMENTOS + LIMITES + DESEJOS
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



lista.innerHTML = `


<div class="vazio">

Nenhum investimento cadastrado.

</div>


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



<p>

${dataAtual()}

</p>



</div>




<span class="investimento">

${moeda(item.valor)}

</span>




<button onclick="removerInvestimento(${item.id})">

Excluir

</button>



</div>


`;



}).join("");



}











/* ===============================
LIMITES
================================ */



function renderLimites(){


renderListaLimites();





const salvarBtn =
document.getElementById(
"salvarLimite"
);





if(salvarBtn){



salvarBtn.onclick=function(){



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



return DB.despesas.reduce(

(total,item)=>{


if(item.categoria===categoria){


return total +
Number(item.valor);


}


return total;


},0);



}









function renderListaLimites(){



const lista =
document.getElementById(
"listaLimites"
);





if(!lista)return;






if(DB.limites.length===0){



lista.innerHTML = `


<div class="vazio">

Nenhum limite criado.

</div>


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
item.valor>0
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



<div class="progress">

<span style="width:${Math.min(percentual,100)}%">

</span>


</div>



<small>

${moeda(gasto)}
de
${moeda(item.valor)}

</small>



</div>





<span>

${percentual.toFixed(0)}%

</span>




<button onclick="removerLimite(${item.id})">

Excluir

</button>




</div>



`;




}).join("");



}









/* ===============================
DESEJOS / METAS
================================ */



function renderDesejos(){



renderListaDesejos();






const salvar =
document.getElementById(
"salvarDesejo"
);





if(salvar){



salvar.onclick=function(){



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
"Preencha os dados da meta"
);



return;


}







DB.desejos.push({


id:id(),


nome,


valor,


prazo,


guardado:0,


data:new Date()


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



lista.innerHTML = `


<div class="vazio">

Nenhuma meta criada.

</div>


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

Objetivo:
${moeda(item.valor)}

</p>



<small>

${item.prazo ?
"Prazo: "+item.prazo
:
""}

</small>


</div>





<button onclick="removerDesejo(${item.id})">

Excluir

</button>



</div>


`;




}).join("");



}









/* ===============================
EXCLUSÕES
================================ */



function removerInvestimento(idInvestimento){



DB.investimentos =

DB.investimentos.filter(

item =>
item.id !== idInvestimento

);



salvar();


renderInvestimentos();


}






function removerLimite(idLimite){



DB.limites =

DB.limites.filter(

item =>
item.id !== idLimite

);



salvar();


renderLimites();


}






function removerDesejo(idDesejo){



DB.desejos =

DB.desejos.filter(

item =>
item.id !== idDesejo

);



salvar();


renderDesejos();


}






/* ===============================
EXPORTAR FUNÇÕES
================================ */



window.removerInvestimento =
removerInvestimento;



window.removerLimite =
removerLimite;



window.removerDesejo =
removerDesejo;
/* =====================================
AUREA
MAIN.JS
PARTE 4/4

GRÁFICOS + ALERTAS + FINALIZAÇÃO
===================================== */





/* ===============================
ALERTAS FINANCEIROS
================================ */



function gerarAlertas(){



const alerta =
document.getElementById(
"alertas"
);





if(!alerta)return;






let mensagens = [];





const saldoAtual =
saldo();






if(saldoAtual < 0){



mensagens.push(`


<div class="item">

⚠️ Seu saldo está negativo.

</div>


`);


}






const receita =
totalReceitas();



const despesas =
totalDespesas();






if(receita > 0){



const uso =
(despesas / receita) * 100;





if(uso >= 80){



mensagens.push(`


<div class="item">

⚠️ Você já utilizou ${uso.toFixed(0)}% da sua renda.

</div>


`);


}



}







if(DB.desejos.length > 0){



mensagens.push(`


<div class="item">

✨ Você possui ${DB.desejos.length} metas financeiras.

</div>


`);


}






if(mensagens.length===0){



mensagens.push(`


<div class="item">

✅ Sua organização financeira está em dia.

</div>


`);



}






alerta.innerHTML =
mensagens.join("");



}









/* ===============================
CATEGORIAS DE GASTOS
================================ */



function gerarCategorias(){



const grafico =
document.getElementById(
"categoriasGrafico"
);





if(!grafico)return;






let categorias = {};






DB.despesas.forEach(item=>{



const categoria =
item.categoria ||
"Outros";





if(!categorias[categoria]){


categorias[categoria]=0;


}





categorias[categoria] +=
Number(item.valor);



});







if(Object.keys(categorias).length===0){



grafico.innerHTML = `


<div class="vazio">

Nenhuma despesa cadastrada.

</div>


`;



return;


}







grafico.innerHTML =



Object.entries(categorias)

.map(([nome,valor])=>{



const percentual =

(totalDespesas()>0)

?

(valor / totalDespesas()) * 100

:

0;





return `



<div class="item">


<strong>

${nome}

</strong>



<div>


${moeda(valor)}





<div class="progress">


<span style="width:${percentual}%">

</span>


</div>



</div>



</div>


`;



})

.join("");



}









/* ===============================
SELETOR DE MÊS
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




carregarPagina(
"dashboard"
);



};



}









/* ===============================
ATUALIZAÇÃO GERAL
================================ */



function atualizarTudo(){



salvar();



renderDashboard();



gerarAlertas();



gerarCategorias();



}









/* ===============================
INICIALIZAÇÃO
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
EXPORTAR
================================ */



window.removerLancamento =
removerLancamento;



window.removerInvestimento =
removerInvestimento;



window.removerLimite =
removerLimite;



window.removerDesejo =
removerDesejo;



window.atualizarTudo =
atualizarTudo;



window.renderDashboard =
renderDashboard;



window.renderFinanceiro =
renderFinanceiro;



window.renderInvestimentos =
renderInvestimentos;



window.renderLimites =
renderLimites;



window.renderDesejos =
renderDesejos;
