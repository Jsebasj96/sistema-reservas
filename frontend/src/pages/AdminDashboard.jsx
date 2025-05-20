// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { reservasService } from '../services/reservasService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

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
    reservasService.obtenerReservas().then(setReservas).catch(console.error);
  }, []);
  const onDelete = async id => {
    if (!window.confirm('¿Eliminar esta reserva?')) return;
    try {
      await reservasService.eliminarReserva(id);
      setReservas(r => r.filter(x => x.id !== id));
    } catch (e) { alert(e.message); }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Reservas</h2>
      <table className="min-w-full bg-white shadow rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            {['ID','User','Hab/Cabaña','Inicio','Fin','Total','Acciones'].map(h=>(
              <th key={h} className="px-4 py-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r.id} className="border-t">
              <td className="px-4 py-2">{r.id}</td>
              <td className="px-4 py-2">{r.user_id}</td>
              <td className="px-4 py-2">{r.habitacion_id || r.cabana_id}</td>
              <td className="px-4 py-2">{new Date(r.fecha_inicio).toLocaleDateString()}</td>
              <td className="px-4 py-2">{new Date(r.fecha_fin).toLocaleDateString()}</td>
              <td className="px-4 py-2">${r.total_pago}</td>
              <td className="px-4 py-2">
                <button
                  onClick={()=>onDelete(r.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
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
  const schema = Yup.object().shape({
    fechaEntrada: Yup.date().required('Requerido'),
    numeroDias: Yup.number().min(1).required('Requerido'),
    tipo: Yup.string().oneOf(['habitacion','cabana']).required(),
    alojamientoId: Yup.number().required('Requerido'),
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Crear Reserva</h2>
      <Formik
        initialValues={{
          fechaEntrada: '',
          numeroDias: 1,
          tipo: 'habitacion',
          alojamientoId: '',
        }}
        validationSchema={schema}
        onSubmit={async (vals, { resetForm, setSubmitting }) => {
          try {
            const inicio = vals.fechaEntrada;
            const fin = new Date(
              new Date(inicio).setDate(new Date(inicio).getDate() + vals.numeroDias)
            );
            // aquí puedes sustituir precio fijo o calcular dinámico:
            const total = 100000 * vals.numeroDias;

            await reservasService.crearReserva({
              fecha_inicio: inicio,
              fecha_fin: fin,
              total_pago: total,
              porcentaje_pagado: 0.3,
              estado: 'pendiente',
              [vals.tipo === 'habitacion' ? 'habitacion_id' : 'cabana_id']: vals.alojamientoId,
            });

            alert('✅ Reserva creada con éxito');
            resetForm();
          } catch (e) {
            alert(`❌ ${e.message}`);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow">
            {[
              { name: 'fechaEntrada', label: 'Fecha Entrada', type: 'date' },
              { name: 'numeroDias', label: 'Noches', type: 'number' },
            ].map((f) => (
              <div key={f.name}>
                <label className="block mb-1 font-medium">{f.label}</label>
                <Field name={f.name} type={f.type} className="w-full border p-2 rounded" />
                <ErrorMessage name={f.name} component="div" className="text-red-500 text-sm" />
              </div>
            ))}

            <div className="col-span-2">
              <label className="block mb-1 font-medium">Tipo</label>
              <Field as="select" name="tipo" className="w-full border p-2 rounded">
                <option value="habitacion">Habitación</option>
                <option value="cabana">Cabaña</option>
              </Field>
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-medium">ID Alojamiento</label>
              <Field
                name="alojamientoId"
                type="number"
                className="w-full border p-2 rounded"
              />
              <ErrorMessage
                name="alojamientoId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              {isSubmitting ? 'Guardando…' : 'Crear Reserva'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

/* --- 3) Historial de Reservas --- */
function ReservasHistorial() {
  const [reservas, setReservas] = useState([]);
  useEffect(() => {
    reservasService.obtenerReservas().then(setReservas).catch(console.error);
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Historial de Reservas</h2>
      <ul className="bg-white shadow rounded p-4 space-y-2">
        {reservas.map(r => (
          <li key={r.id} className="border-b py-2">
            <strong>#{r.id}</strong> {new Date(r.fecha_inicio).toLocaleDateString()} –{' '}
            {new Date(r.fecha_fin).toLocaleDateString()} (${r.total_pago})
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


