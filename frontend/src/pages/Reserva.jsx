import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Reservas = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [resumenReserva, setResumenReserva] = useState(null);
  const [imagenComprobante, setImagenComprobante] = useState(null);

  useEffect(() => {
    // Obtener habitaciones disponibles desde la API
    axios.get('/api/habitaciones/disponibles')
      .then(response => setHabitaciones(response.data))
      .catch(error => console.error(error));
  }, []);

  const ReservaSchema = Yup.object().shape({
    nombreCompleto: Yup.string().required('Requerido'),
    numeroDocumento: Yup.string().required('Requerido'),
    correoElectronico: Yup.string().email('Correo inválido').required('Requerido'),
    adultos: Yup.number().min(1, 'Al menos 1 adulto').required('Requerido'),
    ninos: Yup.number().min(0, 'No puede ser negativo').required('Requerido'),
    numeroDias: Yup.number().min(1, 'Al menos 1 día').required('Requerido'),
    fechaEntrada: Yup.date().required('Requerido'),
    habitacionId: Yup.string().required('Requerido'),
    medioPago: Yup.string().oneOf(['Nequi', 'Transferencia']).required('Requerido'),
    numeroTransaccion: Yup.string().required('Requerido'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Calcular monto total y anticipado
      const habitacionSeleccionada = habitaciones.find(h => h.id === parseInt(values.habitacionId));
      const montoTotal = habitacionSeleccionada.precioPorNoche * values.numeroDias;
      const montoAnticipado = montoTotal * 0.3;

      // Crear cliente
      const clienteResponse = await axios.post('/api/clientes', {
        nombre: values.nombreCompleto,
        documento: values.numeroDocumento,
        correo: values.correoElectronico,
      });

      const clienteId = clienteResponse.data.id;

      // Crear reserva
      const reservaResponse = await axios.post('/api/reservas', {
        cliente_id: clienteId,
        fecha_inicio: values.fechaEntrada,
        fecha_fin: new Date(new Date(values.fechaEntrada).setDate(new Date(values.fechaEntrada).getDate() + parseInt(values.numeroDias))),
        total_pago: montoTotal,
        porcentaje_pagado: 0.3,
        estado: 'Pendiente',
        habitacion_id: parseInt(values.habitacionId),
      });

      const reservaId = reservaResponse.data.id;

      // Subir comprobante de pago si se proporciona
      if (imagenComprobante) {
        const formData = new FormData();
        formData.append('imagen', imagenComprobante);
        await axios.post(`/api/reservas/${reservaId}/comprobante`, formData);
      }

      // Crear pago
      await axios.post('/api/pagos', {
        reserva_id: reservaId,
        monto: montoAnticipado,
        medio_pago: values.medioPago,
        numero_transaccion: values.numeroTransaccion,
      });

      setResumenReserva({
        codigoReserva: reservaId,
        nombre: values.nombreCompleto,
        correo: values.correoElectronico,
        fechaEntrada: values.fechaEntrada,
        numeroDias: values.numeroDias,
        habitacion: habitacionSeleccionada.nombre,
        montoAnticipado,
        montoRestante: montoTotal - montoAnticipado,
        estadoPago: '30% pagado / 70% pendiente',
      });

      resetForm();
      setImagenComprobante(null);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar la reserva.');
    } finally {
      setSubmitting(false);
    }
  };

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
            <div>
              <label>Nombre Completo</label>
              <Field name="nombreCompleto" className="input" />
              <ErrorMessage name="nombreCompleto" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Número de Documento</label>
              <Field name="numeroDocumento" className="input" />
              <ErrorMessage name="numeroDocumento" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Correo Electrónico</label>
              <Field name="correoElectronico" type="email" className="input" />
              <ErrorMessage name="correoElectronico" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Adultos</label>
              <Field name="adultos" type="number" className="input" />
              <ErrorMessage name="adultos" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Niños</label>
              <Field name="ninos" type="number" className="input" />
              <ErrorMessage name="ninos" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Número de Días de Hospedaje</label>
              <Field name="numeroDias" type="number" className="input" />
              <ErrorMessage name="numeroDias" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Fecha de Entrada</label>
              <Field name="fechaEntrada" type="date" className="input" />
              <ErrorMessage name="fechaEntrada" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Habitación/Cabaña</label>
              <Field as="select" name="habitacionId" className="input">
                <option value="">Seleccione una habitación</option>
                {habitaciones.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.nombre} - ${h.precioPorNoche}/noche
                  </option>
                ))}
              </Field>
              <ErrorMessage name="habitacionId" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Medio de Pago</label>
              <Field as="select" name="medioPago" className="input">
                <option value="">Seleccione un medio de pago</option>
                <option value="Nequi">Nequi</option>
                <option value="Transferencia">Transferencia Bancaria</option>
              </Field>
              <ErrorMessage name="medioPago" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Comprobante de Pago (imagen)</label>
              <input
                type="file"
                accept="image/*"
                onChange={event => setImagenComprobante(event.currentTarget.files[0])}
                className="input"
              />
            </div>
            <div>
              <label>Número de Transacción</label>
              <Field name="numeroTransaccion" className="input" />
              <ErrorMessage name="numeroTransaccion" component="div" className="text-red-500" />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Procesando...' : 'Realizar Reserva'}
            </button>
          </Form>
        )}
      </Formik>

      {resumenReserva && (
        <div className="mt-8 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Resumen de Reserva</h2>
          <p><strong>Código de Reserva:</strong> {resumenReserva.codigoReserva}</p>
          <p><strong>Nombre:</strong> {resumenReserva.nombre}</p>
          <p><strong>Correo:</strong> {resumenReserva.correo}</p>
          <p><strong>Fecha de Entrada:</strong> {resumenReserva.fechaEntrada}</p>
          <p><strong>Número de Días:</strong> {resumenReserva.numeroDias}</p>
          <p><strong>Habitación:</strong> {resumenReserva.habitacion}</p>
          <p><strong>Monto Anticipado (30%):</strong> ${resumenReserva.montoAnticipado}</p>
          <p><strong>Monto Restante (70%):</strong> ${resumenReserva.montoRestante}</p>
          <p><strong>Estado de Pago:</strong> {resumenReserva.estadoPago}</p>
        </div>
      )}
    </div>
  );
};

export default Reservas;
