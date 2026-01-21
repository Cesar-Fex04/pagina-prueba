// 1. Variables globales
const contenedor = document.getElementById('contenedor-productos');
const contadorCarrito = document.getElementById('cart-count');
const etiquetaTotal = document.getElementById('precio-total'); 
let cantidades = {}; 
let productosDatos = []; // Guardaremos aquí la información de los precios

// 2. Función para cargar productos
async function cargarProductos() {
    try {
        const respuesta = await fetch('productos.json');
        productosDatos = await respuesta.json(); // Guardamos los datos para usarlos después
        renderizarProductos(productosDatos);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// 3. Función para mostrar los productos
function renderizarProductos(lista) {
    contenedor.innerHTML = ""; 

    lista.forEach(producto => {
        if (!cantidades[producto.id]) cantidades[producto.id] = 0;

        const card = document.createElement('article');
        card.classList.add('servicio-card');
        
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio}</p>
            
            <div class="selector-cantidad">
                <button class="btn-menor" onclick="restar(${producto.id})">-</button>
                <span id="cant-${producto.id}" class="numero-cantidad">0</span>
                <button class="btn-mayor" onclick="sumar(${producto.id})">+</button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// 4. Funciones de control
function sumar(id) {
    cantidades[id]++;
    actualizarInterfaz(id);
}

function restar(id) {
    // Solo restamos si la cantidad es mayor a 0
    if (cantidades[id] > 0) {
        cantidades[id]--;
        actualizarInterfaz(id);
    }
}

// 5. Función Maestra: Actualiza el texto y el DINERO
function actualizarInterfaz(id) {
    // Actualiza el número individual en la tarjeta
    const spanCantidad = document.getElementById(`cant-${id}`);
    if (spanCantidad) {
        spanCantidad.innerText = cantidades[id];
    }

    // Calculamos el total de productos y el total de dinero desde cero
    let totalItems = 0;
    let totalDinero = 0;

    for (const idProd in cantidades) {
        const cantidadActual = cantidades[idProd];
        totalItems += cantidadActual;

        // Buscamos el precio del producto en nuestra lista global
        const info = productosDatos.find(p => p.id == idProd);
        if (info) {
            totalDinero += info.precio * cantidadActual;
        }
    }

    // Reflejamos los resultados en el HTML
    if (contadorCarrito) contadorCarrito.innerText = totalItems;
    if (etiquetaTotal) etiquetaTotal.innerText = totalDinero.toFixed(2);
}

cargarProductos();