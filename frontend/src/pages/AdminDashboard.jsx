// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  obtenerReservas,
  crearReserva,
  eliminarReserva,
} from '../services/reservaService'; // Ajusta ruta si es necesario

/* --- Header --- */
function Header({ userName }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="h-8 w-8"/>
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
          {['Gestionar', 'Crear', 'Historial'].map(section => (
            <li key={section} className="ml-4 mb-2">
              <button
                className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'reservas' + section)}`}
                onClick={() => setActiveMenu('reservas' + section)}
              >
                {section}
              </button>
            </li>
          ))}

          {/* Aquí puedes añadir más secciones del menú */}
        </ul>
      </nav>
    </aside>
  );
}

/* --- DashboardContent --- */
function DashboardContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Panel de Control</h2>
      {/* Tus widgets actuales */}
      <p>Bienvenido al panel de administración.</p>
    </div>
  );
}

/* --- ReservasGestionar --- */
function ReservasGestionar() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerReservas();
        setReservas(data.reservas || data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar esta reserva?')) return;
    try {
      await eliminarReserva(id);
      setReservas(r => r.filter(x => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Reservas</h2>
      {reservas.length === 0 ? (
        <p>No hay reservas.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Inicio</th>
              <th className="px-4 py-2">Fin</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map(r => (
              <tr key={r.id} className="border-b">
                <td className="px-4 py-2">{r.id}</td>
                <td className="px-4 py-2">{r.user_id}</td>
                <td className="px-4 py-2">{new Date(r.fecha_inicio).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(r.fecha_fin).toLocaleDateString()}</td>
                <td className="px-4 py-2">${r.total_pago}</td>
                <td className="px-4 py-2">
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(r.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* --- ReservasCrear --- */
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

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await crearReserva(form);
      setMensaje('✅ Reserva creada');
      setForm({
        habitacion_id: '',
        cabana_id: '',
        fecha_inicio: '',
        fecha_fin: '',
        total_pago: '',
        porcentaje_pagado: 0.3,
        estado: 'pendiente',
      });
    } catch {
      setMensaje('❌ Error creando reserva');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Crear Reserva</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4 bg-white p-6 shadow rounded">
        <div>
          <label className="block">Habitación ID</label>
          <input
            type="number"
            name="habitacion_id"
            value={form.habitacion_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block">Cabaña ID</label>
          <input
            type="number"
            name="cabana_id"
            value={form.cabana_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block">Fecha Inicio</label>
          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block">Fecha Fin</label>
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block">Total Pago</label>
          <input
            type="number"
            name="total_pago"
            value={form.total_pago}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Crear
        </button>
        {mensaje && <p className="mt-2">{mensaje}</p>}
      </form>
    </div>
  );
}

/* --- ReservasHistorial --- */
function ReservasHistorial() {
  const [historial, setHistorial] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerReservas();
        setHistorial(data.reservas || data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Historial de Reservas</h2>
      <ul className="list-disc list-inside space-y-1">
        {historial.map(r => (
          <li key={r.id}>
            #{r.id} — Usuario {r.user_id} — {new Date(r.fecha_inicio).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
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

/* --- Componente Principal --- */
export default function AdminPanel() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const userName = 'Admin';

  let ContentComponent;
  switch (activeMenu) {
    case 'dashboard':
      ContentComponent = <DashboardContent />;
      break;
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


