// src/pages/Reserva.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Reserva = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [habitaciones, setHabitaciones] = useState([]);
  const [resumenReserva, setResumenReserva] = useState(null);
  const [imagenComprobante, setImagenComprobante] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`${process.env.REACT_APP_API_URL}/habitaciones/disponibles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setHabitaciones(data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate('/login', { replace: true });
        } else {
          console.error('Error cargando habitaciones:', err);
          setHabitaciones([]);
        }
      });
  }, [user, navigate]);

  const ReservaSchema = Yup.object().shape({
    nombreCompleto: Yup.string().required('Requerido'),
    numeroDocumento: Yup.string().required('Requerido'),
    correoElectronico: Yup.string().email('Correo inválido').required('Requerido'),
    adultos: Yup.number().min(1).required('Requerido'),
    ninos: Yup.number().min(0).required('Requerido'),
    numeroDias: Yup.number().min(1).required('Requerido'),
    fechaEntrada: Yup.date().required('Requerido'),
    habitacionId: Yup.string().required('Requerido'),
    medioPago: Yup.string().oneOf(['Nequi', 'Transferencia']).required('Requerido'),
    numeroTransaccion: Yup.string().required('Requerido'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const habit = habitaciones.find((h) => h.id === +values.habitacionId);
      if (!habit) throw new Error('Habitación no válida');

      const montoTotal = habit.precioPorNoche * values.numeroDias;
      const montoAnticipado = montoTotal * 0.3;

      const resReserva = await axios.post(`${process.env.REACT_APP_API_URL}/reservas`, {
        cliente_id: user.id,
        fecha_inicio: values.fechaEntrada,
        fecha_fin: new Date(
          new Date(values.fechaEntrada).setDate(
            new Date(values.fechaEntrada).getDate() + +values.numeroDias
          )
        ),
        total_pago: montoTotal,
        porcentaje_pagado: 0.3,
        estado: 'Pendiente',
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const reservaId = resReserva.data.id;

      if (imagenComprobante) {
        const formData = new FormData();
        formData.append('imagen', imagenComprobante);
        await axios.post(`${process.env.REACT_APP_API_URL}/reservas/${reservaId}/comprobante`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/pagos`, {
        reserva_id: reservaId,
        monto: montoAnticipado,
        medio_pago: values.medioPago,
        numero_transaccion: values.numeroTransaccion,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Formulario de Reserva</h1>

      <div className="w-full md:w-1/3 mx-auto">
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
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {[
                { name: 'nombreCompleto', label: 'Nombre Completo', type: 'text' },
                { name: 'numeroDocumento', label: 'Número de Documento', type: 'text' },
                { name: 'correoElectronico', label: 'Correo Electrónico', type: 'email' },
                { name: 'adultos', label: 'Adultos', type: 'number' },
                { name: 'ninos', label: 'Niños', type: 'number' },
                { name: 'numeroDias', label: 'Número de Días', type: 'number' },
                { name: 'fechaEntrada', label: 'Fecha de Entrada', type: 'date' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block">{field.label}</label>
                  <Field name={field.name} type={field.type} className="w-full border p-2 rounded" />
                  <ErrorMessage name={field.name} component="div" className="text-red-500" />
                </div>
              ))}

              <div>
                <label className="block">Habitación/Cabaña</label>
                <Field as="select" name="habitacionId" className="w-full border p-2 rounded">
                  <option value="">-- Seleccione --</option>
                  {habitaciones.length > 0 ? (
                    habitaciones.map((h) => (
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

              <div>
                <label className="block">Medio de Pago</label>
                <Field as="select" name="medioPago" className="w-full border p-2 rounded">
                  <option value="">-- Seleccione --</option>
                  <option value="Nequi">Nequi</option>
                  <option value="Transferencia">Transferencia Bancaria</option>
                </Field>
                <ErrorMessage name="medioPago" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block">Comprobante (imagen)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagenComprobante(e.currentTarget.files[0])}
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
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              >
                {isSubmitting ? 'Procesando...' : 'Realizar Reserva'}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {resumenReserva && (
        <div className="mt-8 p-4 border rounded w-full md:w-2/3 mx-auto">
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

