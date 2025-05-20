import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://sistema-reservas-final.onrender.com';

export default function Dashboard() {
  const [tipoServicio, setTipoServicio] = useState('desayuno');
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [habitacion, setHabitacion] = useState('');
  const [mensaje, setMensaje] = useState('');

  const productosPorTipo = {
    desayuno: [
      { id: 1, nombre: 'Desayuno Tradicional', precio: 10000 },
      { id: 2, nombre: 'Huevo', precio: 3000 },
      { id: 3, nombre: 'Jugo natural', precio: 4000 },
      { id: 4, nombre: 'Caldo', precio: 5000 },
    ],
    almuerzo: [
      { id: 5, nombre: 'Bandeja paisa', precio: 18000 },
      { id: 6, nombre: 'Pollo asado', precio: 15000 },
      { id: 7, nombre: 'Arroz adicional', precio: 3000 },
      { id: 8, nombre: 'Papa adicional', precio: 3000 },
    ],
    bar: [
      { id: 9, nombre: 'Agua', precio: 2500 },
      { id: 10, nombre: 'Gaseosa', precio: 3000 },
      { id: 11, nombre: 'Cerveza', precio: 5000 },
      { id: 12, nombre: 'Ron', precio: 8000 },
    ],
  };

  useEffect(() => {
    setProductos(productosPorTipo[tipoServicio]);
  }, [tipoServicio]);

  const agregarProducto = (producto) => {
    const existente = pedido.find((p) => p.id === producto.id);
    if (existente) {
      setPedido(
        pedido.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setPedido([...pedido, { ...producto, cantidad: 1 }]);
    }
  };

  const calcularTotal = () =>
    pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const enviarPedido = async () => {
    try {
      for (const item of pedido) {
        await axios.post(
          `${API_URL}/api/pedidos`,
          {
            usuario_id: 1, // Cambia por el ID real del mesero
            producto_id: item.id,
            nombre_producto: item.nombre,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
            total: item.precio * item.cantidad,
            tipo: tipoServicio,
            categoria: tipoServicio,
            habitacion_id: habitacion || null,
          },
          { withCredentials: true }
        );
      }
      setMensaje('✅ Pedido registrado con éxito');
      setPedido([]);
      setHabitacion('');
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al registrar el pedido');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      {/* Contenedor con ancho máximo de ~28rem (1/3 aprox en pantallas grandes) */}
      <div className="bg-white w-full max-w-md p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro de Pedidos</h1>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Tipo de Servicio:</label>
          <select
            value={tipoServicio}
            onChange={(e) => setTipoServicio(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="desayuno">Desayuno</option>
            <option value="almuerzo">Almuerzo</option>
            <option value="bar">Bar</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Habitación o Cabaña (opcional):</label>
          <input
            type="text"
            value={habitacion}
            onChange={(e) => setHabitacion(e.target.value)}
            placeholder="Ej: 102"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {productos.map((prod) => (
            <button
              key={prod.id}
              onClick={() => agregarProducto(prod)}
              className="bg-gray-50 border rounded p-3 hover:bg-gray-100"
            >
              <div className="font-medium">{prod.nombre}</div>
              <div className="text-sm text-gray-600">${prod.precio}</div>
            </button>
          ))}
        </div>

        <h2 className="text-lg font-bold mb-2">Pedido Actual</h2>
        <ul className="mb-4 max-h-40 overflow-y-auto">
          {pedido.map((item) => (
            <li key={item.id} className="flex justify-between py-1">
              {item.nombre} x{item.cantidad} = ${item.precio * item.cantidad}
            </li>
          ))}
        </ul>

        <div className="text-lg font-bold mb-4">Total: ${calcularTotal()}</div>

        <button
          onClick={enviarPedido}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Enviar Pedido
        </button>

        {mensaje && <p className="mt-4 text-center text-sm">{mensaje}</p>}
      </div>
    </div>
  );
}
