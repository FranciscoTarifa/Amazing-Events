
//Variables
let cardsContain = document.getElementById("cartitas")
let checkContain = document.getElementById("checkboxs")
let buscador = document.getElementById('search')
const URI = "https://amazing-events.herokuapp.com/api/events"
const casa = document.getElementById ("casa")
const proximo = document.getElementById("proximo")
const pasado = document.getElementById("pasado")
const detalles = document.getElementById("detalles")
let paginaStats = document.getElementById('paginaStats');
const queryString  = location.search
const params = new URLSearchParams(queryString)
const id = params.get("id")
const div = document.getElementById('contentdetails')
let lugarTabla = document.getElementById('lugarTabla');
let mayor = document.getElementById('mayor');
let menor = document.getElementById('menor');
let larga = document.getElementById('larga');
let trUpc = document.getElementById('trUpc');
let trPast = document.getElementById('trPast');

/*-----------------------------------FETCHS-----------------------------------*/
function cargarDatos(URL){
    fetch(URL).then(respuesta =>respuesta.json()).then(data =>{
        let arrayDeEventos= []
        if(casa!=null){
            arrayDeEventos = data.events
        }
        if(proximo!=null){
            arrayDeEventos = data.events.filter(events => (events.date > data.currentDate))
        }
        if(pasado!=null){
            arrayDeEventos = data.events.filter(events => (events.date < data.currentDate))
        }
        if(cardsContain){
            crearCards(arrayDeEventos,cardsContain)
            crearCheckboxs(arrayDeEventos,checkContain)
            escuchadoreventos(arrayDeEventos,cardsContain)
        }
        if(paginaStats != null){
            eventosFuturos = data.events.filter(events => (events.date > data.currentDate))
            eventosPasados = data.events.filter(events => (events.date < data.currentDate))
            tablaUpcyPast(eventosFuturos, trUpc)
            tablaUpcyPast(eventosPasados, trPast)
            asistenciaCapacidad(eventosPasados)
        };
        if(detalles != null){
            eventos = data.events
            const people = eventos.find(event => event._id === id)
            div.innerHTML = `
            <div class="card mb-3 cardGrande colorcard border-radius-2 fw-bolder mt-5" id="cardGrande">
                <img src="${people.image}" class="img-fluid rounded-start imgcard" alt="...">
                <div class="card-body">
                    <h2 class="card-title fw-bolder">${people.name}</h2>
                    <p class="card-text">${people.description}</p>
                    <div class="d-flex justify-content-start gap-1 align-items-baseline">
                    <h6 class="fw-bolder">Date:</h6><p>${people.date}</p>
                    </div>
                    <div class="d-flex justify-content-start gap-1 align-items-baseline">
                    <h6 class="fw-bolder">Category:</h6><p>${people.category}</p>
                    </div>
                    <div class="d-flex justify-content-start gap-1 align-items-baseline">
                    <h6 class="fw-bolder">Place:</h6><p>${people.place}</p>
                    </div>
                    <div class="d-flex justify-content-start gap-1 align-items-baseline">
                    <h6 class="fw-bolder">Capacity:</h6><p>${people.capacity}</p>
                    </div>
                    <div class="d-flex justify-content-start gap-1 align-items-baseline">
                    <h6 class="fw-bolder">Estimate or Assistance:</h6><p>${people.estimate ? people.estimate:people.assistance}</p>
                    </div>
                    <div class="d-flex justify-content-start gap-1 align-items-baseline">
                    <h6 class="fw-bolder">Price:</h6><p>${people.price}</p>
                    </div>
                    <div class="d-flex justify-content-end gap-1 align-items-baseline">
                    <a href="" class="btn ancores2">BUY</a>
                    </div>
                </div>
            </div>`
        };
    })
};  
cargarDatos(URI)
/*-----------------------------------FETCHS-----------------------------------*/

/*-----------------------------------FUNCIONES-----------------------------------*/
//Creacion de Cheks
function crearCheckboxs(datos, seccion){
let categorias = []
datos.forEach(event => {
    if (!categorias.includes(event.category)) {
        categorias.push(event.category)
    }
})
categorias.forEach(categoria => {
    let div = document.createElement('div')
    div.innerHTML += `
    <input class="form-check-input bg-secondary border-0" type="checkbox" value="${categoria}" id="${categoria}">
    <label class="form-check-label fw-bolder" for="${categoria}">
    ${categoria}
    </label>`
    seccion.appendChild(div)
})
}

//Creacion de Cards
function crearCards (datos, seccion) {
    seccion.innerHTML = ''  
    datos.forEach (event =>{
        let div = document.createElement('div');
        div.className= "d-flex flex-row flex-wrap gap-5 justify-content-center aling-items-baseline mediamain"
        div.innerHTML += 
        `<div class="card colorcard" style="width: 30rem;">
        <img src="${event.image}" class="card-img-top" id= "imgdetails"alt="...">
        <div class="card-body fw-bolder fs-5">
        <h5 class="card-title fw-bolder fs-1">${event.name}</h5>
        <p class="card-text">${event.description}</p>
        <div class="card-body d-flex flex-row justify-content-between">
        <p class="card-text w-50"> Price: $${event.price}</p>
        <a href="./details.html?id=${event._id}" class="btn btn-primary ancores2 aling-items-center">Details...</a>
        </div>
        </div>
        </div>`
        seccion.appendChild(div)
    })    
}

//Filtro por Chekbox
function filtrar (datosExistentes){
    let checkbox = document.querySelectorAll("input[type='checkbox']")
    let filtro = []
    let seleccion = Array.from(checkbox).filter(e => e.checked).map
    (check => check.value)
    filtro = datosExistentes.filter(e => seleccion.includes(e.category))
    if(seleccion.length == 0) {
        filtro = datosExistentes
    }
    return filtro
}

//Filtros por Buscador
function namefilter(event,valorbuscado){
    let buscados = event.filter(eventname => eventname.name.toLowerCase().includes(valorbuscado.toLowerCase()) || eventname.category.toLowerCase().includes(valorbuscado.toLowerCase())) 
    return buscados
}

function asistenciaCapacidad (almacenado){
    let capacidad = almacenado.map(event => event.capacity)
    let maxCapacidad = Math.max(...capacidad)
    let eventMaxCapacidad = almacenado.find(event => event.capacity == maxCapacidad)
    let asistencia = almacenado.map(event => event.assistance / event.capacity)
    let maxAsistencia = Math.max(...asistencia)
    let eventMaxAsistencia = almacenado.find(event => event.assistance / event.capacity == maxAsistencia)
    let minAsistencia = Math.min(...asistencia)
    let eventMinAsistencia = almacenado.find(event => event.assistance / event.capacity == minAsistencia)
    mayor.innerText = `${eventMaxAsistencia.name}`
    menor.innerText = `${eventMinAsistencia.name}`
    larga.innerText = `${eventMaxCapacidad.name}`
};
function tablaUpcyPast(eventosFiltrados, dondePintar){
listaCategoria = []
eventosFiltrados.forEach(evento =>{
if (!listaCategoria.includes(evento.category)){
    listaCategoria.push(evento.category)
}
})
listaCategoria.forEach(categoria => {
let estimados = []
let ganancias = []
let capacidad = []
let ganaciasPorEvento = []
eventosFiltrados.forEach(evento =>{
    if (evento.category == categoria){
    estimados.push(evento.estimate? evento.estimate : evento.assistance)
    ganancias.push(evento.price)
    capacidad.push(evento.capacity)
    ganaciasPorEvento.push(evento.price* Number(evento.estimate? evento.estimate : evento.assistance))
    }
})
let tr = document.createElement('tr')
let asistenciaTotal = 0
tr.innerHTML = `<td class="col-3">${categoria}</td>
<td class="col-5">$${ganaciasPorEvento.reduce((a,b)=>a + b)}</td>
<td class="col-4">${Math.round((estimados.map(i => Number(i)).reduce((a,b)=>a + b))*100/(capacidad.map(i=> Number(i)).reduce((a,b)=>a + b)))}%</td>`
dondePintar.appendChild(tr)
})
};
/*-----------------------------------FUNCIONES-----------------------------------*/

/*-----------------------------------ESCUCHADOR DE EVENTOS-----------------------------------*/
function escuchadoreventos(info,lugar){
    buscador.addEventListener('keyup',() =>{
        let filtrocheckbox = filtrar(info)
        let filtrocheckbox2 = namefilter(filtrocheckbox, buscador.value) 
        if(filtrocheckbox2.length==0){
            lugar.innerHTML=`<h4 fw-bolder>No results found for '${buscador.value}'</h4>`
        }else{
            crearCards(filtrocheckbox2,lugar)
        }
    })
    checkContain.addEventListener('change', ()=>{
        let filtrocheckbox = filtrar(info)
        let filtrocheckbox2 = namefilter(filtrocheckbox, buscador.value)
        if(filtrocheckbox2.length != 0){
            crearCards(filtrocheckbox2,lugar)
        }else{
            lugar.innerHTML=`<h4 fw-bolder>No results found for '${buscador.value}'</h4>`}
        });
}
/*-----------------------------------ESCUCHADOR EVENTOS-----------------------------------*/