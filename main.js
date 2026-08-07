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





if(e.target.dataset.excluir){


excluirReceita(
Number(e.target.dataset.excluir)
);


}



});







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

descricao: descricao,

valor: valor,

data: data,

categoria: categoria


});




salvarDados();



renderReceitas();



document.getElementById("formReceita")
.style.display="none";



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



<p>

Categoria:
${receita.categoria || "-"}

</p>



<p>

Data:
${receita.data || "-"}

</p>




<button data-excluir="${receita.id}">

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

receita => receita.id !== id

);




salvarDados();



renderReceitas();



}
