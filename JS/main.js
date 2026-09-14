// Clase Producto

class Producto {

    constructor(id, nombre, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    mostrarPrecio() {
        return `$${this.precio.toLocaleString("es-CO")}`;
    }
}


// Array de productos

let productos = [
    new Producto(1, "Detergente", 12000, 20),
    new Producto(2, "Desinfectante", 15000, 15),
    new Producto(3, "Limpiavidrios", 10000, 10)
];


// Selección de elementos del DOM

const formulario = document.querySelector("#formulario-producto");

const inputNombre = document.querySelector("#nombre");

const inputPrecio = document.querySelector("#precio");

const inputStock = document.querySelector("#stock");

const contenedorProductos = document.querySelector("#contenedor-productos");

const buscador = document.querySelector("#buscador");

const mensaje = document.querySelector("#mensaje");


// Función para mostrar mensajes

function mostrarMensaje(texto, tipo) {

    mensaje.innerHTML = `
        <div class="${tipo}">
            ${texto}
        </div>
    `;

    setTimeout(() => {
        mensaje.innerHTML = "";
    }, 3000);
}


// Función para renderizar productos

function renderizarProductos(listaProductos) {

    contenedorProductos.innerHTML = "";

    if (listaProductos.length === 0) {

        contenedorProductos.innerHTML = `
            <div class="sin-productos">
                <p>No se encontraron productos.</p>
            </div>
        `;

        return;
    }


    listaProductos.forEach((producto) => {

        contenedorProductos.innerHTML += `
            <div class="producto">

                <h3>${producto.nombre}</h3>

                <p>
                    <strong>Precio:</strong>
                    ${producto.mostrarPrecio()}
                </p>

                <p>
                    <strong>Stock:</strong>
                    ${producto.stock}
                </p>

                <button
                    class="btn-eliminar"
                    data-id="${producto.id}"
                >
                    Eliminar
                </button>

            </div>
        `;
    });
}


// Mostrar productos al cargar la página

renderizarProductos(productos);


// Evento del formulario

formulario.addEventListener("submit", (evento) => {

    evento.preventDefault();


    const nombre = inputNombre.value.trim();

    const precio = Number(inputPrecio.value);

    const stock = Number(inputStock.value);


    if (nombre === "" || precio <= 0 || stock < 0) {

        mostrarMensaje(
            "Por favor, completa todos los campos correctamente.",
            "mensaje-error"
        );

        return;
    }


    const nuevoId = productos.length > 0
        ? Math.max(...productos.map(producto => producto.id)) + 1
        : 1;


    const nuevoProducto = new Producto(
        nuevoId,
        nombre,
        precio,
        stock
    );


    productos.push(nuevoProducto);


    renderizarProductos(productos);


    mostrarMensaje(
        `El producto "${nombre}" fue agregado correctamente.`,
        "mensaje-exito"
    );


    formulario.reset();
});


// Evento para eliminar productos

contenedorProductos.addEventListener("click", (evento) => {

    if (evento.target.classList.contains("btn-eliminar")) {

        const idProducto = Number(
            evento.target.dataset.id
        );


        const producto = productos.find(
            producto => producto.id === idProducto
        );


        productos = productos.filter(
            producto => producto.id !== idProducto
        );


        renderizarProductos(productos);


        mostrarMensaje(
            `El producto "${producto.nombre}" fue eliminado.`,
            "mensaje-exito"
        );
    }
});


// Evento de teclado para buscar productos

buscador.addEventListener("input", () => {

    const textoBuscado = buscador.value
        .toLowerCase()
        .trim();


    const productosFiltrados = productos.filter(
        producto =>
            producto.nombre
                .toLowerCase()
                .includes(textoBuscado)
    );


    renderizarProductos(productosFiltrados);
});