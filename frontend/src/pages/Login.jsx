// src/pages/Login.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { AuthContext } from '../context/AuthContext';
import { HiMail, HiLockClosed } from 'react-icons/hi';

const Login = () => {
  const { user, loading, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, loading, navigate]);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Correo inválido').required('Requerido'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError('');
    if (!captchaValue) {
      setSubmitError('Por favor completa el reCAPTCHA');
      setSubmitting(false);
      return;
    }
    try {
      await login(values.email, values.password, captchaValue);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error en el inicio de sesión';
      setSubmitError(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="flex justify-center w-full">
        <div className="w-1/3 min-w-[300px] bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
            Iniciar Sesión
          </h2>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
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

                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                    onChange={value => setCaptchaValue(value)}
                  />
                </div>

                {submitError && (
                  <p className="text-red-600 text-center text-sm">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Cargando...' : 'Iniciar Sesión'}
                </button>

                {/* Enlace para registro */}
                <p className="text-center text-sm text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <Link
                    to="/register"
                    className="text-green-700 font-medium hover:underline"
                  >
                    Regístrate
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
