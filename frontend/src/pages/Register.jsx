import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Reserva = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tipoAlojamiento, setTipoAlojamiento] = useState('habitacion');
  const [habitaciones, setHabitaciones] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [resumenReserva, setResumenReserva] = useState(null);
  const [imagenComprobante, setImagenComprobante] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const url =
      tipoAlojamiento === 'habitacion'
        ? `${process.env.REACT_APP_API_URL}/api/habitaciones/disponibles`
        : `${process.env.REACT_APP_API_URL}/api/cabanas/disponibles`;

    axios.get(url)
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
  }, [tipoAlojamiento, user, navigate]);

  const ReservaSchema = Yup.object().shape({
    nombreCompleto: Yup.string().required('Requerido'),
    numeroDocumento: Yup.string().required('Requerido'),
    correoElectronico: Yup.string().email('Inválido').required('Requerido'),
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
      const lista = tipoAlojamiento === 'habitacion' ? habitaciones : cabanas;
      const item = lista.find(x => x.id === +values.habitacionId);
      if (!item) throw new Error('Selección inválida');

      const precio = item.precio_por_noche || item.precioPorNoche;
      const total = precio * values.numeroDias;
      const antic = total * 0.3;

      const { data: reserva } = await axios.post(
        `${process.env.REACT_APP_API_URL}/reservas`,
        {
          cliente_id: user.id,
          fecha_inicio: values.fechaEntrada,
          fecha_fin: new Date(
            new Date(values.fechaEntrada)
              .setDate(new Date(values.fechaEntrada).getDate() + +values.numeroDias)
          ),
          total_pago: total,
          porcentaje_pagado: 0.3,
          estado: 'Pendiente',
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (imagenComprobante) {
        const form = new FormData();
        form.append('imagen', imagenComprobante);
        await axios.post(
          `${process.env.REACT_APP_API_URL}/reservas/${reserva.id}/comprobante`,
          form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/pagos`,
        {
          reserva_id: reserva.id,
          monto: antic,
          medio_pago: values.medioPago,
          numero_transaccion: values.numeroTransaccion,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setResumenReserva({
        código: reserva.id,
        nombre: values.nombreCompleto,
        correo: values.correoElectronico,
        entrada: values.fechaEntrada,
        noches: values.numeroDias,
        alojamiento: tipoAlojamiento === 'habitacion'
          ? `Habitación #${item.numero}`
          : item.nombre,
        anticipo: antic,
        pendiente: total - antic,
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
                {/* Selector de tipo */}
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

                {/* Resto del formulario */}
                <div>
                  <label className="block mb-1">Nombre Completo</label>
                  <Field
                    type="text"
                    name="nombreCompleto"
                    className="w-full border p-2 rounded"
                  />
                  <ErrorMessage name="nombreCompleto" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block mb-1">Número de Documento</label>
                  <Field
                    type="text"
                    name="numeroDocumento"
                    className="w-full border p-2 rounded"
                  />
                  <ErrorMessage name="numeroDocumento" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Aquí agregar los demás campos que quieras incluir en el formulario */}
                {/* Alojamiento (habitaciones o cabañas) */}
                <div>
                  <label className="block mb-1">Alojamiento</label>
                  <Field as="select" name="habitacionId" className="w-full border p-2 rounded">
                    <option value="">-- Seleccione --</option>
                    {tipoAlojamiento === 'habitacion'
                      ? habitaciones.map(h => (
                          <option key={h.id} value={h.id}>
                            #{h.numero} – Capacidad: {h.capacidad} – ${h.precio_por_noche}
                          </option>
                        ))
                      : cabanas.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.nombre} – Capacidad: {c.capacidad} – ${c.precio_por_noche}
                          </option>
                        ))
                    }
                  </Field>
                  <ErrorMessage name="habitacionId" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* El resto de los campos... */}
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Resumen de la reserva... */}
    </div>
  );
};

export default Reserva;

