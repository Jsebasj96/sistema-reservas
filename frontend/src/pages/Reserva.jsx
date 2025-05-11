// src/pages/Reserva.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // instancia con interceptor de token
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Reserva = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [habitaciones, setHabitaciones] = useState([]);
  const [resumenReserva, setResumenReserva] = useState(null);
  const [imagenComprobante, setImagenComprobante] = useState(null);

  // 1) Redirect si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // 2) Cargar habitaciones disponibles
  useEffect(() => {
    if (!user) return;
    axiosInstance
      .get('/habitaciones/disponibles')
      .then(res => {
        // Aseguramos que sea array
        const data = Array.isArray(res.data) ? res.data : [];
        setHabitaciones(data);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          // token inválido o expirado
          navigate('/login', { replace: true });
        } else {
          console.error('Error cargando habitaciones:', err);
          setHabitaciones([]);
        }
      });
  }, [user, navigate]);

  // 3) Esquema Formik
  const ReservaSchema = Yup.object().shape({
    nombreCompleto: Yup.string().required('Requerido'),
    numeroDocumento: Yup.string().required('Requerido'),
    correoElectronico: Yup.string().email('Correo inválido').required('Requerido'),
    adultos: Yup.number().min(1).required('Requerido'),
    ninos: Yup.number().min(0).required('Requerido'),
    numeroDias: Yup.number().min(1).required('Requerido'),
    fechaEntrada: Yup.date().required('Requerido'),
    habitacionId: Yup.string().required('Requerido'),
    medioPago: Yup.string().oneOf(['Nequi','Transferencia']).required('Requerido'),
    numeroTransaccion: Yup.string().required('Requerido'),
  });

  // 4) Submit reserva
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Calcular montos
      const habit = habitaciones.find(h => h.id === +values.habitacionId);
      if (!habit) throw new Error('Habitación no válida');
      const montoTotal = habit.precioPorNoche * values.numeroDias;
      const montoAnticipado = montoTotal * 0.3;
      // Crear reserva
      const resReserva = await axiosInstance.post('/reservas', {
        cliente_id: user.id,
        fecha_inicio: values.fechaEntrada,
        fecha_fin: new Date(new Date(values.fechaEntrada).setDate(
          new Date(values.fechaEntrada).getDate() + +values.numeroDias
        )),
        total_pago: montoTotal,
        porcentaje_pagado: 0.3,
        estado: 'Pendiente',
      });
      const reservaId = resReserva.data.id;
      // Subir comprobante si existe
      if (imagenComprobante) {
        const formData = new FormData();
        formData.append('imagen', imagenComprobante);
        await axiosInstance.post(`/reservas/${reservaId}/comprobante`, formData);
      }
      // Crear pago anticipado
      await axiosInstance.post('/pagos', {
        reserva_id: reservaId,
        monto: montoAnticipado,
        medio_pago: values.medioPago,
        numero_transaccion: values.numeroTransaccion,
      });
      // Mostrar resumen
      setResumenReserva({
        codigoReserva: reservaId,
        nombre: values.nombreCompleto,
        correo: values.correoElectronico,
        fechaEntrada: values.fechaEntrada,
        numeroDias: values.numeroDias,
        habitacion: habit.nombre,
        montoAnticipado,
        montoRestante: montoTotal - montoAnticipado,
        estadoPago: '30% pagado / 70% pendiente',
      });
      resetForm();
      setImagenComprobante(null);
    } catch (err) {
      console.error('Error al crear reserva:', err);
      alert(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 5) Render
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Formulario de Reserva</h1>

      <Formik
        initialValues={{
          nombreCompleto: '',
          numeroDocumento: '',
          correoElectronico: '',
          adultos: 1,
          ninos: 0,
          numeroDias: 1,
          fechaEntrada: '',
          habitacionId: '',
          medioPago: '',
          numeroTransaccion: '',
        }}
        validationSchema={ReservaSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            {/* Campos */}
            {[
              { name: 'nombreCompleto', label: 'Nombre Completo', type:'text' },
              { name: 'numeroDocumento', label: 'Número de Documento', type:'text' },
              { name: 'correoElectronico', label: 'Correo Electrónico', type:'email' },
              { name: 'adultos', label: 'Adultos', type:'number' },
              { name: 'ninos', label: 'Niños', type:'number' },
              { name: 'numeroDias', label: 'Número de Días', type:'number' },
              { name: 'fechaEntrada', label: 'Fecha de Entrada', type:'date' },
            ].map(field => (
              <div key={field.name}>
                <label className="block">{field.label}</label>
                <Field
                  name={field.name}
                  type={field.type}
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage name={field.name} component="div" className="text-red-500" />
              </div>
            ))}

            {/* Select habitaciones */}
            <div>
              <label className="block">Habitación/Cabaña</label>
              <Field
                as="select"
                name="habitacionId"
                className="w-full border p-2 rounded"
              >
                <option value="">-- Seleccione --</option>
                {Array.isArray(habitaciones) && habitaciones.length > 0 ? (
                  habitaciones.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.nombre} - ${h.precioPorNoche}/noche
                    </option>
                  ))
                ) : (
                  <option disabled>No hay habitaciones disponibles</option>
                )}
              </Field>
              <ErrorMessage name="habitacionId" component="div" className="text-red-500" />
            </div>

            {/* Medio de pago */}
            <div>
              <label className="block">Medio de Pago</label>
              <Field as="select" name="medioPago" className="w-full border p-2 rounded">
                <option value="">-- Seleccione --</option>
                <option value="Nequi">Nequi</option>
                <option value="Transferencia">Transferencia Bancaria</option>
              </Field>
              <ErrorMessage name="medioPago" component="div" className="text-red-500" />
            </div>

            {/* Comprobante */}
            <div>
              <label className="block">Comprobante (imagen)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImagenComprobante(e.currentTarget.files[0])}
                className="w-full"
              />
            </div>

            <div>
              <label className="block">Número de Transacción</label>
              <Field name="numeroTransaccion" className="w-full border p-2 rounded" />
              <ErrorMessage name="numeroTransaccion" component="div" className="text-red-500" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {isSubmitting ? 'Procesando...' : 'Realizar Reserva'}
            </button>
          </Form>
        )}
      </Formik>

      {/* Resumen */}
      {resumenReserva && (
        <div className="mt-8 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Resumen de Reserva</h2>
          {Object.entries(resumenReserva).map(([key, val]) => (
            <p key={key}>
              <strong>{key.replace(/([A-Z])/g, ' $1')}: </strong>
              {val.toString()}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reserva;
