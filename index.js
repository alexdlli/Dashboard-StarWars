
const personagensContador = document.getElementById("personagens");
const veiculosContador = document.getElementById("vehicles");
const planetasContador = document.getElementById("planetas");
const navesContador = document.getElementById("naves");

preencherTabelaFilmes();
preencherContadores();
desenharGrafico();

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(desenharGrafico);

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
};   


function swapiGet(param){
    return axios.get(`https://swapi.dev/api/${param}`);
}
