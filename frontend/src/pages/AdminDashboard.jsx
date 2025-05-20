// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { reservasService } from '../services/reservasService';

/* --- Header: Logo, nombre de usuario, fecha/hora, configuración, cerrar sesión --- */
function Header({ userName }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <span className="text-xl font-semibold">Club La Buena Vida</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="hidden md:inline text-gray-700">Hola, {userName}</span>
        <span className="text-gray-600">
          {currentTime.toLocaleDateString('es-ES')} {currentTime.toLocaleTimeString('es-ES')}
        </span>
        <button className="p-2 hover:bg-gray-100 rounded-full" aria-label="Configuración">⚙️</button>
        <button className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

/* --- Sidebar --- */
function Sidebar({ activeMenu, setActiveMenu }) {
  const itemClass = isActive =>
    isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600';
  return (
    <aside className="w-64 bg-white border-r overflow-y-auto">
      <nav className="p-4">
        <ul>
          <li className="mb-2">
            <button
              className={`w-full text-left py-2 ${itemClass(activeMenu === 'dashboard')}`}
              onClick={() => setActiveMenu('dashboard')}
            >Panel de Control</button>
          </li>

          <li className="mb-1 font-semibold">Reservas</li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${itemClass(activeMenu === 'reservasGestionar')}`}
              onClick={() => setActiveMenu('reservasGestionar')}
            >Gestionar</button>
          </li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${itemClass(activeMenu === 'reservasCrear')}`}
              onClick={() => setActiveMenu('reservasCrear')}
            >Crear</button>
          </li>
          <li className="ml-4 mb-4">
            <button
              className={`w-full text-left py-1 ${itemClass(activeMenu === 'reservasHistorial')}`}
              onClick={() => setActiveMenu('reservasHistorial')}
            >Historial</button>
          </li>

          {/* ... otros menús ... */}
        </ul>
      </nav>
    </aside>
  );
}

/* --- Footer --- */
function Footer() {
  return (
    <footer className="p-4 bg-gray-50 text-center text-sm text-gray-600 border-t">
      <p>Contacto: admin@labuenavida.com | Tel: (123) 456-7890</p>
      <div className="space-x-2">
        <a href="#" className="hover:underline">Política de Privacidad</a> |{' '}
        <a href="#" className="hover:underline">Términos de Servicio</a>
      </div>
      <p className="mt-2">Versión 1.0.0</p>
    </footer>
  );
}

/* --- DashboardContent (visión general) --- */
function DashboardContent() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Panel de Control</h2>
      <p>Bienvenido al panel de administración.</p>
    </div>
  );
}

/* --- Reservas Gestionar: listado y eliminación --- */
function ReservasGestionar() {
  const [reservas, setReservas] = useState([]);
  useEffect(() => {
    reservasService.obtenerReservas().then(setReservas).catch(console.error);
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Confirma eliminar esta reserva?')) return;
    try {
      await reservasService.eliminarReserva(id);
      setReservas(reservas.filter(r => r.id !== id));
    } catch (e) {
      console.error(e);
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestionar Reservas</h2>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Usuario</th>
            <th className="px-4 py-2 border">Inicio</th>
            <th className="px-4 py-2 border">Fin</th>
            <th className="px-4 py-2 border">Total</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r.id}>
              <td className="px-4 py-2 border">{r.id}</td>
              <td className="px-4 py-2 border">{r.user_id}</td>
              <td className="px-4 py-2 border">{r.fecha_inicio}</td>
              <td className="px-4 py-2 border">{r.fecha_fin}</td>
              <td className="px-4 py-2 border">${r.total_pago}</td>
              <td className="px-4 py-2 border">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleEliminar(r.id)}
                >Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --- Reservas Crear: formulario simple --- */
function ReservasCrear() {
  const [form, setForm] = useState({
    habitacion_id: '',
    cabana_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    total_pago: '',
    porcentaje_pagado: 0.3,
    estado: 'pendiente',
  });
  const [mensaje, setMensaje] = useState('');
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await reservasService.crearReserva(form);
      setMensaje('✅ Reserva creada');
      setForm({ ...form, habitacion_id:'', cabana_id:'', fecha_inicio:'', fecha_fin:'', total_pago:'' });
    } catch (e) {
      console.error(e);
      setMensaje('❌ Error al crear');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Crear Reserva</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label>Habitación ID</label>
          <input
            name="habitacion_id"
            value={form.habitacion_id}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label>Fecha Inicio</label>
          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label>Fecha Fin</label>
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label>Total a pagar</label>
          <input
            name="total_pago"
            value={form.total_pago}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">
          Crear
        </button>
        {mensaje && <p className="mt-2">{mensaje}</p>}
      </form>
    </div>
  );
}

/* --- Reservas Historial: solo lectura --- */
function ReservasHistorial() {
  const [hist, setHist] = useState([]);
  useEffect(() => {
    reservasService.obtenerReservas().then(setHist).catch(console.error);
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Historial de Reservas</h2>
      <ul className="space-y-2">
        {hist.map(r => (
          <li key={r.id} className="p-2 bg-white rounded shadow">
            Reserva #{r.id} - {r.fecha_inicio} → {r.fecha_fin} (${r.total_pago})
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --- Componente Principal --- */
export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const userName = 'Admin';

  let Content;
  switch (activeMenu) {
    case 'reservasGestionar': Content = <ReservasGestionar />; break;
    case 'reservasCrear':    Content = <ReservasCrear />;    break;
    case 'reservasHistorial':Content = <ReservasHistorial />;break;
    default:                  Content = <DashboardContent />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex flex-col flex-1">
        <Header userName={userName} />
        <main className="flex-1 overflow-auto p-6">{Content}</main>
        <Footer />
      </div>
    </div>
  );
}


