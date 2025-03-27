
function Compra() {
    const productos = ["Laptop", "Mouse", "Teclado"];
    const precioUnitario = 50;
    const cantidad = 3;
    const total = precioUnitario * cantidad;
  
    return (
      <div>
        <h2>Resumen de Compra</h2>
        <p>Productos comprados: {productos.join(", ")}</p>
        <p>Precio unitario: ${precioUnitario}</p>
        <p>Cantidad: {cantidad}</p>
        <p><strong>Total a pagar: ${total}</strong></p>
      </div>
    );
}

export default Compra