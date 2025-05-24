import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://sistema-reservas-final.onrender.com';

const Eventos = () => {
  const { user } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState('');

  const initialValues = {
    nombre_evento: '',
    descripcion: '',
    fecha_evento: '',
    tipo_evento: 'privado',
  };

  const validationSchema = Yup.object({
    nombre_evento: Yup.string().required('El nombre del evento es obligatorio'),
    descripcion: Yup.string().required('La descripción es obligatoria'),
    fecha_evento: Yup.date().required('La fecha es obligatoria'),
    tipo_evento: Yup.string().required('Selecciona un tipo de evento'),
  });

  const costoFijo = 450000;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post(
        `${API_URL}/api/eventos`,
        {
          ...values,
          costo: costoFijo,
          user_id: user.id, // Asegura que se guarde el usuario
        },
        { withCredentials: true }
      );

      setMensaje('✅ Evento registrado correctamente');
      resetForm();
    } catch (error) {
      console.error('Error al registrar evento:', error);
      setMensaje('❌ Error al registrar evento');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-4 text-green-700">Reserva de Evento</h2>
      <h3 className="text-xl font-semibold text-center text-green-600 mb-4">
        🎉 Celebra tu momento especial con nosotros
      </h3>

      <p className="mb-6 text-gray-600 text-center max-w-xl mx-auto">
        Agenda tu evento privado, social o corporativo en nuestras instalaciones. Llena el siguiente
        formulario y nuestro equipo se pondrá en contacto contigo.
      </p>

      <div className="reserva-pasadias-container">
        <img
          src="https://cdn.pixabay.com/photo/2017/08/06/04/34/wedding-2581850_1280.jpg"
          alt="Evento"
          className="imagen-pasadias"
        />

        <div className="w-full max-w-md">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              <div>
                <label className="block font-medium">Nombre del Evento</label>
                <Field
                  type="text"
                  name="nombre_evento"
                  className="w-full border px-3 py-2 rounded"
                />
                <ErrorMessage
                  name="nombre_evento"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-medium">Descripción</label>
                <Field
                  as="textarea"
                  name="descripcion"
                  className="w-full border px-3 py-2 rounded"
                />
                <ErrorMessage
                  name="descripcion"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-medium">Fecha del Evento</label>
                <Field
                  type="date"
                  name="fecha_evento"
                  className="w-full border px-3 py-2 rounded"
                />
                <ErrorMessage
                  name="fecha_evento"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-medium">Tipo de Evento</label>
                <Field as="select" name="tipo_evento" className="w-full border px-3 py-2 rounded">
                  <option value="privado">Privado</option>
                  <option value="corporativo">Corporativo</option>
                  <option value="social">Social</option>
                </Field>
                <ErrorMessage
                  name="tipo_evento"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-medium">Total a pagar</label>
                <div className="w-full px-3 py-2 rounded bg-gray-100 border text-gray-800 font-semibold">
                  $450.000
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
              >
                Registrar Evento
              </button>

              {mensaje && <p className="mt-4 text-center font-medium">{mensaje}</p>}
            </Form>
          </Formik>
        </div>
      </div>

      <div className="testimonio-pasadias mt-10 text-center text-gray-700 italic">
        “El evento salió increíble, el lugar y el servicio fueron excelentes.” —{' '}
        <strong>Camilo A.</strong>
      </div>

      <ul className="mb-10 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm max-w-2xl mx-auto">
        <li>✅ Espacios amplios y elegantes</li>
        <li>✅ Servicio de catering</li>
        <li>✅ Personal de apoyo</li>
        <li>✅ Parqueadero incluido</li>
      </ul>

      <div className="info-box bg-green-100 text-green-800 p-4 rounded mb-6 text-sm max-w-md mx-auto text-center">
        <p><strong>Horarios disponibles:</strong> De lunes a domingo</p>
        <p><strong>Incluye:</strong> Espacio exclusivo, decoración básica y atención personalizada</p>
      </div>
    </div>
  );
};

export default Eventos;

