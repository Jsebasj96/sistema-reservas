import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './custom.css';

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
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
      {/* CTA emocional */}
      <h3 className="text-xl font-semibold text-center text-green-700 mb-2">
        🎉 ¡Organiza tu evento soñado en el lugar perfecto!
      </h3>

      {/* Introducción */}
      <p className="mb-6 text-gray-600 text-center max-w-xl mx-auto">
        Completa este formulario para reservar tu evento en nuestras instalaciones.
        Ideal para celebraciones, eventos sociales, empresariales y más.
      </p>

      {/* Contenedor principal con imagen y formulario */}
      <div className="evento-container">
        {/* Imagen del evento */}
        <img
          src="https://cdn.pixabay.com/photo/2016/11/22/19/22/dinner-1850117_1280.jpg"
          alt="Evento en el club"
          className="imagen-evento"
        />

        {/* Formulario */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4 w-full max-w-md">
            <div>
              <label className="block font-medium">Nombre del Evento</label>
              <Field type="text" name="nombre_evento" className="w-full border px-3 py-2 rounded" />
              <ErrorMessage name="nombre_evento" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium">Descripción</label>
              <Field as="textarea" name="descripcion" className="w-full border px-3 py-2 rounded" />
              <ErrorMessage name="descripcion" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium">Fecha del Evento</label>
              <Field type="date" name="fecha_evento" className="w-full border px-3 py-2 rounded" />
              <ErrorMessage name="fecha_evento" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium">Tipo de Evento</label>
              <Field as="select" name="tipo_evento" className="w-full border px-3 py-2 rounded">
                <option value="privado">Privado</option>
                <option value="corporativo">Corporativo</option>
                <option value="social">Social</option>
              </Field>
              <ErrorMessage name="tipo_evento" component="div" className="text-red-500 text-sm" />
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

      {/* Beneficios del servicio de eventos */}
      <ul className="mt-10 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm max-w-3xl">
        <li>✅ Salones amplios y equipados</li>
        <li>✅ Personal de apoyo durante el evento</li>
        <li>✅ Parqueadero gratuito</li>
        <li>✅ Opción de catering y decoración</li>
      </ul>

      {/* Información de disponibilidad */}
      <div className="info-box bg-green-100 text-green-800 p-4 rounded mb-6 text-sm max-w-md mx-auto text-center">
        <p><strong>Disponibilidad:</strong> Lunes a domingo, de 9:00 a.m. a 10:00 p.m.</p>
        <p><strong>Tarifa:</strong> $450.000 por evento (servicios básicos incluidos)</p>
      </div>
    </div>
  );
};

export default Eventos;
