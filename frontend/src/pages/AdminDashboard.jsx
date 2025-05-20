// src/pages/AdminDashboard.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
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
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || '';

  const [tipoAlojamiento, setTipoAlojamiento] = useState('habitacion');
  const [habitaciones, setHabitaciones] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [resumenReserva, setResumenReserva] = useState(null);
  const [imagenComprobante, setImagenComprobante] = useState(null);

  // redirigir si no hay user
  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  // cargar disponibles
  useEffect(() => {
    if (!user) return;
    const url = tipoAlojamiento==='habitacion'
      ? `${API_URL}/api/habitaciones/disponibles`
      : `${API_URL}/api/cabanas/disponibles`;
    axios.get(url, { withCredentials:true })
      .then(res => {
        tipoAlojamiento==='habitacion'
          ? setHabitaciones(Array.isArray(res.data)?res.data:[])
          : setCabanas(Array.isArray(res.data)?res.data:[]);
      })
      .catch(err => console.error(err));
  }, [tipoAlojamiento, user, API_URL]);

  const alojamientos = tipoAlojamiento==='habitacion' ? habitaciones : cabanas;

  const ReservaSchema = Yup.object().shape({
    nombreCompleto: Yup.string().required('Requerido'),
    numeroDocumento: Yup.string().required('Requerido'),
    correoElectronico: Yup.string().email('Inválido').required('Requerido'),
    adultos: Yup.number().min(1).required('Requerido'),
    ninos: Yup.number().min(0).required('Requerido'),
    numeroDias: Yup.number().min(1).required('Requerido'),
    fechaEntrada: Yup.date().required('Requerido'),
    alojamientoId: Yup.string().required('Requerido'),
    medioPago: Yup.string().oneOf(['Nequi','Transferencia']).required('Requerido'),
    numeroTransaccion: Yup.string().required('Requerido'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const item = alojamientos.find(x => x.id===+values.alojamientoId);
      if (!item) throw new Error('Selección inválida');
      const precio = item.precio_por_noche || item.precioPorNoche;
      const total = precio * values.numeroDias;
      const antic = total * 0.3;
      let reservaPayload = {
        fecha_inicio: values.fechaEntrada,
        fecha_fin: new Date(new Date(values.fechaEntrada)
          .setDate(new Date(values.fechaEntrada).getDate()+values.numeroDias)),
        total_pago: total,
        porcentaje_pagado: 0.3,
        estado: 'pendiente',
      };
      if (tipoAlojamiento==='habitacion') reservaPayload.habitacion_id = item.id;
      else reservaPayload.cabana_id = item.id;

      // crear reserva
      const { data: reserva } = await axios.post(
        `${API_URL}/api/reservas`, reservaPayload,
        { withCredentials:true }
      );
      // crear pago anticipo
      await axios.post(
        `${API_URL}/api/pagos`,
        { reservaId: reserva.id, monto: antic, tipoPago: values.medioPago },
        { withCredentials:true }
      );
      // resumen
      setResumenReserva({
        Código: reserva.id,
        Nombre: values.nombreCompleto,
        Correo: values.correoElectronico,
        Entrada: values.fechaEntrada,
        Noches: values.numeroDias,
        Alojamiento: tipoAlojamiento==='habitacion'
          ? `#${item.numero}` : item.nombre,
        Anticipo: antic,
        Pendiente: total-antic,
      });
      resetForm();
      setImagenComprobante(null);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.error||e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Crear Reserva</h2>
      <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow">
        <Formik
          initialValues={{
            nombreCompleto:'', numeroDocumento:'', correoElectronico:'',
            adultos:1, ninos:0, numeroDias:1, fechaEntrada:'',
            alojamientoId:'', medioPago:'', numeroTransaccion:''
          }}
          validationSchema={ReservaSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo alojamiento */}
              <div className="col-span-2">
                <label className="block mb-1">Tipo Alojamiento</label>
                <select
                  value={tipoAlojamiento}
                  onChange={e => {
                    setTipoAlojamiento(e.target.value);
                    setFieldValue('alojamientoId','');
                  }}
                  className="w-full border p-2 rounded"
                >
                  <option value="habitacion">Habitación</option>
                  <option value="cabana">Cabaña</option>
                </select>
              </div>
              {[
                {name:'nombreCompleto',label:'Nombre Completo',type:'text'},
                {name:'numeroDocumento',label:'Documento',type:'text'},
                {name:'correoElectronico',label:'Correo Electrónico',type:'email'},
                {name:'adultos',label:'Adultos',type:'number'},
                {name:'ninos',label:'Niños',type:'number'},
                {name:'numeroDias',label:'Noches',type:'number'},
                {name:'fechaEntrada',label:'Fecha Entrada',type:'date'}
              ].map(f=>(
                <div key={f.name}>
                  <label className="block mb-1">{f.label}</label>
                  <Field name={f.name} type={f.type} className="w-full border p-2 rounded"/>
                  <ErrorMessage name={f.name} component="div" className="text-red-600 text-sm"/>
                </div>
              ))}
              {/* Alojamiento */}
              <div className="col-span-2">
                <label className="block mb-1">Alojamiento</label>
                <Field as="select" name="alojamientoId" className="w-full border p-2 rounded">
                  <option value="">-- Seleccione --</option>
                  {alojamientos.map(a=>(
                    <option key={a.id} value={a.id}>
                      {tipoAlojamiento==='habitacion'
                        ? `#${a.numero} – $${a.precio_por_noche}`
                        : `${a.nombre} – $${a.precio_por_noche}`}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="alojamientoId" component="div" className="text-red-600 text-sm"/>
              </div>
              {/* Medio pago + transacción */}
              <div>
                <label className="block mb-1">Medio Pago</label>
                <Field as="select" name="medioPago" className="w-full border p-2 rounded">
                  <option value="">-- Seleccione --</option>
                  <option value="Nequi">Nequi</option>
                  <option value="Transferencia">Transferencia</option>
                </Field>
                <ErrorMessage name="medioPago" component="div" className="text-red-600 text-sm"/>
              </div>
              <div>
                <label className="block mb-1"># Transacción</label>
                <Field name="numeroTransaccion" className="w-full border p-2 rounded"/>
                <ErrorMessage name="numeroTransaccion" component="div" className="text-red-600 text-sm"/>
              </div>
              {/* Comprobante */}
              <div>
                <label className="block mb-1">Comprobante</label>
                <input
                  type="file" accept="image/*"
                  onChange={e=>setImagenComprobante(e.currentTarget.files[0])}
                  className="w-full"
                />
              </div>
              {/* Botón */}
              <div className="col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  {isSubmitting ? 'Procesando…' : 'Realizar Reserva'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Resumen */}
      {resumenReserva && (
        <div className="mt-8 w-full flex justify-center">
          <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            {Object.entries(resumenReserva).map(([k,v])=>(
              <p key={k}><strong>{k}:</strong> {v}</p>
            ))}
          </div>
        </div>
      )}
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

// ------------- HabitacionesEstado -------------
function HabitacionesEstado() {
  const [habitaciones, setHabitaciones] = useState([]);
  // obtenemos también cabañas
  const [cabanas, setCabanas] = useState([]);

  useEffect(() => {
    axios.get('/api/habitaciones', { withCredentials:true })
      .then(r => setHabitaciones(r.data))
      .catch(console.error);
    axios.get('/api/cabanas', { withCredentials:true })
      .then(r => setCabanas(r.data))
      .catch(console.error);
  }, []);

  const asignarLimpieza = (tipo, id) => {
    alert(`Limpieza de ${tipo} #${id} asignada a Empleado X`);
  };

  const renderTable = (items, label) => (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-2">{label}</h3>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 border">ID</th>
            <th className="px-3 py-2 border">{label === 'Habitaciones' ? 'Nro.' : 'Nombre'}</th>
            <th className="px-3 py-2 border">Estado</th>
            <th className="px-3 py-2 border">Acción</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td className="px-3 py-2 border">{it.id}</td>
              <td className="px-3 py-2 border">{it.numero || it.nombre}</td>
              <td className="px-3 py-2 border">{it.estado || 'Libre'}</td>
              <td className="px-3 py-2 border">
                <button
                  onClick={() => asignarLimpieza(label.toLowerCase(), it.id)}
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >Asignar Limpieza</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Estado de Habitaciones y Cabañas</h2>
      {renderTable(habitaciones, 'Habitaciones')}
      {renderTable(cabanas, 'Cabañas')}
    </div>
  );
}

// ------------- HabitacionesAsignar -------------
// Para este ejemplo es idéntico a HabitacionesEstado:
const HabitacionesAsignar = HabitacionesEstado;

// ------------- HabitacionesHistorial -------------
function HabitacionesHistorial() {
  const [unitId, setUnitId] = useState('');
  const [tipo, setTipo] = useState('habitacion');
  const [historial, setHistorial] = useState([]);

  const fetchHistorial = () => {
    axios.get(`/api/reservas?${tipo}_id=${unitId}`, { withCredentials:true })
      .then(r => setHistorial(r.data.reservas || r.data))
      .catch(console.error);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Historial de Reservas por Unidad</h2>
      <div className="flex items-center space-x-4 mb-4">
        <select value={tipo} onChange={e=>setTipo(e.target.value)} className="border p-2 rounded">
          <option value="habitacion">Habitación</option>
          <option value="cabana">Cabaña</option>
        </select>
        <input
          type="number" placeholder="ID unidad"
          value={unitId} onChange={e=>setUnitId(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={fetchHistorial} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Ver Historial
        </button>
      </div>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 border">Reserva ID</th>
            <th className="px-3 py-2 border">Fecha Inicio</th>
            <th className="px-3 py-2 border">Fecha Fin</th>
            <th className="px-3 py-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {historial.map(r => (
            <tr key={r.id}>
              <td className="px-3 py-2 border">{r.id}</td>
              <td className="px-3 py-2 border">{r.fecha_inicio}</td>
              <td className="px-3 py-2 border">{r.fecha_fin}</td>
              <td className="px-3 py-2 border">${r.total_pago}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
    case 'habitacionesEstado':  Content = <HabitacionesEstado />; break;
    case 'habitacionesAsignar': Content = <HabitacionesAsignar />;break;
    case 'habitacionesHistorial':Content = <HabitacionesHistorial />;break;
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


