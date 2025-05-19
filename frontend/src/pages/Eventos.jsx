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
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar Evento</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="w-full max-w-md space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block font-medium">Nombre del Evento</label>
            <Field
              type="text"
              name="nombre_evento"
              className="w-full border px-3 py-2 rounded"
            />
            <ErrorMessage name="nombre_evento" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label className="block font-medium">Descripción</label>
            <Field
              as="textarea"
              name="descripcion"
              className="w-full border px-3 py-2 rounded"
            />
            <ErrorMessage name="descripcion" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label className="block font-medium">Fecha del Evento</label>
            <Field
              type="date"
              name="fecha_evento"
              className="w-full border px-3 py-2 rounded"
            />
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
  );
};

export default Eventos;
