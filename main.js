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





// CUSTOS VARIÁVEIS


if(e.target.id === "novoCustoVariavel"){

document.getElementById("formCustoVariavel")
.style.display="block";

}



if(e.target.id === "cancelarCustoVariavel"){

document.getElementById("formCustoVariavel")
.style.display="none";

}



if(e.target.id === "salvarCustoVariavel"){

salvarCustoVariavel();

}



if(e.target.dataset.excluirVariavel){

excluirCustoVariavel(
Number(e.target.dataset.excluirVariavel)
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
Number(document.getElementById("valorReceita").value);


const data =
document.getElementById("dataReceita").value;


const categoria =
document.getElementById("categoriaReceita").value;



if(!descricao || !valor){

alert("Preencha descrição e valor");

return;

}



DB.receitas.push({

id:Date.now(),

descricao,

valor,

data,

categoria

});



salvarDados();

renderReceitas();



}



function renderReceitas(){


const lista =
document.getElementById("listaReceitas");


if(!lista)return;



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


<h4>${receita.descricao}</h4>


<p>
R$ ${receita.valor.toLocaleString(
"pt-BR",
{
minimumFractionDigits:2
}
)}
</p>


<p>
Categoria: ${receita.categoria || "-"}
</p>


<p>
Data: ${receita.data || "-"}
</p>



<button data-excluir-receita="${receita.id}">
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
item=>item.id !== id
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
Number(document.getElementById("valorCustoFixo").value);



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



}



function renderCustosFixos(){


const lista =
document.getElementById("listaCustosFixos");


if(!lista)return;



if(DB.custosFixos.length===0){

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

<h4>${custo.nome}</h4>

<p>
R$ ${custo.valor.toLocaleString(
"pt-BR",
{
minimumFractionDigits:2
}
)}
</p>

<p>
${custo.categoria || "-"}
</p>


<button data-excluir-custo="${custo.id}">
Excluir
</button>


</div>

`;



});



lista.innerHTML=html;



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
item=>item.id !== id
);



salvarDados();

renderCustosFixos();


}





//=============================
// CUSTOS VARIÁVEIS
//=============================


function salvarCustoVariavel(){


const nome =
document.getElementById("nomeCustoVariavel").value;


const valor =
Number(document.getElementById("valorCustoVariavel").value);



const data =
document.getElementById("dataCustoVariavel").value;



const categoria =
document.getElementById("categoriaCustoVariavel").value;



if(!nome || !valor){

alert("Preencha nome e valor");

return;

}



DB.custosVariaveis.push({

id:Date.now(),

nome,

valor,

data,

categoria

});



salvarDados();

renderCustosVariaveis();


}



function renderCustosVariaveis(){


const lista =
document.getElementById("listaCustosVariaveis");


if(!lista)return;



if(DB.custosVariaveis.length===0){

lista.innerHTML =
"Nenhum custo variável cadastrado.";

return;

}



let html="";



DB.custosVariaveis.forEach(custo=>{


html += `

<div class="card">


<h4>${custo.nome}</h4>


<p>
R$ ${custo.valor.toLocaleString(
"pt-BR",
{
minimumFractionDigits:2
}
)}
</p>


<p>
Categoria: ${custo.categoria || "-"}
</p>


<p>
Data: ${custo.data || "-"}
</p>


<button data-excluir-variavel="${custo.id}">
Excluir
</button>


</div>


`;


});



lista.innerHTML=html;


}



function excluirCustoVariavel(id){


DB.custosVariaveis =
DB.custosVariaveis.filter(
item=>item.id !== id
);



salvarDados();

renderCustosVariaveis();


}
