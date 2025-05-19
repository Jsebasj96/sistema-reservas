import React, { useState, useEffect } from 'react';

/* --- Header: Logo, nombre de usuario, fecha/hora, configuración, cerrar sesión --- */
function Header({ userName }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Actualiza la hora cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
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
        {/* Icono de configuración (reemplazar emoji por SVG si se desea) */}
        <button className="p-2 hover:bg-gray-100 rounded-full" aria-label="Configuración">
          ⚙️
        </button>
        {/* Botón cerrar sesión */}
        <button className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

/* --- Sidebar: Menú lateral con navegación --- */
function Sidebar({ activeMenu, setActiveMenu }) {
  // Clases para elemento activo
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
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'eventosGestion')}`}
              onClick={() => setActiveMenu('eventosGestion')}
            >
              Gestión
            </button>
          </li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'eventosDisponibilidad')}`}
              onClick={() => setActiveMenu('eventosDisponibilidad')}
            >
              Disponibilidad
            </button>
          </li>
          <li className="ml-4 mb-4">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'eventosCostos')}`}
              onClick={() => setActiveMenu('eventosCostos')}
            >
              Costos
            </button>
          </li>
          {/* Consultas Rápidas */}
          <li className="mb-1 font-semibold">Consultas Rápidas</li>
          <li className="ml-4 mb-2">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'consultasReserva')}`}
              onClick={() => setActiveMenu('consultasReserva')}
            >
              Buscar reserva
            </button>
          </li>
          <li className="ml-4">
            <button
              className={`w-full text-left py-1 ${menuItemClass(activeMenu === 'consultasConsumo')}`}
              onClick={() => setActiveMenu('consultasConsumo')}
            >
              Consultar consumo
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

/* --- Contenido del Dashboard (Panel de Control por defecto) --- */
function DashboardContent() {
  // Datos de ejemplo para ocupación y pagos
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
  const ingresoDiario = 450; // Ejemplo de ingresos del día

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Panel de Control</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ocupación actual (tabla) */}
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
        {/* Reservas pendientes */}
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
        {/* Ingresos diarios */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-medium mb-2">Ingresos del día</h3>
          <p className="text-4xl font-bold text-green-600">${ingresoDiario}</p>
        </div>
        {/* Últimos pagos realizados */}
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

/* --- Contenidos para cada sección (a modo de ejemplo) --- */
function ReservasGestionar() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Reservas</h2>
      <p>Aquí puede gestionar las reservas existentes.</p>
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

/* --- Footer: Contacto, enlaces, versión --- */
function Footer() {
  return (
    <footer className="p-4 bg-gray-50 text-center text-sm text-gray-600 border-t">
      <p>Contacto: admin@labuenavida.com | Tel: (123) 456-7890</p>
      <div className="space-x-2">
        <a href="#" className="hover:underline">Política de Privacidad</a> | 
        <a href="#" className="hover:underline">Términos de Servicio</a>
      </div>
      <p className="mt-2">Versión 1.0.0</p>
    </footer>
  );
}

/* --- Componente Principal: integra Header, Sidebar, Main Content y Footer --- */
export default function AdminPanel() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const userName = 'Admin'; // Cambiar al nombre real según contexto

  // Elige el componente de contenido según la sección activa
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
    // Agregar más casos para cada menú según sea necesario
    default:
      ContentComponent = <DashboardContent />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar con menú */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Contenedor principal (header + contenido + footer) */}
      <div className="flex flex-col flex-1">
        <Header userName={userName} />
        <main className="flex-1 overflow-auto p-6">{ContentComponent}</main>
        <Footer />
      </div>
    </div>
  );
}

