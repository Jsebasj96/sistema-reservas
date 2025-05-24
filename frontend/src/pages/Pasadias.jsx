import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://sistema-reservas-final.onrender.com';

const Pasadias = () => {
  const { user } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState('');

  const initialValues = {
    fecha: '',
    tipo_pasadia: 'con_almuerzo',
    cantidad_personas: 1,
  };

  const validationSchema = Yup.object({
    fecha: Yup.date().required('La fecha es obligatoria'),
    tipo_pasadia: Yup.string().required('Selecciona un tipo de pasadía'),
    cantidad_personas: Yup.number()
      .min(1, 'Debe haber al menos 1 persona')
      .required('Ingresa la cantidad de personas'),
  });

  const calcularTotal = (tipo, cantidad) => {
    const precio = tipo === 'con_almuerzo' ? 50000 : 35000;
    return precio * cantidad;
  };

  const handleSubmit = async (values, { resetForm }) => {
    const total_pago = calcularTotal(values.tipo_pasadia, values.cantidad_personas);
    try {
      await axios.post(
        `${API_URL}/api/pasadias`,
        {
          user_id: user.id,
          fecha: values.fecha,
          tipo_pasadia: values.tipo_pasadia,
          cantidad_personas: values.cantidad_personas,
          total_pago,
        },
        { withCredentials: true }
      );
      setMensaje('✅ Pasadía reservada con éxito');
      resetForm();
    } catch (error) {
      console.error('Error al reservar pasadía:', error);
      setMensaje('❌ Error al reservar pasadía');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h3 className="text-xl font-semibold text-center text-green-700 mb-2">
        ¡Escapa de la rutina y vive un día inolvidable!
      </h3>
      <p className="mb-6 text-gray-600 text-center max-w-xl mx-auto">
        Disfruta de un día completo de recreación en nuestro club. Llena este formulario para reservar tu pasadía y asegurar tu cupo.
      </p>

      <div className="info-box bg-green-100 text-green-800 p-4 rounded mb-6 text-sm max-w-md mx-auto text-center">
        <p><strong>Disponibilidad:</strong> Todos los días de 8:00 a.m. a 6:00 p.m.</p>
        <p><strong>Tarifa:</strong> $50.000 con almuerzo / $35.000 sin almuerzo</p>
      </div>

      <ul className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 max-w-2xl mx-auto">
        <li>✅ Acceso a piscinas</li>
        <li>✅ Actividades recreativas</li>
        <li>✅ Parqueadero gratuito</li>
        <li>✅ Almuerzo incluido (opcional)</li>
      </ul>

      <div className="reserva-pasadias-container">
        <img
          src="https://cdn.pixabay.com/photo/2016/11/21/15/52/pool-1840794_1280.jpg"
          alt="Pasadía"
          className="imagen-pasadias"
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form className="formulario-pasadias">
              <h2 className="text-2xl font-bold mb-4">Reserva de Pasadía</h2>

              <div>
                <label className="block font-medium">Fecha</label>
                <Field type="date" name="fecha" className="w-full border px-3 py-2 rounded" />
                <ErrorMessage name="fecha" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block font-medium">Tipo de Pasadía</label>
                <Field as="select" name="tipo_pasadia" className="w-full border px-3 py-2 rounded">
                  <option value="con_almuerzo">Con almuerzo</option>
                  <option value="sin_almuerzo">Sin almuerzo</option>
                </Field>
                <ErrorMessage name="tipo_pasadia" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block font-medium">Cantidad de personas</label>
                <Field
                  type="number"
                  name="cantidad_personas"
                  min={1}
                  className="w-full border px-3 py-2 rounded"
                />
                <ErrorMessage
                  name="cantidad_personas"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="font-semibold">
                Total a pagar: $
                {calcularTotal(values.tipo_pasadia, values.cantidad_personas).toLocaleString()}
              </div>

              <button
                type="submit"
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Reservar
              </button>

              {mensaje && <p className="mt-4 font-medium">{mensaje}</p>}
            </Form>
          )}
        </Formik>
      </div>

      <div className="testimonio-pasadias mt-10 text-center text-gray-700 italic">
        “Fue un día maravilloso con mis hijos. Todo muy bien organizado.” — <strong>Laura M.</strong>
      </div>
    </div>
  );
};

export default Pasadias;
