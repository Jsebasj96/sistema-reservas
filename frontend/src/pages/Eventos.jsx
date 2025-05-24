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
          user_id: user.id,
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
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h3 className="text-xl font-semibold text-center text-green-700 mb-2">
        ¡Haz realidad tu evento soñado en el Club La Buena Vida!
      </h3>
      <p className="mb-6 text-gray-600 text-center max-w-xl mx-auto">
        Celebra momentos inolvidables con nosotros. Llena este formulario para registrar tu evento y asegurar tu fecha especial.
      </p>

      <div className="info-box bg-green-100 text-green-800 p-4 rounded mb-6 text-sm max-w-md mx-auto text-center">
        <p><strong>Tipos de eventos:</strong> Privados, corporativos o sociales</p>
        <p><strong>Costo base:</strong> $450.000 (incluye espacio, mobiliario y decoración básica)</p>
      </div>

      <ul className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 max-w-2xl mx-auto">
        <li>✅ Espacios amplios - ✅ Decoración personalizable - ✅ Parqueadero gratuito - ✅ Atención personalizada</li>
      </ul>

      <div className="reserva-pasadias-container">
        <img
          src="https://cdn.pixabay.com/photo/2017/12/08/11/53/event-party-3005668_1280.jpg"
          alt="Evento"
          className="imagen-pasadias"
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="formulario-pasadias">
            <h2 className="text-2xl font-bold mb-4">Registro de Evento</h2>

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

            <div className="font-semibold">
              Total a pagar: ${costoFijo.toLocaleString()}
            </div>

            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Registrar Evento
            </button>

            {mensaje && <p className="mt-4 font-medium">{mensaje}</p>}
          </Form>
        </Formik>
      </div>

      <div className="testimonio-pasadias mt-10 text-center text-gray-700 italic">
        “Organizamos el cumpleaños de mi madre y fue espectacular. Todo muy bien coordinado.” — <strong>Camila R.</strong>
      </div>
    </div>
  );
};

export default Eventos;