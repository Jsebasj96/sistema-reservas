// src/pages/Reserva.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Reserva = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tipoAlojamiento, setTipoAlojamiento] = useState('habitacion');
  const [habitaciones, setHabitaciones]       = useState([]);
  const [cabanas, setCabanas]                 = useState([]);
  const [resumenReserva, setResumenReserva]   = useState(null);
  const [imagenComprobante, setImagenComprobante] = useState(null);

  // 1) Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  // 2) Cargar datos según tipo
  useEffect(() => {
    if (!user) return;
    const url =
      tipoAlojamiento === 'habitacion'
        ? `${API}/api/habitaciones/disponibles`
        : `${API}/api/cabanas`;

    axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      if (tipoAlojamiento === 'habitacion') {
        setHabitaciones(Array.isArray(res.data) ? res.data : []);
      } else {
        setCabanas(Array.isArray(res.data) ? res.data : []);
      }
    })
    .catch(err => {
      if (err.response?.status === 401) navigate('/login', { replace: true });
      else console.error('Error cargando alojamientos:', err);
    });
  }, [tipoAlojamiento, user, navigate]);

  // 3) Esquema de validación
  const ReservaSchema = Yup.object().shape({
    nombreCompleto:    Yup.string().required('Requerido'),
    numeroDocumento:   Yup.string().required('Requerido'),
    correoElectronico: Yup.string().email('Inválido').required('Requerido'),
    adultos:           Yup.number().min(1).required('Requerido'),
    ninos:             Yup.number().min(0).required('Requerido'),
    numeroDias:        Yup.number().min(1).required('Requerido'),
    fechaEntrada:      Yup.date().required('Requerido'),
    habitacionId:      Yup.string().required('Requerido'),
    medioPago:         Yup.string().oneOf(['Nequi','Transferencia']).required('Requerido'),
    numeroTransaccion: Yup.string().required('Requerido'),
  });

  // 4) Envío de formulario
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const lista = tipoAlojamiento === 'habitacion' ? habitaciones : cabanas;
      const item  = lista.find(x => x.id === +values.habitacionId);
      if (!item) throw new Error('Selección inválida');

      // Asumimos que ambos modelos ahora tienen precio_por_noche
      const precio = item.precio_por_noche;
      const total  = precio * values.numeroDias;
      const antic  = total * 0.3;

      // Crear reserva
      const { data: reserva } = await axios.post(
        `${API}/api/reservas`,
        {
          cliente_id:        user.id,
          fecha_inicio:      values.fechaEntrada,
          fecha_fin:         new Date(
                               new Date(values.fechaEntrada)
                                 .setDate(new Date(values.fechaEntrada).getDate() + +values.numeroDias)
                             ),
          total_pago:        total,
          porcentaje_pagado: 0.3,
          estado:            'Pendiente',
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Subir comprobante si existe
      if (imagenComprobante) {
        const formData = new FormData();
        formData.append('imagen', imagenComprobante);
        await axios.post(
          `${API}/api/reservas/${reserva.id}/comprobante`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      // Crear pago anticipado
      await axios.post(
        `${API}/api/pagos`,
        {
          reserva_id:       reserva.id,
          monto:            antic,
          medio_pago:       values.medioPago,
          numero_transaccion: values.numeroTransaccion,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Mostrar resumen
      setResumenReserva({
        código:      reserva.id,
        nombre:      values.nombreCompleto,
        correo:      values.correoElectronico,
        entrada:     values.fechaEntrada,
        noches:      values.numeroDias,
        alojamiento: tipoAlojamiento === 'habitacion'
                       ? `Habitación #${item.numero}`
                       : item.nombre,
        anticipo:    antic,
        pendiente:   total - antic
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
        <div className="w-1/3 min-w-[320px] bg-white p-6 rounded-lg shadow">
          <Formik
            initialValues={{
              nombreCompleto:    '',
              numeroDocumento:   '',
              correoElectronico: '',
              adultos:           1,
              ninos:             0,
              numeroDias:        1,
              fechaEntrada:      '',
              habitacionId:      '',
              medioPago:         '',
              numeroTransaccion: '',
            }}
            validationSchema={ReservaSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4">

                {/* 1) Selector de tipo */}
                <div>
                  <label className="block mb-1">Tipo Alojamiento</label>
                  <select
                    value={tipoAlojamiento}
                    onChange={e => {
                      setTipoAlojamiento(e.target.value);
                      setFieldValue('habitacionId', '');
                    }}
                    className="w-full border p-2 rounded"
                  >
                    <option value="habitacion">Habitación</option>
                    <option value="cabana">Cabaña</option>
                  </select>
                </div>

                {/* 2) Campos básicos */}
                {[
                  { name: 'nombreCompleto',    label: 'Nombre Completo',    type: 'text' },
                  { name: 'numeroDocumento',   label: 'Número Documento',   type: 'text' },
                  { name: 'correoElectronico', label: 'Correo Electrónico', type: 'email' },
                  { name: 'adultos',           label: 'Adultos',            type: 'number' },
                  { name: 'ninos',             label: 'Niños',              type: 'number' },
                  { name: 'numeroDias',        label: 'Número de Días',     type: 'number' },
                  { name: 'fechaEntrada',      label: 'Fecha de Entrada',   type: 'date' },
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

                {/* 3) Selector dinámico de alojamiento */}
                <div>
                  <label className="block mb-1">Alojamiento</label>
                  <Field as="select" name="habitacionId" className="w-full border p-2 rounded">
                    <option value="">-- Seleccione --</option>
                    {tipoAlojamiento === 'habitacion'
                      ? habitaciones.map(h => (
                          <option key={h.id} value={h.id}>
                            #{h.numero} – Cap:{h.capacidad} – ${h.precio_por_noche}
                          </option>
                        ))
                      : cabanas.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.nombre} – Cap:{c.capacidad} – ${c.precio_por_noche}
                          </option>
                        ))
                    }
                  </Field>
                  <ErrorMessage
                    name="habitacionId"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* 4) Medio, comprobante y transacción */}
                <div>
                  <label className="block mb-1">Medio de Pago</label>
                  <Field as="select" name="medioPago" className="w-full border p-2 rounded">
                    <option value="">-- Seleccione --</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Transferencia">Transferencia</option>
                  </Field>
                  <ErrorMessage name="medioPago" component="div" className="text-red-600" />
                </div>
                <div>
                  <label className="block mb-1">Comprobante (imagen)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImagenComprobante(e.currentTarget.files[0])}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1"># Transacción</label>
                  <Field name="numeroTransaccion" className="w-full border p-2 rounded" />
                  <ErrorMessage
                    name="numeroTransaccion"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* 5) Botón */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  {isSubmitting ? 'Procesando…' : 'Realizar Reserva'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Resumen */}
      {resumenReserva && (
        <div className="mt-8 w-full flex justify-center">
          <div className="w-2/3 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            {Object.entries(resumenReserva).map(([k, v]) => (
              <p key={k} className="mb-1">
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
