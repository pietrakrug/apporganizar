/* =====================================
AUREA - GLOBAL CSS
PARTE 1/3
===================================== */


*{

margin:0;
padding:0;
box-sizing:border-box;
font-family:'Inter',sans-serif;

}



:root{

--primary:#2563eb;

--primary-dark:#1d4ed8;

--background:#f8fafc;

--card:#ffffff;

--text:#1e293b;

--muted:#64748b;

--border:#e2e8f0;

--success:#16a34a;

--danger:#dc2626;

--gold:#c9a227;

}





body{

background:var(--background);

color:var(--text);

min-height:100vh;

}





/* ==========================
APP
========================== */


.app{

display:flex;

min-height:100vh;

}







/* ==========================
SIDEBAR
========================== */


.sidebar{

width:270px;

background:#111827;

padding:30px 22px;

display:flex;

flex-direction:column;

color:white;

position:fixed;

height:100vh;

}





.logo{

margin-bottom:45px;

}



.logo h2{

font-size:28px;

font-weight:700;

letter-spacing:-1px;

}



.logo p{

font-size:13px;

color:#94a3b8;

margin-top:8px;

}





.sidebar nav{

display:flex;

flex-direction:column;

gap:10px;

}





.menu{

border:none;

background:transparent;

color:#cbd5e1;

padding:15px 18px;

border-radius:14px;

cursor:pointer;

font-size:15px;

display:flex;

align-items:center;

gap:12px;

transition:.25s;

text-align:left;

}





.menu span{

font-size:20px;

}



.menu:hover{

background:#1f2937;

color:white;

}





.menu.active{

background:#2563eb;

color:white;

}





.sidebar-footer{

margin-top:auto;

background:#1f2937;

padding:18px;

border-radius:18px;

}



.sidebar-footer p{

font-size:12px;

color:#94a3b8;

}



.sidebar-footer strong{

font-size:18px;

}







/* ==========================
MAIN
========================== */


.main{

margin-left:270px;

padding:35px;

width:calc(100% - 270px);

}





.topbar{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:35px;

}



.topbar h1{

font-size:34px;

letter-spacing:-1px;

}



#subtituloPagina{

color:var(--muted);

margin-top:6px;

}





.header-actions{

display:flex;

align-items:center;

gap:15px;

}



select{

border:1px solid var(--border);

background:white;

padding:12px 18px;

border-radius:14px;

font-size:14px;

cursor:pointer;

}





.notification{

border:none;

background:white;

width:45px;

height:45px;

border-radius:50%;

cursor:pointer;

font-size:20px;

box-shadow:0 5px 15px rgba(0,0,0,.08);

}

/* =====================================
AUREA - GLOBAL CSS
PARTE 2/3
===================================== */



/* ==========================
CARDS
========================== */


.cards{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(220px,1fr));

gap:22px;

margin-bottom:30px;

}




.card{

background:var(--card);

border-radius:22px;

padding:25px;

box-shadow:

0 10px 30px rgba(15,23,42,.06);

border:1px solid rgba(226,232,240,.7);

transition:.25s;

}



.card:hover{

transform:translateY(-4px);

box-shadow:

0 15px 35px rgba(15,23,42,.10);

}



.card h3{

font-size:14px;

font-weight:500;

color:var(--muted);

margin-bottom:15px;

}



.card p{

font-size:30px;

font-weight:700;

letter-spacing:-1px;

}





/* destaque */

.card:first-child p{

color:var(--success);

}





/* ==========================
PAINÉIS
========================== */


.painel{

background:white;

border-radius:22px;

padding:28px;

margin-bottom:25px;

box-shadow:

0 10px 30px rgba(15,23,42,.05);

border:1px solid var(--border);

}



.painel h3{

font-size:18px;

margin-bottom:20px;

}







/* ==========================
ITENS / LISTAS
========================== */


.item{

display:flex;

justify-content:space-between;

align-items:center;

padding:16px 0;

border-bottom:1px solid var(--border);

}



.item:last-child{

border-bottom:none;

}



.item strong{

font-size:15px;

}



.item span{

font-weight:600;

color:var(--primary);

}





/* ==========================
INPUTS
========================== */


input,
textarea,
select{

width:100%;

padding:14px 16px;

border-radius:14px;

border:1px solid var(--border);

background:white;

font-size:14px;

margin-bottom:14px;

outline:none;

transition:.2s;

}



input:focus,
textarea:focus,
select:focus{

border-color:var(--primary);

box-shadow:

0 0 0 3px rgba(37,99,235,.12);

}





/* ==========================
BOTÕES
========================== */


button{

font-family:inherit;

}



#salvarMovimento,
#salvarInvestimento,
#salvarLimite,
#salvarDesejo{


background:var(--primary);

color:white;

border:none;

padding:14px 22px;

border-radius:14px;

cursor:pointer;

font-weight:600;

transition:.2s;

}




#salvarMovimento:hover,
#salvarInvestimento:hover,
#salvarLimite:hover,
#salvarDesejo:hover{

background:var(--primary-dark);

transform:translateY(-2px);

}






/* ==========================
DONUT
========================== */


.donut{

width:230px;

height:230px;

border-radius:50%;

margin:30px auto;

background:

conic-gradient(

#2563eb 0deg,

#22c55e 100deg,

#f59e0b 200deg,

#ef4444 300deg,

#2563eb 360deg

);


display:flex;

align-items:center;

justify-content:center;

position:relative;

}



.donut::after{

content:"";

width:130px;

height:130px;

background:white;

border-radius:50%;

position:absolute;

}





/* ==========================
BARRAS DE PROGRESSO
========================== */


.progress{

height:12px;

background:#e5e7eb;

border-radius:20px;

overflow:hidden;

margin-top:10px;

}



.progress span{

display:block;

height:100%;

background:var(--primary);

border-radius:20px;

}





/* ==========================
TAGS
========================== */


.tag{

display:inline-block;

padding:6px 12px;

border-radius:20px;

font-size:12px;

font-weight:600;

background:#dbeafe;

color:#1d4ed8;

}


/* =====================================
AUREA - GLOBAL CSS
PARTE 3/3
===================================== */



/* ==========================
ANIMAÇÕES
========================== */


@keyframes aparecer{

from{

opacity:0;

transform:translateY(15px);

}


to{

opacity:1;

transform:translateY(0);

}

}



.containerTela{

animation:aparecer .35s ease;

}







/* ==========================
TABELAS / HISTÓRICOS
========================== */


table{

width:100%;

border-collapse:collapse;

background:white;

border-radius:18px;

overflow:hidden;

}



th{

text-align:left;

background:#f8fafc;

padding:16px;

font-size:13px;

color:var(--muted);

}



td{

padding:16px;

border-bottom:1px solid var(--border);

font-size:14px;

}



tr:last-child td{

border-bottom:none;

}







/* ==========================
ALERTAS
========================== */


#alertas p{

padding:14px;

border-radius:14px;

background:#f8fafc;

margin-bottom:10px;

font-size:14px;

}







/* ==========================
CATEGORIAS
========================== */


#categoriasGrafico p{

display:flex;

justify-content:space-between;

padding:12px 0;

border-bottom:1px solid var(--border);

color:var(--muted);

}







/* ==========================
SCROLL
========================== */


::-webkit-scrollbar{

width:8px;

}


::-webkit-scrollbar-track{

background:#f1f5f9;

}


::-webkit-scrollbar-thumb{

background:#cbd5e1;

border-radius:20px;

}







/* ==========================
MOBILE
========================== */


@media(max-width:900px){



.app{

display:block;

}



.sidebar{

position:relative;

width:100%;

height:auto;

}



.sidebar nav{

flex-direction:row;

overflow-x:auto;

}



.menu{

min-width:150px;

}



.sidebar-footer{

display:none;

}



.main{

margin-left:0;

width:100%;

padding:20px;

}



.topbar{

flex-direction:column;

align-items:flex-start;

gap:20px;

}



.topbar h1{

font-size:28px;

}



.header-actions{

width:100%;

}



.cards{

grid-template-columns:1fr;

}



.card p{

font-size:26px;

}



.donut{

width:190px;

height:190px;

}



}







/* ==========================
PEQUENOS AJUSTES PREMIUM
========================== */


strong{

font-weight:700;

}



h1,h2,h3{

letter-spacing:-.5px;

}



button{

cursor:pointer;

}



button:active{

transform:scale(.97);

}
/* =====================================
AUREA - AJUSTES FINAIS CSS
CORREÇÕES
===================================== */


/* Corrige containers criados pelo JavaScript */

.containerTela{

width:100%;

}



/* Remove regra que deixava qualquer primeiro card verde */

.card:first-child p{

color:var(--text);

}



/* Classes financeiras */

.receita{

color:#16a34a;

}



.despesa{

color:#dc2626;

}



.saldo{

color:#2563eb;

}



.investimento{

color:#c9a227;

}





/* Botões gerais premium */

button{

border:none;

transition:.25s;

}



button:hover{

transform:translateY(-2px);

}





/* Melhor organização dos formulários */

.painel input,
.painel select{

max-width:500px;

}



.painel button{

margin-top:5px;

}




/* Espaçamento entre telas */

#conteudo{

width:100%;

}



/* Ajuste visual dos valores */

.valor{

font-size:30px;

font-weight:700;

letter-spacing:-1px;

}



/* Estado vazio */

.vazio{

padding:25px;

text-align:center;

color:var(--muted);

font-size:14px;

}
