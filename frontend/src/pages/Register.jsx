// src/pages/Register.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { HiUser, HiMail, HiLockClosed } from 'react-icons/hi';

const Register = () => {
  const { error: authError } = useContext(AuthContext);
  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Mínimo 2 caracteres').required('Requerido'),
    email: Yup.string().email('Correo inválido').required('Requerido'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        // muestra mensaje de error del backend
        setFieldError('general', data.error || 'Error en el registro');
      } else {
        navigate('/login', { state: { message: 'Registro exitoso, por favor inicia sesión.' } });
      }
    } catch (err) {
      setFieldError('general', 'Error de red. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="flex justify-center w-full">
        <div className="w-1/3 min-w-[300px] bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
            Crear Cuenta
          </h2>

          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => (
              <Form className="space-y-6">
                {/* Nombre */}
                <div className="relative">
                  <HiUser className="absolute left-3 top-3 text-green-500" />
                  <Field
                    name="name"
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Email */}
                <div className="relative">
                  <HiMail className="absolute left-3 top-3 text-green-500" />
                  <Field
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Password */}
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-3 text-green-500" />
                  <Field
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Error general */}
                {errors.general && (
                  <p className="text-red-600 text-center text-sm">{errors.general}</p>
                )}
                {authError && (
                  <p className="text-red-600 text-center text-sm">{authError}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Registrando...' : 'Registrarse'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;
