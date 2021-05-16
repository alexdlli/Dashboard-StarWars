preencherTabelaFilmes();

const personagensContador = document.getElementById("personagens");
const veiculosContador = document.getElementById("vehicles");
const planetasContador = document.getElementById("planetas");
const navesContador = document.getElementById("naves");


const btnFilmes = document.getElementById("btnFilmes");
const btnPesonagens = document.getElementById("btnPesonagens");
const btnPlanetas = document.getElementById("btnPlanetas");
const btnNaves = document.getElementById("btnNaves");


btnFilmes.addEventListener('click', preencherTabelaFilmes);
btnPesonagens.addEventListener('click', preencherPeople);
btnPlanetas.addEventListener('click', preencherPlanets)
btnNaves.addEventListener('click', preencherNaves)

preencherContadores();
desenharGrafico();

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(desenharGrafico);

function clearDates(){
    const tHead = $("#tableHead");
    const tBody = $("#tableBody");
    
    tHead.empty();
    tBody.empty();
}

async function desenharGrafico() {
    const response = await swapiGet('starships/');
    const starshipsArray = response.data.results;

    const dataArray = [];
    dataArray.push(['Naves', 'Passageiros']);
    starshipsArray.forEach(starships => 
        dataArray.push([starships.name, Number(starships.passengers)])
        );

  var data = google.visualization.arrayToDataTable(dataArray);

  var options = {
    title: 'Maiores Naves',
    legend: 'none'
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}

function preencherContadores() {
    
    Promise.all([swapiGet('people/'), 
                swapiGet('starships/'),
                swapiGet('vehicles/'),
                swapiGet('planets/')]).
                then(function (results) {
        personagensContador.innerHTML = results[0].data.count;
        navesContador.innerHTML = results[1].data.count;
        veiculosContador.innerHTML = results[2].data.count;
        planetasContador.innerHTML = results[3].data.count;

    });
}

    async function preencherTabelaFilmes() {
        clearDates();

        const response = await swapiGet('films/');
        const tableData = response.data.results;

        $('#tableHead').append(`
        <th>Titulo</th>
        <th>Data de Lançamento</th>
        <th>Diretor</th>
        <th>Capitulo</th>
    `) 
        tableData.forEach(film => {

        $('#tableBody').append(`
            <tr>
            <td>${film.title}</td>
            <td>${moment(film.release_date).format('DD/MM/YYYY')}</td>
            <td>${film.director}</td>
            <td>${film.episode_id}</td>
            </tr>`)
    });
}

    async function preencherPeople() {
        clearDates()
        const response = await swapiGet('people/');
        const tableData = response.data.results;
    
        $('#tableHead').append(`
        <th>Nome</th>
        <th>Genero</th>
        <th>Altura</th>
        <th>Peso</th>
    `) 
        tableData.forEach(people => {

        $('#tableBody').append(`
            <tr>
            <td>${people.name}</td>
            <td>${people.gender}</td>
            <td>${people.height}</td>
            <td>${people.mass}</td>
            </tr>`)
    })
       
};   

async function preencherPlanets() {
    clearDates()
    const response = await swapiGet('planets/');
    const tableData = response.data.results;

    $('#tableHead').append(`
    <th>Nome</th>
    <th>População</th>
    <th>Clima</th>
    <th>Terreno</th>
`) 
    tableData.forEach(planet => {

    $('#tableBody').append(`
        <tr>
        <td>${planet.name}</td>
        <td>${planet.population}</td>
        <td>${planet.climate}</td>
        <td>${planet.terrain}</td>
        </tr>`)
})
   
};

async function preencherNaves() {

    clearDates()
    const response = await swapiGet('starships/');
    const tableData = response.data.results;

    $('#tableHead').append(`
    <th>Nome</th>
    <th>Modelo</th>
    <th>Passageiros</th>
    <th>Classe</th>
`) 
    tableData.forEach(starships => {

    $('#tableBody').append(`
        <tr>
        <td>${starships.name}</td>
        <td>${starships.model}</td>
        <td>${starships.passengers}</td>
        <td>${starships.starship_class}</td>
        </tr>`)
})
   
};      



function swapiGet(param){
    return axios.get(`https://swapi.dev/api/${param}`);
};
