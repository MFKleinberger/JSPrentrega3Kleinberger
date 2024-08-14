let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarCantidad(input, producto, incremento) {
    let cantidadActual = parseInt(input.value) || 0;
    cantidadActual += incremento ? 1 : -1;
    if (cantidadActual < 0) cantidadActual = 0;
    input.value = cantidadActual;
    actualizarCarrito(producto, cantidadActual);
}

function actualizarCarrito(producto, cantidad) {
    let productoExiste = carrito.some((item) => {
        if (item.id === producto.id) {
            if (cantidad > 0) {
                item.cantidad = cantidad;
            } else {
                carrito = carrito.filter(p => p.id !== producto.id);
            }
            return true;
        }
        return false;
    });

    if (!productoExiste && cantidad > 0) {
        carrito.push({ ...producto, cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarTotalCarbohidratos();
}

function actualizarTotalCarbohidratos() {
    const totalCarbos = carrito.reduce((acc, item) => acc + item.carbos * item.cantidad, 0);
    document.getElementById("total-carbohidratos").innerText = `Total Carbo/h: ${totalCarbos}`;
}

function limpiarCarrito() {
    if (confirm("¿Estás seguro de que deseas limpiar el carrito?")) {
        carrito = [];
        localStorage.clear("carrito");
        actualizarTotalCarbohidratos();

        const inputs = [...document.getElementsByClassName('cantidad-input')];
        inputs.forEach(input => input.value = 0);
    }
}

function mostrarCarrito() {
    let mensaje = '';
    carrito.forEach(({ nombre, um, cantidad, carbos }) => {
        mensaje += `Felicitaciones!! \nYa tienes definido tus alimentos:\n\n ${cantidad} x ${nombre} (${um}) : ${carbos * cantidad} gr\n`;
    });
    const totalCarbos = carrito.reduce((acc, item) => acc + item.carbos * item.cantidad, 0);
    mensaje += `\n\nTotal de Carbohidratos: ${totalCarbos} gr`;
    alert(mensaje || "El carrito está vacío.");
}

const header = document.getElementById("mi-header");
const titulo = document.createElement("h1");
const subTitulo = document.createElement("h2")
titulo.innerText = "Trail Running";
subTitulo.innerText = "Calculadora de Carbohidratos";
header.appendChild(titulo);
header.appendChild(subTitulo);

const parrafo = document.createElement("p");
parrafo.innerText = "Para cada hora de carrera se estima una necesidad de reposición de 70 a 90 gramos de carbohidratos.";
header.appendChild(parrafo);

function crearBarraCarrito() {
    const containerCarrito = document.getElementById("container-carrito");

    const barra = document.createElement("div");
    barra.id = "barra-carrito";

    const totalCarbohidratos = document.createElement("span");
    totalCarbohidratos.id = "total-carbohidratos";
    totalCarbohidratos.innerText = "Total Carbo/h: 0";

    const botonLimpiar = document.createElement("button");
    botonLimpiar.id = "boton-limpiar";
    botonLimpiar.innerText = "Limpiar Carrito";
    botonLimpiar.onclick = limpiarCarrito;

    const botonMostrar = document.createElement("button");
    botonMostrar.id = "boton-mostrar";
    botonMostrar.innerText = "Mostrar Carrito";
    botonMostrar.onclick = mostrarCarrito;

    barra.append(totalCarbohidratos);
    barra.append(botonLimpiar);
    barra.append(botonMostrar);

    containerCarrito.appendChild(barra);
}

crearBarraCarrito();

function crearCard(producto) {
    const card = document.createElement("div");
    card.className = "card col-md-4 mb-4";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const titulo = document.createElement("h5");
    titulo.className = "card-title";
    titulo.innerText = producto.nombre;

    const imagen = document.createElement("img");
    imagen.src = producto.img;
    imagen.className = "imgCard img-fluid";

    const carbos = document.createElement("p");
    carbos.className = "card-text carbos";
    carbos.innerText = `CarboHidratos: ${producto.carbos} gr`;
    
    const um = document.createElement("p");
    um.className = "card-text um";
    um.innerText = `Medida: ${producto.um}`;

    const controlGroup = document.createElement("div");
    controlGroup.className = "control-group d-flex align-items-center";
    
    const botonMas = document.createElement("button");
    botonMas.className = "btn btn-success mr-2";
    botonMas.innerText = " + ";
    botonMas.onclick = () => actualizarCantidad(cantidad, producto, true);

    const cantidad = document.createElement("input");
    cantidad.className = "form-control text-center cantidad-input";
    cantidad.type = "text";
    cantidad.value = 0;

    const botonMenos = document.createElement("button");
    botonMenos.className = "btn btn-danger ml-2";
    botonMenos.innerText = " - ";
    botonMenos.onclick = () => actualizarCantidad(cantidad, producto, false);

    controlGroup.append(botonMenos);
    controlGroup.append(cantidad);
    controlGroup.append(botonMas);

    cardBody.append(titulo);
    cardBody.append(imagen);
    cardBody.append(carbos);
    cardBody.append(um);
    cardBody.append(controlGroup);

    card.append(cardBody);

    document.getElementById("alimentos-container").appendChild(card);
}

alimentos.forEach(el => crearCard(el));