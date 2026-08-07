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
<p id="dashboardReceitas">R$ 0,00</p>
</div>


<div class="card">
<h3>Despesas</h3>
<p id="dashboardDespesas">R$ 0,00</p>
</div>


<div class="card">
<h3>Saldo</h3>
<p id="dashboardSaldo">R$ 0,00</p>
</div>


<div class="card">
<h3>Investimentos</h3>
<p id="dashboardInvestimentos">R$ 0,00</p>
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

<h3>Receita Mensal</h3>

<p id="cardReceitas">
R$ 0,00
</p>

</div>




<div class="card">

<h3>Custo Mensal</h3>

<p id="cardCustos">
R$ 0,00
</p>

</div>





<div class="card">

<h3>Total Dívidas</h3>

<p id="cardDividas">
R$ 0,00
</p>

</div>





<div class="card">

<h3>Total Investido</h3>

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





<div id="formReceita" style="display:none;margin-top:20px;">



<input 
id="descricaoReceita"
placeholder="Descrição"
/>



<input 
id="valorReceita"
type="number"
placeholder="Valor"
/>



<input 
id="dataReceita"
type="date"
/>




<input 
id="categoriaReceita"
placeholder="Categoria"
/>




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





<div id="formCustoFixo" style="display:none;margin-top:20px;">



<input 
id="nomeCustoFixo"
placeholder="Nome da despesa"
/>




<input 
id="valorCustoFixo"
type="number"
placeholder="Valor"
/>





<input 
id="categoriaCustoFixo"
placeholder="Categoria"
/>





<input 
id="pagamentoCustoFixo"
placeholder="Forma de pagamento"
/>





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
.forEach(x=>{

x.classList.remove("active");

});



botao.classList.add("active");



document.getElementById("tituloPagina")
.innerHTML =
botao.innerHTML;



conteudo.innerHTML =
paginas[botao.dataset.page];



if(botao.dataset.page === "financeiro"){


renderReceitas();


renderCustosFixos();


}



};



});
//=============================
// EVENTOS
//=============================


document.addEventListener(
"click",
function(e){



// RECEITAS

if(e.target.id === "novaReceita"){

document.getElementById("formReceita")
.style.display="block";

}



if(e.target.id === "cancelarReceita"){

document.getElementById("formReceita")
.style.display="none";

}



if(e.target.id === "salvarReceita"){

salvarReceita();

}




if(e.target.dataset.excluirReceita){

excluirReceita(
Number(e.target.dataset.excluirReceita)
);

}





// CUSTOS FIXOS


if(e.target.id === "novoCustoFixo"){

document.getElementById("formCustoFixo")
.style.display="block";

}



if(e.target.id === "cancelarCustoFixo"){

document.getElementById("formCustoFixo")
.style.display="none";

}



if(e.target.id === "salvarCustoFixo"){

salvarCustoFixo();

}



if(e.target.dataset.excluirCusto){

excluirCustoFixo(
Number(e.target.dataset.excluirCusto)
);

}



});




//=============================
// RECEITAS
//=============================


function salvarReceita(){



const descricao =
document.getElementById("descricaoReceita").value;



const valor =
Number(
document.getElementById("valorReceita").value
);



const data =
document.getElementById("dataReceita").value;



const categoria =
document.getElementById("categoriaReceita").value;




if(!descricao || !valor){

alert("Preencha descrição e valor");

return;

}




DB.receitas.push({

id: Date.now(),

descricao,

valor,

data,

categoria

});



salvarDados();



renderReceitas();



limparCamposReceita();



document.getElementById("formReceita")
.style.display="none";



}




function limparCamposReceita(){


document.getElementById("descricaoReceita").value="";


document.getElementById("valorReceita").value="";


document.getElementById("dataReceita").value="";


document.getElementById("categoriaReceita").value="";


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





let html="";

let total=0;




DB.receitas.forEach(receita=>{


total += receita.valor;



html += `


<div class="card">


<h4>

${receita.descricao}

</h4>



<p>

Valor:
R$ ${receita.valor.toLocaleString(
"pt-BR",
{
minimumFractionDigits:2
}
)}

</p>



<p>

Categoria:
${receita.categoria || "-"}

</p>



<p>

Data:
${receita.data || "-"}

</p>



<button 
data-excluir-receita="${receita.id}">

Excluir

</button>



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





function excluirReceita(id){



DB.receitas =

DB.receitas.filter(
receita =>
receita.id !== id
);



salvarDados();



renderReceitas();



}





//=============================
// CUSTOS FIXOS
//=============================



function salvarCustoFixo(){



const nome =
document.getElementById("nomeCustoFixo").value;



const valor =
Number(
document.getElementById("valorCustoFixo").value
);



const categoria =
document.getElementById("categoriaCustoFixo").value;



const pagamento =
document.getElementById("pagamentoCustoFixo").value;





if(!nome || !valor){

alert("Preencha nome e valor");

return;

}




DB.custosFixos.push({

id:Date.now(),

nome,

valor,

categoria,

pagamento

});




salvarDados();



renderCustosFixos();



limparCamposCustoFixo();



document.getElementById("formCustoFixo")
.style.display="none";



}





function limparCamposCustoFixo(){


document.getElementById("nomeCustoFixo").value="";


document.getElementById("valorCustoFixo").value="";


document.getElementById("categoriaCustoFixo").value="";


document.getElementById("pagamentoCustoFixo").value="";


}





function renderCustosFixos(){



const lista =
document.getElementById("listaCustosFixos");



if(!lista){

return;

}





if(DB.custosFixos.length === 0){


lista.innerHTML =
"Nenhum custo fixo cadastrado.";


return;


}




let html="";

let total=0;




DB.custosFixos.forEach(custo=>{


total += custo.valor;




html += `


<div class="card">


<h4>

${custo.nome}

</h4>



<p>

Valor:
R$ ${custo.valor.toLocaleString(
"pt-BR",
{
minimumFractionDigits:2
}
)}

</p>



<p>

Categoria:
${custo.categoria || "-"}

</p>



<p>

Pagamento:
${custo.pagamento || "-"}

</p>



<button
data-excluir-custo="${custo.id}">

Excluir

</button>



</div>



`;



});




lista.innerHTML = html;




document.getElementById("cardCustos")
.innerHTML =

"R$ " +

total.toLocaleString(
"pt-BR",
{
minimumFractionDigits:2
}
);



}





function excluirCustoFixo(id){



DB.custosFixos =

DB.custosFixos.filter(

custo =>
custo.id !== id

);



salvarDados();



renderCustosFixos();



}
