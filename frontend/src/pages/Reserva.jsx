import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Reserva = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL
                || 'https://sistema-reservas-final.onrender.com';

  const [tipoAlojamiento, setTipoAlojamiento] = useState('habitacion');
  const [habitaciones, setHabitaciones] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [resumenReserva, setResumenReserva] = useState(null); 
  const [imagenComprobante, setImagenComprobante] = useState(null);

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  // Cargar habitaciones o cabañas disponibles
  useEffect(() => {
    if (!user) return;
    const url =
      tipoAlojamiento === 'habitacion'
        ? `${API_URL}/api/habitaciones/disponibles`
        : `${API_URL}/api/cabanas/disponibles`;

    axios.get(url, { withCredentials: true })
      .then(res => {
        if (tipoAlojamiento === 'habitacion') {
          setHabitaciones(Array.isArray(res.data) ? res.data : []);
        } else {
          setCabanas(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(err => {
        if (err.response?.status === 401) navigate('/login');
        else console.error(err);
      });
  }, [tipoAlojamiento, user, navigate, API_URL]);

  // Unificar la lista a mostrar en el select
  const alojamientos = tipoAlojamiento === 'habitacion' ? habitaciones : cabanas;

  // Validaciones Formik
  const ReservaSchema = Yup.object().shape({
    nombreCompleto:     Yup.string().required('Requerido'),
    numeroDocumento:    Yup.string().required('Requerido'),
    correoElectronico:  Yup.string().email('Inválido').required('Requerido'),
    adultos:            Yup.number().min(1).required('Requerido'),
    ninos:              Yup.number().min(0).required('Requerido'),
    numeroDias:         Yup.number().min(1).required('Requerido'),
    fechaEntrada:       Yup.date().required('Requerido'),
    alojamientoId:      Yup.string().required('Requerido'),
    medioPago:          Yup.string().oneOf(['Nequi','Transferencia']).required('Requerido'),
    numeroTransaccion:  Yup.string().required('Requerido'),
  });

  // Envío del formulario
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Buscar el ítem seleccionado
      const item = alojamientos.find(x => x.id === +values.alojamientoId);
      if (!item) throw new Error('Selección inválida');

      const precio = item.precio_por_noche || item.precioPorNoche;
      const total  = precio * values.numeroDias;
      const antic  = total * 0.3;

      // Crear reserva
      const { data: reserva } = await axios.post(
        `${API_URL}/api/reservas`,
        {
          user_id:            user.id,
          alojamiento_id:     item.id,
          fecha_inicio:       values.fechaEntrada,
          fecha_fin:          new Date(
                                new Date(values.fechaEntrada)
                                  .setDate(new Date(values.fechaEntrada).getDate() + +values.numeroDias)
                              ),
          total_pago:         total,
          porcentaje_pagado:  0.3,
          estado:             'Pendiente',
        },
        { withCredentials: true }
      );

      // Crear pago de anticipo
      await axios.post(
        `${API_URL}/api/pagos`,
        {
          reserva_id:           reserva.id,
          monto:                antic,
          medio_pago:           values.medioPago,
          numero_transaccion:   values.numeroTransaccion,
        },
        { withCredentials: true }
      );

      // Mostrar resumen
      setResumenReserva({
        Código:     reserva.id,
        Nombre:     values.nombreCompleto,
        Correo:     values.correoElectronico,
        Entrada:    values.fechaEntrada,
        Noches:     values.numeroDias,
        Alojamiento:`${tipoAlojamiento === 'habitacion' ? `#${item.numero}` : item.nombre}`,
        Anticipo:   antic,
        Pendiente:  total - antic,
      });

      resetForm();
      setImagenComprobante(null);

    } catch (e) {
      console.error(e);
      alert(e.response?.data?.error || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Formulario de Reserva</h1>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
          <Formik
            initialValues={{
              nombreCompleto:    '',
              numeroDocumento:   '',
              correoElectronico: '',
              adultos:           1,
              ninos:             0,
              numeroDias:        1,
              fechaEntrada:      '',
              alojamientoId:     '',
              medioPago:         '',
              numeroTransaccion: '',
            }}
            validationSchema={ReservaSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Tipo de alojamiento: ocupa todo el ancho */}
                <div className="col-span-2">
                  <label className="block mb-1">Tipo Alojamiento</label>
                  <select
                    value={tipoAlojamiento}
                    onChange={e => {
                      setTipoAlojamiento(e.target.value);
                      setFieldValue('alojamientoId', '');
                    }}
                    className="w-full border p-2 rounded"
                  >
                    <option value="habitacion">Habitación</option>
                    <option value="cabana">Cabaña</option>
                  </select>
                </div>

                {/* Campos individuales */}
                {[
                  { name: 'nombreCompleto',    label: 'Nombre Completo',    type: 'text' },
                  { name: 'numeroDocumento',   label: 'Número Documento',   type: 'text' },
                  { name: 'correoElectronico', label: 'Correo Electrónico', type: 'email' },
                  { name: 'adultos',           label: 'Adultos',            type: 'number' },
                  { name: 'ninos',             label: 'Niños',              type: 'number' },
                  { name: 'numeroDias',        label: 'Noches',             type: 'number' },
                  { name: 'fechaEntrada',      label: 'Fecha Entrada',      type: 'date' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block mb-1">{f.label}</label>
                    <Field
                      name={f.name}
                      type={f.type}
                      className="w-full border p-2 rounded"
                    />
                    <ErrorMessage
                      name={f.name}
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                ))}

                {/* Select de alojamientos: ocupa todo el ancho */}
                <div className="col-span-2">
                  <label className="block mb-1">Alojamiento</label>
                  <Field as="select" name="alojamientoId" className="w-full border p-2 rounded">
                    <option value="">-- Seleccione --</option>
                    {alojamientos.map(a => (
                      <option key={a.id} value={a.id}>
                        {tipoAlojamiento === 'habitacion'
                          ? `#${a.numero} – Capacidad: ${a.capacidad} – $${a.precio_por_noche}`
                          : `${a.nombre} – Capacidad: ${a.capacidad} – $${a.precio_por_noche}`
                        }
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="alojamientoId"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Medio de pago */}
                <div>
                  <label className="block mb-1">Medio Pago</label>
                  <Field as="select" name="medioPago" className="w-full border p-2 rounded">
                    <option value="">-- Seleccione --</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Transferencia">Transferencia</option>
                  </Field>
                  <ErrorMessage
                    name="medioPago"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Comprobante de pago (no procesado en este ejemplo) */}
                <div>
                  <label className="block mb-1">Comprobante (imagen)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImagenComprobante(e.currentTarget.files[0])}
                    className="w-full"
                  />
                </div>

                {/* Número de Transacción */}
                <div>
                  <label className="block mb-1"># Transacción</label>
                  <Field
                    name="numeroTransaccion"
                    className="w-full border p-2 rounded"
                  />
                  <ErrorMessage
                    name="numeroTransaccion"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Botón: ocupa todo el ancho */}
                <div className="col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  >
                    {isSubmitting ? 'Procesando…' : 'Realizar Reserva'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Resumen */}
      {resumenReserva && (
        <div className="mt-8 w-full flex justify-center">
          <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            {Object.entries(resumenReserva).map(([k, v]) => (
              <p key={k}>
                <strong>{k}:</strong> {v}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reserva;
