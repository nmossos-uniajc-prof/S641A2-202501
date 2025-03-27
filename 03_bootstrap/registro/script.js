let  estudiantes = [];

function registrar() {
    let nombre = document.getElementById("nombre").value;
    let edad = parseInt(document.getElementById("edad").value);
    let programa = document.getElementById("programa").value;
    let nota = parseFloat(document.getElementById("nota").value);

    const est = {nombre,edad,programa,nota};
    estudiantes.push(est);
    limpiar();
    promedio();
    actualizarInfo();

    const aviso = new bootstrap.Toast(document.getElementById("avisoexito"));
    aviso.show();
}

function limpiar(params) {
    document.getElementById("nombre").value = "";
    document.getElementById("edad").value = "";
    document.getElementById("programa").value = "";
    document.getElementById("nota").value = "";
}


function actualizarInfo(params) {
    const listHtml = document.getElementById("lista");
    let cadena = ""
    for (let i = 0; i < estudiantes.length; i++) {
        cadena += `<div class="col col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2 p-2">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${estudiantes[i].nombre}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${estudiantes[i].programa}</h6>
                    <p class="card-text">Edad: ${estudiantes[i].edad}</p>
                    <p class="card-text">Nota: ${estudiantes[i].nota}</p>
                    <a href="#" class="btn btn-danger" onclick="eliminar(${i})"><i class="bi bi-person-x-fill"></i> Eliminar</a>
                </div>
            </div>
        </div>`
    }
    listHtml.innerHTML = cadena;
}

function promedio(params) {
    let total = 0;
    let prom= 0;
    if (estudiantes.length>0) {
        for (let i = 0; i < estudiantes.length; i++) {
            total += estudiantes[i].nota;
        }
        prom = total / estudiantes.length;
    }
    console.log(prom);
    
    document.getElementById("promedio").textContent = prom.toFixed(1);
}

function eliminar(index) {
    if ( confirm("Esta seguro que desea eliminar el registro?")) {
        estudiantes.splice(index,1);
        promedio();
        actualizarInfo();
    }
}
