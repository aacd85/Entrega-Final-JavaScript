
import { formatearPrecio } from "./ui.js";

/*ESTADO DEL CARRITO*/

const CLAVE_CARRITO = "carritoSilcar";

let carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "[]");


/*GUARDAR CARRITO*/

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}


/*OBTENER CARRITO*/

export function obtenerCarrito() {
    return carrito;
}


/*AGREGAR PRODUCTO*/

export function agregarProducto(producto, notificar) {
    const { id, nombre, precio, stock, categoria } = producto;

    const productoEnCarrito = carrito.find((item) => item.id === id);

    if (stock <= 0) {
        notificar("Este producto está agotado.");
        return;
    }

    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad >= stock) {
            notificar("No hay más unidades disponibles.");
            return;
        }

        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            id,
            nombre,
            precio,
            stock,
            categoria,
            cantidad: 1
        });
    }

    guardarCarrito();
    notificar(`${nombre} agregado al carrito.`);
}


/*CAMBIAR CANTIDAD*/

export function cambiarCantidad(id, cambio, notificar) {
    const producto = carrito.find((item) => item.id === id);

    if (!producto) {
        return;
    }

    const nuevaCantidad = producto.cantidad + cambio;

    if (nuevaCantidad <= 0) {
        eliminarProducto(id);
        notificar("Producto eliminado del carrito.");
        return;
    }

    if (nuevaCantidad > producto.stock) {
        notificar("Alcanzaste el máximo de unidades disponibles.");
        return;
    }

    producto.cantidad = nuevaCantidad;

    guardarCarrito();
}


/*ELIMINAR PRODUCTO*/

export function eliminarProducto(id) {
    carrito = carrito.filter((item) => item.id !== id);

    guardarCarrito();
}


/*VACIAR CARRITO*/

export function vaciarCarrito() {
    carrito = [];

    guardarCarrito();
}


/*CALCULAR SUBTOTAL*/

export function calcularSubtotal() {
    return carrito.reduce((total, producto) => {
        return total + producto.precio * producto.cantidad;
    }, 0);
}


/*CONTAR UNIDADES*/

export function contarUnidades() {
    return carrito.reduce((total, producto) => {
        return total + producto.cantidad;
    }, 0);
}


/*MOSTRAR CARRITO*/

export function mostrarCarrito() {
    const contenedor = document.querySelector("#contenedor-carrito");
    const cantidadCarrito = document.querySelector("#cantidad-carrito");
    const subtotalElemento = document.querySelector("#subtotal");
    const totalElemento = document.querySelector("#total-carrito");
    const botonConfirmar = document.querySelector("#btn-confirmar-pedido");

    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío. Agrega productos del catálogo.
            </p>
        `;
    } else {
        carrito.forEach(({ id, nombre, precio, cantidad }) => {
            const fila = document.createElement("article");

            fila.classList.add("item-carrito");

            fila.innerHTML = `
                <div class="info-carrito">
                    <h3>${nombre}</h3>
                    <p>${formatearPrecio(precio)} por unidad</p>
                    <strong>${formatearPrecio(precio * cantidad)}</strong>
                </div>

                <div class="controles-cantidad">
                    <button
                        type="button"
                        class="btn-cantidad"
                        data-accion="disminuir"
                        data-id="${id}"
                        aria-label="Disminuir cantidad de ${nombre}"
                    >−</button>

                    <span class="cantidad">${cantidad}</span>

                    <button
                        type="button"
                        class="btn-cantidad"
                        data-accion="aumentar"
                        data-id="${id}"
                        aria-label="Aumentar cantidad de ${nombre}"
                    >+</button>

                    <button
                        type="button"
                        class="btn-eliminar"
                        data-accion="eliminar"
                        data-id="${id}"
                    >
                        Eliminar
                    </button>
                </div>
            `;

            contenedor.appendChild(fila);
        });
    }

    const unidades = contarUnidades();
    const subtotal = calcularSubtotal();

    cantidadCarrito.textContent =
        `${unidades} ${unidades === 1 ? "producto" : "productos"}`;

    subtotalElemento.textContent = formatearPrecio(subtotal);
    totalElemento.textContent = formatearPrecio(subtotal);

    botonConfirmar.disabled = carrito.length === 0;
}
