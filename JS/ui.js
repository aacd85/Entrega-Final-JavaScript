
/*ELEMENTOS DEL HTML*/

const contenedorProductos = document.querySelector("#contenedor-productos");
const filtroCategoria = document.querySelector("#filtro-categoria");
const estadoCarga = document.querySelector("#estado-carga");
const mensaje = document.querySelector("#mensaje");


/*MOSTRAR CATEGORÍAS*/

export function mostrarCategorias(productos) {
    const categorias = productos.map(({ categoria }) => categoria);

    const categoriasUnicas = [...new Set(categorias)];

    filtroCategoria.innerHTML = `
        <option value="todas">Todas las categorías</option>
    `;

    categoriasUnicas.forEach((categoria) => {
        const opcion = document.createElement("option");

        opcion.value = categoria;
        opcion.textContent = categoria;

        filtroCategoria.appendChild(opcion);
    });
}


/*MOSTRAR PRODUCTOS*/

export function mostrarProductos(productos, agregarAlCarrito) {
    contenedorProductos.innerHTML = "";

    if (productos.length === 0) {
        contenedorProductos.innerHTML = `
            <p class="sin-resultados">
                No encontramos productos con esos criterios.
            </p>
        `;
        return;
    }

    productos.forEach(({ id, nombre, precio, stock, categoria }) => {
        const tarjeta = document.createElement("article");

        tarjeta.classList.add("tarjeta-producto");

        tarjeta.innerHTML = `
            <span class="categoria-producto">${categoria}</span>

            <h3>${nombre}</h3>

            <p class="precio-producto">
                ${formatearPrecio(precio)}
            </p>

            <p class="stock-producto">
                Disponibles: ${stock}
            </p>

            <button
                type="button"
                class="btn-agregar"
                data-id="${id}"
                ${stock <= 0 ? "disabled" : ""}
            >
                ${stock <= 0 ? "Agotado" : "Agregar al carrito"}
            </button>
        `;

        const boton = tarjeta.querySelector(".btn-agregar");

        boton.addEventListener("click", () => {
            agregarAlCarrito(id);
        });

        contenedorProductos.appendChild(tarjeta);
    });
}


/*FORMATO DE PRECIOS*/

export function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(precio);
}


/* MENSAJES EN PANTALLA*/

export function mostrarMensaje(texto) {
    mensaje.textContent = texto;
}


/* ESTADO DE CARGA*/

export function mostrarEstadoCarga(texto) {
    estadoCarga.textContent = texto;
}
