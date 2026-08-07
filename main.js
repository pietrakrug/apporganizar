const paginas = {

dashboard: `
<h2>Dashboard</h2>

<div class="cards">

<div class="card">
<h3>Receitas</h3>
<p id="receitas">R$ 0,00</p>
</div>

<div class="card">
<h3>Despesas</h3>
<p id="despesas">R$ 0,00</p>
</div>

<div class="card">
<h3>Saldo</h3>
<p id="saldo">R$ 0,00</p>
</div>

<div class="card">
<h3>Investimentos</h3>
<p id="investimentos">R$ 0,00</p>
</div>

</div>

<div class="painel">

<h3>Alertas Inteligentes</h3>

<p>Nenhum alerta.</p>

</div>

<div class="grafico">

<h3>Gastos por Categoria</h3>

<div class="donut"></div>

</div>
`,

financeiro:`

<h2>Meu Financeiro</h2>

<p>Em breve...</p>

`,

investimentos:`

<h2>Investimentos</h2>

<p>Em breve...</p>

`,

limites:`

<h2>Limites</h2>

<p>Em breve...</p>

`,

desejos:`

<h2>Desejos</h2>

<p>Em breve...</p>

`

}

const conteudo = document.getElementById("conteudo");

conteudo.innerHTML = paginas.dashboard;

document.querySelectorAll(".menu").forEach(botao=>{

botao.onclick=()=>{

document.querySelectorAll(".menu")
.forEach(x=>x.classList.remove("active"));

botao.classList.add("active");

document.getElementById("tituloPagina").innerHTML=botao.innerHTML;

conteudo.innerHTML=paginas[botao.dataset.page];

}

});
