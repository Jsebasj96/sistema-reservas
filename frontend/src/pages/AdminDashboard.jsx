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
      {/* Logo y nombre del club */}
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo La Buena Vida" className="h-8 w-8" />
        <span className="text-xl font-semibold">Club La Buena Vida</span>
      </div>
      {/* Nombre de usuario, fecha/hora, iconos */}
      <div className="flex items-center space-x-4">
        <span className="hidden md:inline text-gray-700">Hola, {userName}</span>
        <span className="text-gray-600">
          {currentTime.toLocaleDateString('es-ES')} {currentTime.toLocaleTimeString('es-ES')}
        </span>
        <button className="p-2 hover:bg-gray-100 rounded-full" aria-label="Configuración">
          ⚙️
        </button>
        <button className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

/* --- Sidebar: Menú lateral con navegación --- */
function Sidebar({ activeMenu, setActiveMenu }) {
  const menuItemClass = isActive =>
    isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600';

  return (
    <aside className="w-64 bg-white border-r overflow-y-auto">
      <nav className="p-4">
        <ul>
          <li className="mb-2">
            <button
              className={`w-full text-left py-2 ${menuItemClass(activeMenu === 'dashboard')}`}
              onClick={() => setActiveMenu('dashboard')}
            >
              Panel de Control
            </button>
          </li>

          {/* Reservas */}
          <li className="mb-1 font-semibold">Reservas</li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'reservasGestionar')}`}
              onClick={() => setActiveMenu('reservasGestionar')}
            >
              Gestionar
            </button>
          </li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'reservasCrear')}`}
              onClick={() => setActiveMenu('reservasCrear')}
            >
              Crear
            </button>
          </li>
          <li className="ml-4 mb-4">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'reservasHistorial')}`}
              onClick={() => setActiveMenu('reservasHistorial')}
            >
              Historial
            </button>
          </li>

          {/* Cabañas y Habitaciones */}
          <li className="mb-1 font-semibold">Cabañas y Habitaciones</li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'habitacionesEstado')}`}
              onClick={() => setActiveMenu('habitacionesEstado')}
            >
              Estado
            </button>
          </li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'habitacionesAsignar')}`}
              onClick={() => setActiveMenu('habitacionesAsignar')}
            >
              Asignar
            </button>
          </li>
          <li className="ml-4 mb-4">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'habitacionesHistorial')}`}
              onClick={() => setActiveMenu('habitacionesHistorial')}
            >
              Historial
            </button>
          </li>

          {/* Servicios */}
          <li className="mb-1 font-semibold">Servicios</li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'serviciosDesayunos')}`}
              onClick={() => setActiveMenu('serviciosDesayunos')}
            >
              Desayunos
            </button>
          </li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'serviciosAlmuerzos')}`}
              onClick={() => setActiveMenu('serviciosAlmuerzos')}
            >
              Almuerzos
            </button>
          </li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'serviciosBar')}`}
              onClick={() => setActiveMenu('serviciosBar')}
            >
              Bar
            </button>
          </li>
          <li className="ml-4 mb-4">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'serviciosPiscina')}`}
              onClick={() => setActiveMenu('serviciosPiscina')}
            >
              Piscina / Pasadía
            </button>
          </li>

          {/* Inventarios */}
          <li className="mb-1 font-semibold">Inventarios</li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'inventarioAlimentos')}`}
              onClick={() => setActiveMenu('inventarioAlimentos')}
            >
              Alimentos / Bebidas
            </button>
          </li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'inventarioHabitacion')}`}
              onClick={() => setActiveMenu('inventarioHabitacion')}
            >
              Implementos Habitaciones
            </button>
          </li>
          <li className="ml-4 mb-4">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'inventarioMesa')}`}
              onClick={() => setActiveMenu('inventarioMesa')}
            >
              Servicios de Mesa
            </button>
          </li>

          {/* Finanzas */}
          <li className="mb-1 font-semibold">Finanzas</li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'finanzasIngresos')}`}
              onClick={() => setActiveMenu('finanzasIngresos')}
            >
              Ingresos
            </button>
          </li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'finanzasPendientes')}`}
              onClick={() => setActiveMenu('finanzasPendientes')}
            >
              Pagos pendientes
            </button>
          </li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'finanzasRegistro')}`}
              onClick={() => setActiveMenu('finanzasRegistro')}
            >
              Registro de pagos
            </button>
          </li>
          <li className="ml-4 mb-4">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'finanzasReportes')}`}
              onClick={() => setActiveMenu('finanzasReportes')}
            >
              Reportes financieros
            </button>
          </li>

          {/* Eventos y Alquileres */}
          <li className="mb-1 font-semibold">Eventos y Alquileres</li>
          <li className="ml-4 mb-2">…</li>
          {/* etc. */}
        </ul>
      </nav>
    </aside>
  );
}

/* --- Footer: Contacto, enlaces, versión --- */
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

/* --- Contenido general --- */
function DashboardContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Panel de Control</h2>
      <p>Vista general del sistema.</p>
    </div>
  );
}

/* --- 1) Gestión de Reservas --- */
function ReservasGestionar() {
  const [reservas, setReservas] = useState([]);
  useEffect(() => {
    reservasService.obtenerReservas()
      .then(list => setReservas(list))
      .catch(err => console.error(err));
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta reserva?')) return;
    try {
      await reservasService.eliminarReserva(id);
      setReservas(reservas.filter(r => r.id !== id));
    } catch (e) {
      console.error(e);
      alert('Error al eliminar reserva');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Reservas</h2>
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
                  onClick={() => handleEliminar(r.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --- 2) Crear Reserva --- */
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

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await reservasService.crearReserva(form);
      setMensaje('✅ Reserva creada con éxito');
      setForm({ ...form, habitacion_id:'', cabana_id:'', fecha_inicio:'', fecha_fin:'', total_pago:'' });
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al crear la reserva');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Crear Reserva</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <div>
          <label>Habitación ID</label>
          <input
            name="habitacion_id"
            value={form.habitacion_id}
            onChange={onChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label>Cabaña ID (si aplica)</label>
          <input
            name="cabana_id"
            value={form.cabana_id}
            onChange={onChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label>Fecha Inicio</label>
          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={onChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label>Fecha Fin</label>
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={onChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label>Total a pagar</label>
          <input
            name="total_pago"
            value={form.total_pago}
            onChange={onChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">
          Crear Reserva
        </button>
        {mensaje && <p className="mt-2">{mensaje}</p>}
      </form>
    </div>
  );
}

/* --- 3) Historial de Reservas --- */
function ReservasHistorial() {
  const [historial, setHistorial] = useState([]);
  useEffect(() => {
    reservasService.obtenerReservas()
      .then(list => setHistorial(list))
      .catch(console.error);
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Historial de Reservas</h2>
      <ul className="space-y-2">
        {historial.map(r => (
          <li key={r.id} className="p-2 bg-white rounded shadow">
            Reserva #{r.id} – {r.fecha_inicio} → {r.fecha_fin} (${r.total_pago})
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --- Componente Principal: integra todo --- */
export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const userName = 'Admin';

  let ContentComponent;
  switch (activeMenu) {
    case 'reservasGestionar':
      ContentComponent = <ReservasGestionar />;
      break;
    case 'reservasCrear':
      ContentComponent = <ReservasCrear />;
      break;
    case 'reservasHistorial':
      ContentComponent = <ReservasHistorial />;
      break;
    default:
      ContentComponent = <DashboardContent />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex flex-col flex-1">
        <Header userName={userName} />
        <main className="flex-1 overflow-auto p-6">{ContentComponent}</main>
        <Footer />
      </div>
    </div>
  );
}


