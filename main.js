//======================================
// ORGANIZA APP - CONTROLE FINANCEIRO
// PARTE 1/6 - BASE DO SISTEMA
//======================================



//======================================
// BANCO DE DADOS
//======================================


const DB = {

    receitas: [],

    custosFixos: [],

    custosVariaveis: [],

    dividas: [],

    investimentos: [],

    limites: [],

    desejos: [],

    configuracoes: {

        mesSelecionado: new Date().getMonth(),

        anoSelecionado: new Date().getFullYear()

    }

};





//======================================
// CATEGORIAS PADRÃO
//======================================


const categorias = [

    "Alimentação",

    "Mercado",

    "Combustível",

    "Lazer",

    "Entretenimento",

    "Saúde",

    "Farmácia",

    "Eletrônicos",

    "Serviços",

    "Presente",

    "Casa",

    "Filhos",

    "Viagem",

    "Moradia",

    "Contas da Casa",

    "Assinaturas",

    "Internet/Telefone",

    "Academia",

    "Plano de Saúde",

    "Seguro",

    "Financiamento",

    "Outros"

];





//======================================
// LOCAL STORAGE
//======================================


function carregarDados(){


    const dados = localStorage.getItem(
        "organizaDB"
    );


    if(dados){


        try{


            const dadosSalvos =
            JSON.parse(dados);



            Object.assign(
                DB,
                dadosSalvos
            );


        }catch(error){


            console.log(
                "Erro ao carregar dados",
                error
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







//======================================
// FUNÇÕES AUXILIARES
//======================================


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





function gerarId(){


    return Date.now() +
    Math.floor(Math.random()*1000);


}





function formatarData(data){


    if(!data)return "-";


    const partes =
    data.split("-");


    if(partes.length!==3)
    return data;



    return `${partes[2]}/${partes[1]}/${partes[0]}`;


}





function mesAtual(){


    return (

        DB.configuracoes.mesSelecionado

    );

}





function anoAtual(){


    return (

        DB.configuracoes.anoSelecionado

    );

}





function pertenceAoMes(data){


    if(!data)
    return true;



    const dataObj =
    new Date(data);



    return (

        dataObj.getMonth()
        === mesAtual()

        &&

        dataObj.getFullYear()
        === anoAtual()

    );


}








//======================================
// ESTRUTURA DAS TELAS
//======================================


const paginas = {



dashboard: `


<h2>Dashboard</h2>


<div id="dashboardContainer">

</div>


`,






financeiro: `


<h2>Meu Financeiro</h2>


<div id="financeiroContainer">

</div>


`,





investimentos: `


<h2>Investimentos</h2>


<div id="investimentosContainer">

</div>


`,






limites: `


<h2>Limites</h2>


<div id="limitesContainer">

</div>


`,





desejos: `


<h2>Desejos</h2>


<div id="desejosContainer">

</div>


`



};









//======================================
// NAVEGAÇÃO
//======================================



const conteudo =
document.getElementById(
"conteudo"
);




function carregarPagina(nome){


    conteudo.innerHTML =
    paginas[nome];



    if(nome==="dashboard"){

        renderDashboard();

    }



    if(nome==="financeiro"){

        renderFinanceiro();

    }



    if(nome==="investimentos"){

        renderInvestimentos();

    }



    if(nome==="limites"){

        renderLimites();

    }



    if(nome==="desejos"){

        renderDesejos();

    }


}





carregarPagina(
"dashboard"
);







document.querySelectorAll(".menu")
.forEach(botao=>{


    botao.onclick = ()=>{


        document
        .querySelectorAll(".menu")
        .forEach(item=>{

            item.classList.remove(
                "active"
            );

        });



        botao.classList.add(
            "active"
        );



        document.getElementById(
            "tituloPagina"
        ).innerHTML =
        botao.innerHTML;



        carregarPagina(
            botao.dataset.page
        );



    };


});





//======================================
// FUNÇÕES PLACEHOLDER
// (serão preenchidas nas próximas partes)
//======================================


function renderDashboard(){}

function renderFinanceiro(){}

function renderInvestimentos(){}

function renderLimites(){}

function renderDesejos(){}

//======================================
// PARTE 2/6
// DASHBOARD COMPLETO
//======================================



function totalReceitasMes(){


    return DB.receitas

    .filter(item => pertenceAoMes(item.data))

    .reduce(

        (total,item)=>

        total + Number(item.valor),

        0

    );


}





function totalCustosFixos(){


    return DB.custosFixos

    .reduce(

        (total,item)=>

        total + Number(item.valor),

        0

    );


}





function totalCustosVariaveisMes(){


    return DB.custosVariaveis

    .filter(item => pertenceAoMes(item.data))

    .reduce(

        (total,item)=>

        total + Number(item.valor),

        0

    );


}





function totalDespesasMes(){


    return (

        totalCustosFixos()

        +

        totalCustosVariaveisMes()

    );


}





function totalInvestido(){


    return DB.investimentos

    .reduce(

        (total,item)=>

        total + Number(item.valor),

        0

    );


}







//======================================
// RENDER DASHBOARD
//======================================


function renderDashboard(){


const container =
document.getElementById(
"dashboardContainer"
);



if(!container)return;




const receitas =
totalReceitasMes();



const despesas =
totalDespesasMes();



const saldo =
receitas - despesas;



const investimentos =
totalInvestido();



container.innerHTML = `



<div class="month-selector">


<button id="mesAnterior">

&lt;

</button>



<div class="month-chip">

${nomeMes()} ${anoAtual()}

</div>



<button id="proximoMes">

&gt;

</button>


</div>






<div class="cards">



<div class="card">


<h3>

💰 Receitas

</h3>


<strong>

${moeda(receitas)}

</strong>


</div>





<div class="card">


<h3>

📉 Despesas

</h3>


<strong>

${moeda(despesas)}

</strong>


</div>





<div class="card">


<h3>

📊 Saldo do mês

</h3>


<strong>

${moeda(saldo)}

</strong>


</div>






<div class="card">


<h3>

📈 Investimentos

</h3>


<strong>

${moeda(investimentos)}

</strong>


</div>



</div>








<div class="painel">


<h3>

Alertas Inteligentes

</h3>



<div id="alertasDashboard">

</div>



</div>









<div class="painel">


<h3>

Gastos por Categoria

</h3>



<div class="grafico-area">


<div 
class="donut"
id="graficoDonut">

</div>



<div 
id="legendaCategorias">

</div>


</div>



</div>


`;




gerarAlertas();



renderGraficoCategorias();



document
.getElementById("mesAnterior")
.onclick = ()=>{


    alterarMes(-1);


};



document
.getElementById("proximoMes")
.onclick = ()=>{


    alterarMes(1);


};



}








//======================================
// MÊS
//======================================


function nomeMes(){


const meses=[

"Janeiro",

"Fevereiro",

"Março",

"Abril",

"Maio",

"Junho",

"Julho",

"Agosto",

"Setembro",

"Outubro",

"Novembro",

"Dezembro"

];


return meses[
DB.configuracoes.mesSelecionado
];


}





function alterarMes(valor){


DB.configuracoes.mesSelecionado += valor;



if(DB.configuracoes.mesSelecionado > 11){


    DB.configuracoes.mesSelecionado = 0;

    DB.configuracoes.anoSelecionado++;


}



if(DB.configuracoes.mesSelecionado < 0){


    DB.configuracoes.mesSelecionado = 11;

    DB.configuracoes.anoSelecionado--;


}



salvarDados();


renderDashboard();


}








//======================================
// ALERTAS INTELIGENTES
//======================================


function gerarAlertas(){


const area =
document.getElementById(
"alertasDashboard"
);



if(!area)return;




const receitas =
totalReceitasMes();



const despesas =
totalDespesasMes();



const saldo =
receitas - despesas;



let mensagens=[];




if(saldo < 0){


mensagens.push(
"⚠️ Suas despesas estão maiores que suas receitas."
);


}



if(receitas > 0){


const percentual =
(despesas / receitas)*100;



if(percentual >= 80){


mensagens.push(

`⚠️ Você já comprometeu ${percentual.toFixed(0)}% da renda.`

);


}


else{


mensagens.push(

`✅ Você utilizou ${percentual.toFixed(0)}% da renda.`

);


}


}




if(mensagens.length===0){


mensagens.push(
"✅ Nenhum alerta no momento."
);


}



area.innerHTML =
mensagens
.map(item=>`<p>${item}</p>`)
.join("");



}









//======================================
// GASTOS POR CATEGORIA
//======================================


function gastosPorCategoria(){



const dados={};



DB.custosVariaveis

.filter(item=>pertenceAoMes(item.data))

.forEach(item=>{


const categoria =
item.categoria || "Outros";



dados[categoria] =

(dados[categoria] || 0)

+

Number(item.valor);



});



return dados;


}






function renderGraficoCategorias(){


const legenda =
document.getElementById(
"legendaCategorias"
);



if(!legenda)return;



const dados =
gastosPorCategoria();



let html="";



Object.keys(dados)
.forEach(categoria=>{


html += `


<p>

<span class="categoria-dot"></span>

${categoria}

-

${moeda(dados[categoria])}

</p>


`;


});



if(html===""){


html =
"<p>Nenhum gasto categorizado.</p>";



}



legenda.innerHTML=html;



}

//======================================
// PARTE 3/6
// MEU FINANCEIRO
//======================================



function renderFinanceiro(){


const container =
document.getElementById(
"financeiroContainer"
);



if(!container)return;




container.innerHTML = `



<div class="cards">


<div class="card">

<h3>Receitas</h3>

<strong id="totalFinanceiroReceitas">

${moeda(totalReceitasMes())}

</strong>

</div>



<div class="card">

<h3>Despesas</h3>

<strong id="totalFinanceiroDespesas">

${moeda(totalDespesasMes())}

</strong>

</div>



<div class="card">

<h3>Saldo</h3>

<strong>

${moeda(
totalReceitasMes()
-
totalDespesasMes()
)}

</strong>

</div>


</div>





<section class="painel">


<h3>Receitas</h3>



<button id="btnNovaReceita">

+ Nova Receita

</button>




<div id="formReceitaFinanceiro"
style="display:none;">


<input id="recDescricao"
placeholder="Descrição">


<input id="recValor"
type="number"
placeholder="Valor">


<input id="recData"
type="date">


<input id="recCategoria"
placeholder="Categoria">


<button id="salvarRec">

Salvar

</button>


<button id="cancelarRec">

Cancelar

</button>



</div>





<div id="listaReceitasFinanceiro">

</div>



</section>








<section class="painel">


<h3>Custos Fixos</h3>



<button id="btnNovoFixo">

+ Novo Custo Fixo

</button>



<div id="formFixo"
style="display:none;">


<input id="fixoNome"
placeholder="Nome">


<input id="fixoValor"
type="number"
placeholder="Valor">


<input id="fixoCategoria"
placeholder="Categoria">


<input id="fixoPagamento"
placeholder="Forma pagamento">


<button id="salvarFixo">

Salvar

</button>



<button id="cancelarFixo">

Cancelar

</button>



</div>




<div id="listaFixos">

</div>



</section>








<section class="painel">


<h3>Custos Variáveis</h3>




<button id="btnNovoVariavel">

+ Novo Custo Variável

</button>



<div id="formVariavel"
style="display:none;">


<input id="varNome"
placeholder="Nome">


<input id="varValor"
type="number"
placeholder="Valor">


<input id="varData"
type="date">


<input id="varCategoria"
placeholder="Categoria">


<button id="salvarVariavel">

Salvar

</button>


<button id="cancelarVariavel">

Cancelar

</button>


</div>




<div id="listaVariaveis">

</div>



</section>



`;



renderListaReceitas();

renderListaFixos();

renderListaVariaveis();



}





//======================================
// EVENTOS FINANCEIRO
//======================================



document.addEventListener(
"click",
function(e){





// RECEITAS


if(e.target.id==="btnNovaReceita"){


mostrar(
"formReceitaFinanceiro"
);


}





if(e.target.id==="cancelarRec"){


esconder(
"formReceitaFinanceiro"
);


}




if(e.target.id==="salvarRec"){


salvarReceitaFinanceiro();


}






if(e.target.dataset.delreceita){


deletarReceita(

Number(
e.target.dataset.delreceita

)

);


}






// FIXOS



if(e.target.id==="btnNovoFixo"){


mostrar("formFixo");


}



if(e.target.id==="cancelarFixo"){


esconder("formFixo");


}



if(e.target.id==="salvarFixo"){


salvarFixo();


}



if(e.target.dataset.delfixo){


deletarFixo(

Number(e.target.dataset.delfixo)

);


}







// VARIÁVEIS


if(e.target.id==="btnNovoVariavel"){


mostrar("formVariavel");


}




if(e.target.id==="cancelarVariavel"){


esconder("formVariavel");


}




if(e.target.id==="salvarVariavel"){


salvarVariavel();


}



if(e.target.dataset.delvariavel){


deletarVariavel(

Number(e.target.dataset.delvariavel)

);


}



});






function mostrar(id){

document.getElementById(id)
.style.display="block";

}



function esconder(id){

document.getElementById(id)
.style.display="none";

}








//======================================
// RECEITAS
//======================================


function salvarReceitaFinanceiro(){



DB.receitas.push({


id:gerarId(),


descricao:
recDescricao.value,


valor:
Number(recValor.value),


data:
recData.value,


categoria:
recCategoria.value


});



salvarDados();


renderFinanceiro();


}




function renderListaReceitas(){


const lista =
document.getElementById(
"listaReceitasFinanceiro"
);



if(!lista)return;




lista.innerHTML =
DB.receitas.map(item=>`


<div class="item-card">


<strong>

${item.descricao}

</strong>


<p>

${moeda(item.valor)}

</p>


<p>

${item.categoria || ""}

</p>



<button data-delreceita="${item.id}">

Excluir

</button>


</div>


`).join("");



}





function deletarReceita(id){


DB.receitas =
DB.receitas.filter(
x=>x.id!==id
);


salvarDados();

renderFinanceiro();


}









//======================================
// CUSTOS FIXOS
//======================================



function salvarFixo(){


DB.custosFixos.push({


id:gerarId(),


nome:

fixoNome.value,


valor:

Number(fixoValor.value),


categoria:

fixoCategoria.value,


pagamento:

fixoPagamento.value


});



salvarDados();


renderFinanceiro();



}




function renderListaFixos(){


const lista =
document.getElementById(
"listaFixos"
);



if(!lista)return;




lista.innerHTML =

DB.custosFixos.map(item=>`


<div class="item-card">


<strong>

${item.nome}

</strong>


<p>

${moeda(item.valor)}

</p>


<p>

${item.categoria || ""}

</p>



<button data-delfixo="${item.id}">

Excluir

</button>


</div>



`).join("");



}







function deletarFixo(id){


DB.custosFixos =

DB.custosFixos.filter(
x=>x.id!==id
);



salvarDados();


renderFinanceiro();



}








//======================================
// CUSTOS VARIÁVEIS
//======================================



function salvarVariavel(){



DB.custosVariaveis.push({


id:gerarId(),


nome:

varNome.value,


valor:

Number(varValor.value),


data:

varData.value,


categoria:

varCategoria.value


});



salvarDados();


renderFinanceiro();



}





function renderListaVariaveis(){



const lista =
document.getElementById(
"listaVariaveis"
);



if(!lista)return;




lista.innerHTML =

DB.custosVariaveis.map(item=>`


<div class="item-card">


<strong>

${item.nome}

</strong>


<p>

${moeda(item.valor)}

</p>


<p>

${item.categoria || ""}

</p>


<button data-delvariavel="${item.id}">

Excluir

</button>


</div>


`).join("");



}







function deletarVariavel(id){


DB.custosVariaveis =

DB.custosVariaveis.filter(
x=>x.id!==id
);



salvarDados();


renderFinanceiro();



}
//======================================
// PARTE 4/6
// DÍVIDAS + INVESTIMENTOS
//======================================






//======================================
// DÍVIDAS
//======================================



function renderDividas(){


const container =
document.getElementById(
"financeiroContainer"
);



if(!container)return;



const dividasHTML = `


<section class="painel">


<h3>

Dívidas

</h3>



<button id="btnNovaDivida">

+ Nova Dívida

</button>



<div id="formDivida"
style="display:none;">



<input id="divNome"
placeholder="Nome da dívida">



<input id="divValor"
type="number"
placeholder="Valor total">



<input id="divParcelas"
type="number"
placeholder="Quantidade parcelas">



<input id="divVencimento"
type="date">



<select id="divStatus">

<option value="Pendente">

Pendente

</option>


<option value="Pago">

Pago

</option>


</select>



<button id="salvarDivida">

Salvar

</button>



<button id="cancelarDivida">

Cancelar

</button>



</div>





<div id="listaDividas">

</div>



</section>


`;



container.innerHTML += dividasHTML;



renderListaDividas();



}







function salvarDivida(){



DB.dividas.push({


id:gerarId(),


nome:

divNome.value,


valor:

Number(divValor.value),


parcelas:

Number(divParcelas.value),


vencimento:

divVencimento.value,


status:

divStatus.value


});



salvarDados();



renderFinanceiro();



}





function renderListaDividas(){



const lista =
document.getElementById(
"listaDividas"
);



if(!lista)return;




lista.innerHTML =



DB.dividas.map(item=>`


<div class="item-card">


<strong>

${item.nome}

</strong>


<p>

Valor:
${moeda(item.valor)}

</p>



<p>

Parcelas:
${item.parcelas}

</p>



<p>

Vencimento:
${formatarData(item.vencimento)}

</p>



<p>

Status:
${item.status}

</p>



<button 
data-deldivida="${item.id}">

Excluir

</button>


</div>


`).join("");



}







function deletarDivida(id){


DB.dividas =

DB.dividas.filter(

x=>x.id!==id

);



salvarDados();


renderFinanceiro();


}










//======================================
// INVESTIMENTOS
//======================================




function renderInvestimentos(){



const container =
document.getElementById(
"investimentosContainer"
);



if(!container)return;




container.innerHTML = `



<div class="cards">


<div class="card">


<h3>

Total Investido

</h3>


<strong>

${moeda(totalInvestido())}

</strong>


</div>


</div>






<section class="painel">


<h3>

Aportes

</h3>



<button id="btnNovoInvestimento">

+ Novo Aporte

</button>




<div id="formInvestimento"
style="display:none;">



<input id="invNome"

placeholder="Nome investimento">



<input id="invValor"

type="number"

placeholder="Valor aporte">



<input id="invData"

type="date">



<input id="invTipo"

placeholder="Tipo (CDB, Ação...)">



<button id="salvarInvestimento">

Salvar

</button>



<button id="cancelarInvestimento">

Cancelar

</button>



</div>






<div id="listaInvestimentos">

</div>



</section>


`;



renderListaInvestimentos();


}









function salvarInvestimento(){



DB.investimentos.push({


id:gerarId(),


nome:

invNome.value,


valor:

Number(invValor.value),


data:

invData.value,


tipo:

invTipo.value


});



salvarDados();


renderInvestimentos();


}








function renderListaInvestimentos(){


const lista =
document.getElementById(
"listaInvestimentos"
);



if(!lista)return;



lista.innerHTML =



DB.investimentos.map(item=>`


<div class="item-card">


<strong>

${item.nome}

</strong>


<p>

${moeda(item.valor)}

</p>



<p>

${item.tipo || ""}

</p>



<p>

${formatarData(item.data)}

</p>



<button 
data-delinvestimento="${item.id}">

Excluir

</button>


</div>


`).join("");



}








function deletarInvestimento(id){


DB.investimentos =

DB.investimentos.filter(

x=>x.id!==id

);



salvarDados();


renderInvestimentos();


}









//======================================
// EVENTOS DÍVIDAS E INVESTIMENTOS
//======================================



document.addEventListener(

"click",

function(e){





if(e.target.id==="btnNovaDivida"){


mostrar(
"formDivida"
);


}




if(e.target.id==="cancelarDivida"){


esconder(
"formDivida"
);


}




if(e.target.id==="salvarDivida"){


salvarDivida();


}





if(e.target.dataset.deldivida){


deletarDivida(

Number(e.target.dataset.deldivida)

);


}








if(e.target.id==="btnNovoInvestimento"){


mostrar(
"formInvestimento"
);


}





if(e.target.id==="cancelarInvestimento"){


esconder(
"formInvestimento"
);


}





if(e.target.id==="salvarInvestimento"){


salvarInvestimento();


}





if(e.target.dataset.delinvestimento){


deletarInvestimento(

Number(e.target.dataset.delinvestimento)

);


}



}

);
//======================================
// PARTE 5/6
// LIMITES POR CATEGORIA
//======================================





function renderLimites(){


const container =
document.getElementById(
"limitesContainer"
);



if(!container)return;





container.innerHTML = `



<div class="cards">



<div class="card">

<h3>

Receitas

</h3>

<strong>

${moeda(totalReceitasMes())}

</strong>

</div>





<div class="card">

<h3>

Despesas

</h3>

<strong>

${moeda(totalDespesasMes())}

</strong>

</div>






<div class="card">

<h3>

Dívidas

</h3>

<strong>

${moeda(
totalDividas()
)}

</strong>

</div>






<div class="card">

<h3>

Investimentos

</h3>

<strong>

${moeda(totalInvestido())}

</strong>

</div>



</div>








<section class="painel">


<h3>

Adicionar Limite

</h3>




<select id="categoriaLimite">


${categorias.map(cat=>`

<option value="${cat}">

${cat}

</option>

`).join("")}


</select>





<input 
id="valorLimite"

type="number"

placeholder="Valor limite">





<button id="salvarLimite">


Salvar Limite


</button>




</section>







<section class="painel">


<h3>

Limites por Categoria

</h3>



<div id="listaLimites">


</div>


</section>



`;



renderListaLimites();


}








//======================================
// TOTAL DE DÍVIDAS
//======================================


function totalDividas(){


return DB.dividas.reduce(

(total,item)=>

total + Number(item.valor),

0

);


}









//======================================
// SALVAR LIMITE
//======================================



function salvarLimite(){



const categoria =
categoriaLimite.value;



const valor =
Number(
valorLimite.value
);



if(!valor){


alert(
"Digite um valor válido"
);


return;

}





const existente =
DB.limites.find(

item=>

item.categoria===categoria

);





if(existente){


existente.valor = valor;


}

else{


DB.limites.push({


id:gerarId(),


categoria,


valor


});


}




salvarDados();



renderLimites();



}









//======================================
// GASTOS POR CATEGORIA
//======================================



function gastoCategoria(categoria){


let total=0;



DB.custosVariaveis

.filter(item=>


item.categoria===categoria

)

.forEach(item=>{


total += Number(item.valor);


});






DB.custosFixos

.filter(item=>


item.categoria===categoria

)

.forEach(item=>{


total += Number(item.valor);


});




return total;



}









//======================================
// LISTA DE LIMITES
//======================================



function renderListaLimites(){



const lista =
document.getElementById(
"listaLimites"
);



if(!lista)return;





if(DB.limites.length===0){


lista.innerHTML =

"<p>Nenhum limite cadastrado.</p>";

return;


}






lista.innerHTML =



DB.limites.map(item=>{



const gasto =

gastoCategoria(
item.categoria
);



const percentual =

(gasto / item.valor) * 100;



let status="normal";



if(percentual>=100){

status="excedido";

}

else if(percentual>=80){

status="atencao";

}





return `



<div class="limite-card">



<h4>

${item.categoria}

</h4>



<p>

Usado:

${moeda(gasto)}

/

${moeda(item.valor)}

</p>






<div class="barra">


<div 

class="progresso ${status}"

style="width:${Math.min(percentual,100)}%">

</div>


</div>






<p>

${percentual.toFixed(0)}% utilizado

</p>





${
percentual>100

?

`<strong>

⚠️ Limite excedido em 
${moeda(gasto-item.valor)}

</strong>`

:

""

}





<button

data-dellimite="${item.id}">


Excluir


</button>



</div>



`;



}).join("");



}









//======================================
// EXCLUIR LIMITE
//======================================


function deletarLimite(id){



DB.limites =

DB.limites.filter(

x=>x.id!==id

);



salvarDados();



renderLimites();



}










//======================================
// EVENTOS LIMITES
//======================================



document.addEventListener(

"click",

function(e){



if(e.target.id==="salvarLimite"){


salvarLimite();


}



if(e.target.dataset.dellimite){


deletarLimite(

Number(e.target.dataset.dellimite)

);


}



}

);

//======================================
// PARTE 6/6
// DESEJOS + FINALIZAÇÃO
//======================================






function renderDesejos(){



const container =
document.getElementById(
"desejosContainer"
);



if(!container)return;






const totalDesejos =

DB.desejos.reduce(

(total,item)=>

total + Number(item.valor),

0

);





const guardado =

DB.desejos.reduce(

(total,item)=>

total + Number(item.guardado || 0),

0

);






container.innerHTML = `





<div class="cards">



<div class="card">

<h3>

Total de Desejos

</h3>


<strong>

${moeda(totalDesejos)}

</strong>


</div>





<div class="card">

<h3>

Já Guardado

</h3>


<strong>

${moeda(guardado)}

</strong>


</div>





<div class="card">

<h3>

Falta Guardar

</h3>


<strong>

${moeda(totalDesejos-guardado)}

</strong>


</div>



</div>








<section class="painel">


<h3>

Adicionar Desejo

</h3>





<input 
id="desejoTitulo"

placeholder="Nome do desejo">





<input 
id="desejoCategoria"

placeholder="Categoria">





<input 
id="desejoValor"

type="number"

placeholder="Valor da meta">





<input 
id="desejoImagem"

placeholder="URL da imagem">






<button id="salvarDesejo">


Salvar Desejo


</button>



</section>







<section class="painel">


<h3>

Minhas Metas

</h3>




<div id="listaDesejos">


</div>



</section>





`;





renderListaDesejos();



analisarViabilidade();



}








//======================================
// SALVAR DESEJO
//======================================



function salvarDesejo(){



DB.desejos.push({


id:gerarId(),


titulo:

desejoTitulo.value,


categoria:

desejoCategoria.value,


valor:

Number(desejoValor.value),


imagem:

desejoImagem.value,


guardado:0,


dataInicio:

new Date()



});





salvarDados();



renderDesejos();



}









//======================================
// LISTA DESEJOS
//======================================



function renderListaDesejos(){



const lista =
document.getElementById(
"listaDesejos"
);



if(!lista)return;





if(DB.desejos.length===0){


lista.innerHTML =

"<p>Nenhum desejo cadastrado.</p>";

return;


}








lista.innerHTML =



DB.desejos.map(item=>{



const percentual =

(item.guardado / item.valor)*100;



const falta =

item.valor - item.guardado;




const meses =

calcularMeses(
falta
);







return `



<div class="desejo-card">



${

item.imagem

?

`<img src="${item.imagem}" width="120">`

:

""

}





<h3>

${item.titulo}

</h3>




<p>

Categoria:

${item.categoria || "-"}

</p>




<p>

Meta:

${moeda(item.valor)}

</p>





<div class="barra">


<div

class="progresso"

style="width:${Math.min(percentual,100)}%">

</div>


</div>





<p>

${percentual.toFixed(0)}% concluído

</p>




<p>

Guardado:

${moeda(item.guardado)}

</p>




<p>

Falta:

${moeda(falta)}

</p>




<p>

Estimativa:

${meses}

meses

</p>






<input

id="aporte${item.id}"

type="number"

placeholder="Valor para guardar">





<button

data-guardar="${item.id}">


Guardar


</button>






<button

data-deldesejo="${item.id}">


Excluir


</button>



</div>



`;



}).join("");



}









//======================================
// GUARDAR APORTE
//======================================



function guardarDesejo(id){



const campo =

document.getElementById(

"aporte"+id

);



const valor =

Number(campo.value);



if(!valor)return;




const desejo =

DB.desejos.find(

x=>x.id===id

);





desejo.guardado += valor;



salvarDados();



renderDesejos();



}








//======================================
// CALCULAR MESES
//======================================



function calcularMeses(valor){



const capacidade =

totalReceitasMes()

-

totalDespesasMes();



if(capacidade<=0){

return "Indefinido";

}



return Math.ceil(

valor / capacidade

);



}









//======================================
// VIABILIDADE
//======================================



function analisarViabilidade(){



const area =

document.getElementById(
"alertaDesejos"
);



if(!area)return;



}









//======================================
// EXCLUIR DESEJO
//======================================



function deletarDesejo(id){


DB.desejos =

DB.desejos.filter(

x=>x.id!==id

);



salvarDados();


renderDesejos();



}









//======================================
// EVENTOS DESEJOS
//======================================



document.addEventListener(

"click",

function(e){



if(e.target.id==="salvarDesejo"){


salvarDesejo();


}



if(e.target.dataset.guardar){


guardarDesejo(

Number(
e.target.dataset.guardar

)

);


}



if(e.target.dataset.deldesejo){


deletarDesejo(

Number(
e.target.dataset.deldesejo

)

);


}



}

);









//======================================
// ATUALIZAÇÃO FINAL
//======================================


function atualizarTudo(){


salvarDados();


renderDashboard();


}



atualizarTudo();
