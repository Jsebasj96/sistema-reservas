import React, { useContext, useEffect, useState } from 'react';
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
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Reserva de Pasadía</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="space-y-4">
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

            <div>
              <p className="font-semibold">
                Total a pagar: $
                {calcularTotal(values.tipo_pasadia, values.cantidad_personas).toLocaleString()}
              </p>
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
  );
};

export default Pasadias;
