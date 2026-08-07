//======================================
// AUREA
// Inteligência Financeira Pessoal
// MAIN.JS
// PARTE 1/5 - BASE DO SISTEMA
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

        mes: new Date().getMonth(),

        ano: new Date().getFullYear()

    }

};




//======================================
// LOCAL STORAGE
//======================================


function carregarDados(){


    const dados = localStorage.getItem("aureaDB");


    if(dados){

        try{

            const salvo = JSON.parse(dados);

            Object.assign(DB,salvo);


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

        "aureaDB",

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

    Math.floor(
        Math.random()*1000
    );


}





function mesAtual(){


    return DB.configuracoes.mes;


}





function anoAtual(){


    return DB.configuracoes.ano;


}





function pertenceMes(data){


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





function nomeMes(){


    const meses = [

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


    return meses[mesAtual()];


}






//======================================
// CATEGORIAS
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
// ESTRUTURA DAS PÁGINAS
//======================================



const paginas = {


dashboard: `

<div id="dashboardContainer"></div>

`,



financeiro: `

<div id="financeiroContainer"></div>

`,



investimentos: `

<div id="investimentosContainer"></div>

`,



limites: `

<div id="limitesContainer"></div>

`,



desejos: `

<div id="desejosContainer"></div>

`


};






//======================================
// NAVEGAÇÃO
//======================================



const conteudo =

document.getElementById(
    "conteudo"
);





function abrirPagina(nome){



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






document

.querySelectorAll(".menu")

.forEach(botao=>{



    botao.onclick = function(){



        document

        .querySelectorAll(".menu")

        .forEach(item=>{

            item.classList.remove(
                "active"
            );

        });




        this.classList.add(
            "active"
        );





        document.getElementById(

            "tituloPagina"

        ).innerHTML =

        this.innerText;




        abrirPagina(

            this.dataset.page

        );



    }


});






//======================================
// BOTÕES GLOBAIS
//======================================


document.addEventListener(

"click",

function(e){


    if(e.target.id==="mesAnterior"){

        alterarMes(-1);

    }



    if(e.target.id==="proximoMes"){

        alterarMes(1);

    }


});






//======================================
// INICIALIZAÇÃO
//======================================



abrirPagina("dashboard");
//======================================
// AUREA
// PARTE 2/5
// DASHBOARD
//======================================



//======================================
// CÁLCULOS DO DASHBOARD
//======================================



function totalReceitasMes(){


    return DB.receitas

    .filter(item=>pertenceMes(item.data))

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

    .filter(item=>pertenceMes(item.data))

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



<div class="dashboard-header">


<div>

<h2>

Olá 👋

</h2>


<p>

${nomeMes()} de ${anoAtual()}

</p>


</div>



<div>


<button id="mesAnterior">

←

</button>



<button id="proximoMes">

→

</button>


</div>



</div>








<div class="cards">



<div class="card">


<h3>

Receitas

</h3>


<p>

${moeda(receitas)}

</p>


</div>





<div class="card">


<h3>

Despesas

</h3>


<p>

${moeda(despesas)}

</p>


</div>





<div class="card">


<h3>

Saldo do mês

</h3>


<p>

${moeda(saldo)}

</p>


</div>





<div class="card">


<h3>

Investimentos

</h3>


<p>

${moeda(investimentos)}

</p>


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


<div class="donut">


</div>



<div id="legendaCategorias">


</div>



</div>



</div>



`;





gerarAlertas();



gerarCategorias();





}









//======================================
// TROCA DE MÊS
//======================================



function alterarMes(valor){



DB.configuracoes.mes += valor;





if(DB.configuracoes.mes > 11){


    DB.configuracoes.mes = 0;


    DB.configuracoes.ano++;


}





if(DB.configuracoes.mes < 0){


    DB.configuracoes.mes = 11;


    DB.configuracoes.ano--;


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





const receita =

totalReceitasMes();





const despesa =

totalDespesasMes();





let mensagens = [];





if(receita === 0){


mensagens.push(

"💡 Cadastre suas receitas para acompanhar sua evolução."

);


}





else{


const percentual =

(despesa / receita) * 100;





if(percentual >= 100){


mensagens.push(

"⚠️ Seus gastos ultrapassaram sua receita."

);


}





else if(percentual >= 80){


mensagens.push(

`⚠️ Você já comprometeu ${percentual.toFixed(0)}% da sua renda.`

);


}





else{


mensagens.push(

`✅ Você comprometeu ${percentual.toFixed(0)}% da sua renda.`

);


}


}






area.innerHTML =

mensagens

.map(msg=>

`<p>${msg}</p>`

)

.join("");



}










//======================================
// GASTOS POR CATEGORIA
//======================================



function gerarCategorias(){



const area =

document.getElementById(

"legendaCategorias"

);



if(!area)return;





let dados = {};





DB.custosVariaveis

.filter(item=>pertenceMes(item.data))

.forEach(item=>{


const categoria =

item.categoria || "Outros";



dados[categoria] =

(dados[categoria] || 0)

+

Number(item.valor);


});







if(Object.keys(dados).length===0){


area.innerHTML =

"<p>Nenhum gasto cadastrado.</p>";


return;


}






area.innerHTML =



Object.entries(dados)

.map(item=>{



return `


<p>

<strong>

${item[0]}

</strong>

<br>

${moeda(item[1])}


</p>


`;



})

.join("");



}
//======================================
// AUREA
// PARTE 3/5
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

<h3>

Receita Mensal

</h3>

<p>

${moeda(totalReceitasMes())}

</p>

</div>





<div class="card">

<h3>

Custo Mensal

</h3>


<p>

${moeda(totalDespesasMes())}

</p>

</div>





<div class="card">

<h3>

Total Dívidas

</h3>


<p>

${moeda(totalDividas())}

</p>

</div>





<div class="card">

<h3>

Total Investido

</h3>


<p>

${moeda(totalInvestido())}

</p>

</div>



</div>








<div class="painel">



<h3>

Receitas

</h3>




<button id="novaReceita">

+ Nova Receita

</button>





<div id="formReceita" style="display:none">


<input 
id="recDescricao"
placeholder="Descrição">


<input 
id="recValor"
type="number"
placeholder="Valor">



<input 
id="recData"
type="date">



<input 
id="recCategoria"
placeholder="Categoria">



<button id="salvarReceita">

Salvar

</button>



<button id="cancelarReceita">

Cancelar

</button>



</div>




<div id="listaReceitas">


</div>



</div>









<div class="painel">


<h3>

Custos Fixos

</h3>



<button id="novoFixo">

+ Novo Custo Fixo

</button>






<div id="formFixo" style="display:none">


<input 
id="fixoNome"
placeholder="Nome">


<input 
id="fixoValor"
type="number"
placeholder="Valor">



<input 
id="fixoCategoria"
placeholder="Categoria">



<input 
id="fixoPagamento"
placeholder="Forma pagamento">



<button id="salvarFixo">

Salvar

</button>



</div>






<div id="listaFixos">


</div>



</div>









<div class="painel">


<h3>

Custos Variáveis

</h3>




<button id="novoVariavel">

+ Novo Custo Variável

</button>






<div id="formVariavel" style="display:none">


<input 
id="varNome"
placeholder="Nome">



<input 
id="varValor"
type="number"
placeholder="Valor">



<input 
id="varData"
type="date">



<input 
id="varCategoria"
placeholder="Categoria">



<button id="salvarVariavel">

Salvar

</button>



</div>






<div id="listaVariaveis">


</div>



</div>



`;




renderReceitas();

renderFixos();

renderVariaveis();



}









//======================================
// RECEITAS
//======================================



function salvarReceita(){



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





function renderReceitas(){



const lista =

document.getElementById(

"listaReceitas"

);



if(!lista)return;




if(DB.receitas.length===0){


lista.innerHTML =

"<p>Nenhuma receita cadastrada.</p>";


return;


}






lista.innerHTML =



DB.receitas.map(item=>`



<div class="item">


<strong>

${item.descricao}

</strong>


<p>

${moeda(item.valor)}

</p>


<button 
data-delete-receita="${item.id}">

Excluir

</button>


</div>



`).join("");



}









function excluirReceita(id){



DB.receitas =

DB.receitas.filter(

item=>

item.id!==id

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





function renderFixos(){



const lista =

document.getElementById(

"listaFixos"

);



if(!lista)return;





lista.innerHTML =



DB.custosFixos.map(item=>`



<div class="item">


<strong>

${item.nome}

</strong>



<p>

${moeda(item.valor)}

</p>



<button

data-delete-fixo="${item.id}">

Excluir

</button>



</div>



`).join("");



}









function excluirFixo(id){



DB.custosFixos =

DB.custosFixos.filter(

item=>

item.id!==id

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








function renderVariaveis(){



const lista =

document.getElementById(

"listaVariaveis"

);



if(!lista)return;





lista.innerHTML =



DB.custosVariaveis.map(item=>`



<div class="item">


<strong>

${item.nome}

</strong>



<p>

${moeda(item.valor)}

</p>



<button

data-delete-variavel="${item.id}">

Excluir

</button>



</div>



`).join("");



}









function excluirVariavel(id){



DB.custosVariaveis =

DB.custosVariaveis.filter(

item=>

item.id!==id

);



salvarDados();



renderFinanceiro();



}









//======================================
// EVENTOS FINANCEIRO
//======================================



document.addEventListener(

"click",

function(e){



if(e.target.id==="novaReceita"){


formReceita.style.display="block";


}





if(e.target.id==="cancelarReceita"){


formReceita.style.display="none";


}





if(e.target.id==="salvarReceita"){


salvarReceita();


}





if(e.target.dataset.deleteReceita){


excluirReceita(

Number(e.target.dataset.deleteReceita)

);


}






if(e.target.id==="novoFixo"){


formFixo.style.display="block";


}





if(e.target.id==="salvarFixo"){


salvarFixo();


}





if(e.target.dataset.deleteFixo){


excluirFixo(

Number(e.target.dataset.deleteFixo)

);


}







if(e.target.id==="novoVariavel"){


formVariavel.style.display="block";


}





if(e.target.id==="salvarVariavel"){


salvarVariavel();


}





if(e.target.dataset.deleteVariavel){


excluirVariavel(

Number(e.target.dataset.deleteVariavel)

);


}



});


//======================================
// AUREA
// PARTE 4/5
// INVESTIMENTOS + DÍVIDAS
//======================================






//======================================
// TOTAL DÍVIDAS
//======================================


function totalDividas(){


return DB.dividas

.reduce(

(total,item)=>

total + Number(item.valor),

0

);


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


<p>

${moeda(totalInvestido())}

</p>


</div>


</div>








<div class="painel">


<h3>

Adicionar Investimento

</h3>




<input 
id="invNome"

placeholder="Nome do investimento">





<input 
id="invValor"

type="number"

placeholder="Valor aportado">





<input 
id="invData"

type="date">





<input 
id="invTipo"

placeholder="Tipo (CDB, Ação, Fundo...)">






<button id="salvarInvestimento">

Salvar

</button>






</div>







<div class="painel">


<h3>

Meus Investimentos

</h3>


<div id="listaInvestimentos">

</div>


</div>



`;



renderListaInvestimentos();



}









function salvarInvestimento(){



DB.investimentos.push({



id:

gerarId(),



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





if(DB.investimentos.length===0){


lista.innerHTML =

"<p>Nenhum investimento cadastrado.</p>";


return;


}






lista.innerHTML =



DB.investimentos.map(item=>`



<div class="item">


<strong>

${item.nome}

</strong>



<p>

${moeda(item.valor)}

</p>




<p>

${item.tipo || ""}

</p>



<button

data-delete-investimento="${item.id}">

Excluir

</button>



</div>



`).join("");



}








function excluirInvestimento(id){



DB.investimentos =

DB.investimentos.filter(

item=>

item.id!==id

);



salvarDados();



renderInvestimentos();



}









//======================================
// DÍVIDAS
//======================================



function renderDividas(){



const area =

document.getElementById(

"dividasContainer"

);



if(!area)return;




area.innerHTML = `



<div class="painel">


<h3>

Adicionar Dívida

</h3>




<input 
id="divNome"

placeholder="Nome da dívida">





<input 
id="divValor"

type="number"

placeholder="Valor total">





<input 
id="divParcelas"

type="number"

placeholder="Número de parcelas">





<input 
id="divVencimento"

type="date">






<button id="salvarDivida">

Salvar

</button>


</div>






<div id="listaDividas">


</div>



`;



renderListaDividas();



}









function salvarDivida(){



DB.dividas.push({



id:

gerarId(),



nome:

divNome.value,



valor:

Number(divValor.value),



parcelas:

Number(divParcelas.value),



vencimento:

divVencimento.value,



status:

"pendente"



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






if(DB.dividas.length===0){


lista.innerHTML=

"<p>Nenhuma dívida cadastrada.</p>";

return;


}







lista.innerHTML =



DB.dividas.map(item=>`



<div class="item">


<strong>

${item.nome}

</strong>



<p>

${moeda(item.valor)}

</p>



<p>

Parcelas: ${item.parcelas}

</p>



<button

data-delete-divida="${item.id}">

Excluir

</button>



</div>



`).join("");



}









function excluirDivida(id){



DB.dividas =

DB.dividas.filter(

item=>

item.id!==id

);



salvarDados();



renderFinanceiro();



}









//======================================
// EVENTOS INVESTIMENTOS E DÍVIDAS
//======================================



document.addEventListener(

"click",

function(e){





if(e.target.id==="salvarInvestimento"){


salvarInvestimento();


}






if(e.target.dataset.deleteInvestimento){


excluirInvestimento(

Number(e.target.dataset.deleteInvestimento)

);


}







if(e.target.id==="salvarDivida"){


salvarDivida();


}







if(e.target.dataset.deleteDivida){


excluirDivida(

Number(e.target.dataset.deleteDivida)

);


}





});

//======================================
// AUREA
// PARTE 5/5
// LIMITES + DESEJOS + FINALIZAÇÃO
//======================================






//======================================
// LIMITES
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


<p>

${moeda(totalReceitasMes())}

</p>

</div>




<div class="card">

<h3>

Despesas

</h3>


<p>

${moeda(totalDespesasMes())}

</p>

</div>




<div class="card">

<h3>

Dívidas

</h3>


<p>

${moeda(totalDividas())}

</p>

</div>



</div>







<div class="painel">


<h3>

Adicionar Limite

</h3>




<select id="categoriaLimite">


${categorias.map(cat=>`

<option>

${cat}

</option>

`).join("")}


</select>





<input

id="valorLimite"

type="number"

placeholder="Valor máximo">





<button id="salvarLimite">

Salvar Limite

</button>


</div>








<div class="painel">


<h3>

Meus Limites

</h3>


<div id="listaLimites">


</div>



</div>



`;




renderListaLimites();



}








function salvarLimite(){



const categoria =

categoriaLimite.value;




const valor =

Number(valorLimite.value);




if(!valor)return;





const existente =

DB.limites.find(

item=>

item.categoria===categoria

);






if(existente){


existente.valor = valor;


}else{


DB.limites.push({


id:

gerarId(),


categoria,


valor



});


}




salvarDados();



renderLimites();



}









function gastoCategoria(categoria){



let total = 0;





DB.custosFixos

.filter(item=>

item.categoria===categoria

)

.forEach(item=>{


total += Number(item.valor);


});





DB.custosVariaveis

.filter(item=>

item.categoria===categoria

)

.forEach(item=>{


total += Number(item.valor);


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


lista.innerHTML =

"<p>Nenhum limite criado.</p>";


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





let status="";





if(percentual>=100){

status="🔴 Excedido";

}

else if(percentual>=80){

status="🟡 Atenção";

}

else{

status="🟢 Seguro";

}





return `



<div class="item">


<strong>

${item.categoria}

</strong>



<p>

${moeda(gasto)}

de

${moeda(item.valor)}

</p>



<p>

${status}

-

${percentual.toFixed(0)}%

</p>



<button

data-delete-limite="${item.id}">

Excluir

</button>



</div>



`;



}).join("");



}









function excluirLimite(id){



DB.limites =

DB.limites.filter(

item=>

item.id!==id

);



salvarDados();



renderLimites();



}









//======================================
// DESEJOS / METAS
//======================================



function renderDesejos(){



const container =

document.getElementById(

"desejosContainer"

);



if(!container)return;






const total =

DB.desejos.reduce(

(t,item)=>

t+Number(item.valor),

0

);





const guardado =

DB.desejos.reduce(

(t,item)=>

t+Number(item.guardado || 0),

0

);








container.innerHTML = `



<div class="cards">


<div class="card">

<h3>

Total dos desejos

</h3>


<p>

${moeda(total)}

</p>


</div>




<div class="card">


<h3>

Já guardado

</h3>


<p>

${moeda(guardado)}

</p>


</div>



</div>







<div class="painel">


<h3>

Novo desejo

</h3>





<input

id="desejoNome"

placeholder="Ex: Viagem, carro, curso">






<input

id="desejoValor"

type="number"

placeholder="Valor da meta">






<button id="salvarDesejo">

Salvar

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





renderListaDesejos();



}









function salvarDesejo(){



DB.desejos.push({


id:

gerarId(),


nome:

desejoNome.value,


valor:

Number(desejoValor.value),


guardado:

0



});



salvarDados();



renderDesejos();



}








function renderListaDesejos(){



const lista =

document.getElementById(

"listaDesejos"

);



if(!lista)return;






if(DB.desejos.length===0){


lista.innerHTML=

"<p>Nenhum desejo cadastrado.</p>";

return;


}





lista.innerHTML =



DB.desejos.map(item=>{



const percentual =

(item.guardado/item.valor)*100;





return `



<div class="item">


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




<p>

${percentual.toFixed(0)}%

concluído

</p>





<input

id="aporte${item.id}"

type="number"

placeholder="Valor">





<button

data-aporte="${item.id}">

Guardar

</button>





<button

data-delete-desejo="${item.id}">

Excluir

</button>



</div>



`;



}).join("");



}









function guardarDesejo(id){



const campo =

document.getElementById(

"aporte"+id

);





const valor =

Number(campo.value);





const desejo =

DB.desejos.find(

item=>

item.id===id

);





if(!desejo || !valor)return;





desejo.guardado += valor;



salvarDados();



renderDesejos();



}








function excluirDesejo(id){



DB.desejos =

DB.desejos.filter(

item=>

item.id!==id

);



salvarDados();



renderDesejos();



}









//======================================
// EVENTOS FINAIS
//======================================



document.addEventListener(

"click",

function(e){



if(e.target.id==="salvarLimite"){


salvarLimite();


}





if(e.target.dataset.deleteLimite){


excluirLimite(

Number(e.target.dataset.deleteLimite)

);


}





if(e.target.id==="salvarDesejo"){


salvarDesejo();


}





if(e.target.dataset.aporte){


guardarDesejo(

Number(e.target.dataset.aporte)

);


}





if(e.target.dataset.deleteDesejo){


excluirDesejo(

Number(e.target.dataset.deleteDesejo)

);


}



});







//======================================
// FINALIZAÇÃO
//======================================



console.log(

"AUREA carregado com sucesso."

);
