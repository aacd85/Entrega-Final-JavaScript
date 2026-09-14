
// PRE-ENTREGA 6 - FUNCIONES DE ORDEN SUPERIOR

// CLASE PRODUCTO


class Producto {

    constructor(id, nombre, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    // Método para vender productos
    vender(cantidad) {

        if (cantidad <= 0) {
            return "La cantidad debe ser mayor a 0.";
        }

        if (cantidad <= this.stock) {

            this.stock -= cantidad;

            return `Venta realizada.
Producto: ${this.nombre}
Cantidad vendida: ${cantidad}
Stock disponible: ${this.stock}`;

        } else {

            return `No hay suficiente stock de ${this.nombre}.
Stock disponible: ${this.stock}`;

        }
    }

// Método para mostrar información
    mostrarInformacion() {

        return `ID: ${this.id}
Producto: ${this.nombre}
Precio: $${this.precio}
Stock: ${this.stock}`;

    }
}



// CREACIÓN DE OBJETOS


const detergente = new Producto(
    1,
    "Detergente",
    12000,
    20
);

const desinfectante = new Producto(
    2,
    "Desinfectante",
    15000,
    15
);

const limpiavidrios = new Producto(
    3,
    "Limpiavidrios",
    10000,
    10
);

const jabonLoza = new Producto(
    4,
    "Jabón para loza",
    9000,
    0
);



// ARRAY DE OBJETOS


const productos = [
    detergente,
    desinfectante,
    limpiavidrios,
    jabonLoza
];



// MOSTRAR PRODUCTOS EN CONSOLA


console.log("===== PRODUCTOS DE SILCAR CLEAN =====");

productos.forEach(producto => {
    console.log(producto.mostrarInformacion());
});



// MENÚ PRINCIPAL


const opcion = prompt(
    "Bienvenido a Silcar Clean\n\n" +
    "¿Qué deseas hacer?\n\n" +
    "1. Comprar un producto\n" +
    "2. Buscar un producto por ID\n" +
    "3. Ver productos disponibles\n" +
    "4. Ver precios con descuento\n" +
    "5. Calcular valor total del inventario"
);



// OPCIÓN 1
// COMPRAR PRODUCTO


if (opcion === "1") {

    const idProducto = Number(
        prompt(
            "Ingresa el ID del producto que deseas comprar:\n\n" +
            "1. Detergente\n" +
            "2. Desinfectante\n" +
            "3. Limpiavidrios\n" +
            "4. Jabón para loza"
        )
    );


    // FIND
    // Busca un producto específico dentro del array.

    const productoSeleccionado = productos.find(
        producto => producto.id === idProducto
    );


    if (productoSeleccionado) {

        const cantidad = Number(
            prompt(
                `Has seleccionado: ${productoSeleccionado.nombre}\n\n` +
                `Precio: $${productoSeleccionado.precio}\n` +
                `Stock disponible: ${productoSeleccionado.stock}\n\n` +
                "¿Cuántas unidades deseas comprar?"
            )
        );


        if (cantidad > 0) {

            const confirmar = confirm(
                `¿Confirmas la compra de ${cantidad} ` +
                `${productoSeleccionado.nombre}?`
            );


            if (confirmar) {

                const resultado = productoSeleccionado.vender(cantidad);

                alert(resultado);

                console.log("===== RESULTADO DE LA COMPRA =====");
                console.log(resultado);

                console.log("Producto actualizado:");
                console.log(productoSeleccionado);

            } else {

                alert("Compra cancelada.");

                console.log("El usuario canceló la compra.");

            }

        } else {

            alert("La cantidad ingresada no es válida.");

        }

    } else {

        alert("No encontramos un producto con ese ID.");

        console.log("Producto no encontrado.");

    }
}



// OPCIÓN 2
// BUSCAR PRODUCTO POR ID


else if (opcion === "2") {

    const idBuscado = Number(
        prompt("Ingresa el ID del producto que deseas buscar:")
    );


    // FIND
    // Devuelve el primer objeto que cumple
    // con la condición.

    const productoEncontrado = productos.find(
        producto => producto.id === idBuscado
    );


    if (productoEncontrado) {

        console.log("===== PRODUCTO ENCONTRADO =====");

        console.log(productoEncontrado);


        alert(
            `Producto encontrado:\n\n` +
            `ID: ${productoEncontrado.id}\n` +
            `Nombre: ${productoEncontrado.nombre}\n` +
            `Precio: $${productoEncontrado.precio}\n` +
            `Stock: ${productoEncontrado.stock}`
        );

    } else {

        alert("No encontramos un producto con ese ID.");

        console.log("No se encontró el producto.");

    }
}



// OPCIÓN 3
// VER PRODUCTOS DISPONIBLES


else if (opcion === "3") {


    // FILTER
    // Crea un nuevo array solamente con los
    // productos que tienen stock disponible.

    const productosDisponibles = productos.filter(
        producto => producto.stock > 0
    );


    console.log("===== PRODUCTOS DISPONIBLES =====");

    console.log(productosDisponibles);


    let mensaje = "Productos disponibles:\n\n";


    productosDisponibles.forEach(producto => {

        mensaje +=
            `ID: ${producto.id}\n` +
            `Producto: ${producto.nombre}\n` +
            `Precio: $${producto.precio}\n` +
            `Stock: ${producto.stock}\n\n`;

    });


    alert(mensaje);

}



// OPCIÓN 4
// PRECIOS CON DESCUENTO


else if (opcion === "4") {


    // MAP
    // Crea un nuevo array transformando la información
    // de cada producto.
    //
    // En este caso agregamos un precio con 10% de descuento.

    const productosConDescuento = productos.map(producto => {

        return {
            ...producto,
            precioConDescuento: producto.precio * 0.90
        };

    });


    console.log("===== PRODUCTOS CON DESCUENTO =====");

    console.log(productosConDescuento);


    let mensaje = "Precios con 10% de descuento:\n\n";


    productosConDescuento.forEach(producto => {

        mensaje +=
            `${producto.nombre}\n` +
            `Precio original: $${producto.precio}\n` +
            `Precio con descuento: $${producto.precioConDescuento}\n\n`;

    });


    alert(mensaje);

}



// OPCIÓN 5
// VALOR TOTAL DEL INVENTARIO


else if (opcion === "5") {


    // REDUCE
    // Calcula el valor total de todos los productos
    // disponibles en el inventario.
    //
    // Precio x cantidad en stock.

    const totalInventario = productos.reduce(
        (total, producto) => {
            return total + (producto.precio * producto.stock);
        },
        0
    );


    console.log("===== VALOR TOTAL DEL INVENTARIO =====");

    console.log(`Valor total: $${totalInventario}`);


    alert(
        `El valor total del inventario es:\n\n` +
        `$${totalInventario}`
    );

}



// OPCIÓN NO VÁLIDA


else {

    alert(
        "Opción no válida. " +
        "Por favor, recarga la página e intenta nuevamente."
    );

    console.log("Opción no válida.");

} 