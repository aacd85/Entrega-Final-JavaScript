
import {
    mostrarCategorias,
    mostrarProductos,
    mostrarMensaje,
    mostrarEstadoCarga,
    formatearPrecio
} from "./ui.js";

import {
    obtenerCarrito,
    agregarProducto,
    cambiarCantidad,
    eliminarProducto,
    vaciarCarrito,
    calcularSubtotal,
    mostrarCarrito
} from "./carrito.js";


/*ELEMENTOS DEL HTML*/

const buscador = document.querySelector("#buscador");
const filtroCategoria = document.querySelector("#filtro-categoria");
const contenedorCarrito = document.querySelector("#contenedor-carrito");
const botonVaciar = document.querySelector("#btn-vaciar-carrito");
const botonConfirmar = document.querySelector("#btn-confirmar-pedido");
const resultadoPedido = document.querySelector("#resultado-pedido");
const detallePedido = document.querySelector("#detalle-pedido");


/*DATOS DE LA APLICACIÓN*/

let productos = [];


/*NOTIFICACIONES*/

function notificar(texto) {
    if (typeof window.Toastify === "function") {
        window.Toastify({
            text: texto,
            duration: 3000,
            gravity: "top",
            position: "right",
            close: true,
            stopOnFocus: true
        }).showToast();
    } else {
        mostrarMensaje(texto);
    }
}


/*CARGAR PRODUCTOS DESDE JSON*/

async function cargarProductos() {
    mostrarEstadoCarga("Cargando productos...");

    try {
        const respuesta = await fetch("./data.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el catálogo.");
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error("El catálogo tiene un formato incorrecto.");
        }

        productos = datos;

        mostrarCategorias(productos);
        aplicarFiltros();
        mostrarCarrito();

    } catch (error) {
        mostrarEstadoCarga(
            "No pudimos cargar los productos. Abre el proyecto con Live Server e inténtalo de nuevo."
        );

        mostrarMensaje(error.message);
    } finally {
        const estadoCarga = document.querySelector("#estado-carga");

        if (productos.length > 0) {
            estadoCarga.textContent = `Catálogo cargado: ${productos.length} productos.`;
        }
    }
}


/*BUSCAR Y FILTRAR PRODUCTOS*/

function aplicarFiltros() {
    const textoBusqueda = buscador.value.trim().toLowerCase();
    const categoriaSeleccionada = filtroCategoria.value;

    const productosFiltrados = productos.filter((producto) => {
        const coincideNombre = producto.nombre
            .toLowerCase()
            .includes(textoBusqueda);

        const coincideCategoria =
            categoriaSeleccionada === "todas" ||
            producto.categoria === categoriaSeleccionada;

        return coincideNombre && coincideCategoria;
    });

    mostrarProductos(productosFiltrados, agregarAlCarrito);
}


/*AGREGAR AL CARRITO*/

function agregarAlCarrito(id) {
    const producto = productos.find((item) => item.id === id);

    if (!producto) {
        notificar("No encontramos ese producto.");
        return;
    }

    agregarProducto(producto, notificar);
    actualizarInterfaz();
}


/*INTERACCIONES DEL CARRITO*/

contenedorCarrito.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton) {
        return;
    }

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.accion;

    if (accion === "aumentar") {
        cambiarCantidad(id, 1, notificar);
    } else if (accion === "disminuir") {
        cambiarCantidad(id, -1, notificar);
    } else if (accion === "eliminar") {
        eliminarProducto(id);
        notificar("Producto eliminado del carrito.");
    }

    actualizarInterfaz();
});


/*ACTUALIZAR LA INTERFAZ*/

function actualizarInterfaz() {
    aplicarFiltros();
    mostrarCarrito();
}


/*VACIAR CARRITO*/

botonVaciar.addEventListener("click", () => {
    if (obtenerCarrito().length === 0) {
        notificar("El carrito ya está vacío.");
        return;
    }

    vaciarCarrito();
    actualizarInterfaz();
    notificar("Has vaciado el carrito.");
});


/*CONFIRMAR PEDIDO*/

botonConfirmar.addEventListener("click", () => {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        notificar("Agrega al menos un producto antes de confirmar.");
        return;
    }

    const productosPedido = carrito.map(
        ({ nombre, precio, cantidad }) => ({
            nombre,
            precio,
            cantidad,
            total: precio * cantidad
        })
    );

    const totalPedido = calcularSubtotal();

    detallePedido.innerHTML = "";

    productosPedido.forEach(({ nombre, cantidad, total }) => {
        const fila = document.createElement("p");

        fila.classList.add("detalle-pedido-item");

        fila.textContent =
            `${nombre} × ${cantidad}: ${formatearPrecio(total)}`;

        detallePedido.appendChild(fila);
    });

    const total = document.createElement("p");

    total.classList.add("total-pedido");
    total.textContent = `Total del pedido: ${formatearPrecio(totalPedido)}`;

    detallePedido.appendChild(total);

    resultadoPedido.hidden = false;

    vaciarCarrito();
    actualizarInterfaz();

    resultadoPedido.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    notificar("¡Pedido confirmado! Esta es una simulación, no un cobro real.");
});


/*EVENTOS DEL BUSCADOR Y FILTRO*/

buscador.addEventListener("input", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);


/*INICIAR APLICACIÓN*/

cargarProductos();
