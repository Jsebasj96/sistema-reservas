import React, { useState, useEffect } from 'react';
import { obtenerReservas } from '../services/reservaService'; // 🔹 Importa el servicio

// --- Sidebar ---
function Sidebar({ activeMenu, setActiveMenu }) {
  const menuItemClass = (isActive) =>
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
          {/* Puedes mantener el resto del menú igual */}
        </ul>
      </nav>
    </aside>
  );
}

// --- Dashboard ---
function DashboardContent() {
  const ocupacion = [
    { cabana: 'Cabaña 1', habitacion: 'A1', estado: 'Libre' },
    { cabana: 'Cabaña 2', habitacion: 'B3', estado: 'Ocupada' },
    { cabana: 'Cabaña 3', habitacion: 'C2', estado: 'Mantenimiento' },
  ];
  const reservasPendientes = [
    { id: 101, nombre: 'Juan Pérez', fecha: '2025-05-12' },
    { id: 102, nombre: 'María Gómez', fecha: '2025-05-13' },
    { id: 103, nombre: 'Carlos Ruiz', fecha: '2025-05-14' },
  ];
  const ultimosPagos = [
    { id: 201, reserva: 101, monto: 150, fecha: '2025-05-10' },
    { id: 202, reserva: 99, monto: 200, fecha: '2025-05-09' },
    { id: 203, reserva: 98, monto: 120, fecha: '2025-05-09' },
  ];
  const ingresoDiario = 450;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Panel de Control</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ocupación */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-medium mb-2">Ocupación Actual</h3>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="px-2 py-1 border-b">Cabaña</th>
                <th className="px-2 py-1 border-b">Habitación</th>
                <th className="px-2 py-1 border-b">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ocupacion.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1 border-b">{item.cabana}</td>
                  <td className="px-2 py-1 border-b">{item.habitacion}</td>
                  <td className="px-2 py-1 border-b">{item.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reservas Pendientes */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-medium mb-2">Reservas Pendientes</h3>
          <ul className="list-disc list-inside space-y-1">
            {reservasPendientes.map((reserva) => (
              <li key={reserva.id}>
                #{reserva.id} – {reserva.nombre} (Fecha: {reserva.fecha})
              </li>
            ))}
          </ul>
        </div>

        {/* Ingreso diario */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-medium mb-2">Ingresos del día</h3>
          <p className="text-4xl font-bold text-green-600">${ingresoDiario}</p>
        </div>

        {/* Últimos pagos */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-medium mb-2">Últimos Pagos Realizados</h3>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="px-2 py-1 border-b">ID Pago</th>
                <th className="px-2 py-1 border-b">Reserva</th>
                <th className="px-2 py-1 border-b">Monto</th>
                <th className="px-2 py-1 border-b">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ultimosPagos.map((pago) => (
                <tr key={pago.id}>
                  <td className="px-2 py-1 border-b">{pago.id}</td>
                  <td className="px-2 py-1 border-b">{pago.reserva}</td>
                  <td className="px-2 py-1 border-b">${pago.monto}</td>
                  <td className="px-2 py-1 border-b">{pago.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Reservas ---
function ReservasGestionar() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const data = await obtenerReservas();
        setReservas(data);
      } catch (error) {
        console.error('Error al cargar reservas:', error);
      }
    };
    cargarReservas();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Reservas</h2>
      <ul className="list-disc list-inside space-y-1">
        {reservas.length === 0 ? (
          <p>No hay reservas registradas.</p>
        ) : (
          reservas.map((res) => (
            <li key={res.id}>
              #{res.id} – {res.nombre} ({res.fecha})
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function ReservasCrear() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Crear Reserva</h2>
      <p>Aquí puede crear una nueva reserva.</p>
    </div>
  );
}

function ReservasHistorial() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Historial de Reservas</h2>
      <p>Vea el historial completo de reservas.</p>
    </div>
  );
}

// --- Footer ---
function Footer() {
  return (
    <footer className="p-4 bg-gray-50 text-center text-sm text-gray-600 border-t">
      <p>Contacto: admin@labuenavida.com | Tel: (123) 456-7890</p>
      <div className="space-x-2">
        <a href="#" className="hover:underline">
          Política de Privacidad
        </a>{' '}
        |{' '}
        <a href="#" className="hover:underline">
          Términos de Servicio
        </a>
      </div>
      <p className="mt-2">Versión 1.0.0</p>
    </footer>
  );
}

// --- Componente Principal ---
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

// Puedes definir Header aquí o importarlo si ya lo tienes.
function Header({ userName }) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center border-b">
      <h1 className="text-xl font-bold text-gray-800">Admin – Club La Buena Vida</h1>
      <div className="text-sm text-gray-600">Bienvenido, {userName}</div>
    </header>
  );
}
