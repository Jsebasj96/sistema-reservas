// src/pages/Reserva.jsx
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
  const [alojamientos, setAlojamientos] = useState([]);
  const [resumenReserva, setResumenReserva] = useState(null);
  const [imagenComprobante, setImagenComprobante] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  // 🚚 cargar alojamientos (habitaciones o cabañas)
  useEffect(() => {
    if (!user) return;

    const url = `${process.env.REACT_APP_API_URL}/api/alojamientos/disponibles`;

    axios
      .get(url, { withCredentials: true }) // ← Aquí incluimos withCredentials
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAlojamientos(data);
      })
      .catch(err => {
        if (err.response?.status === 401) navigate('/login');
        else console.error(err);
      });
  }, [user, navigate]);

  // 💾 esquema Formik
  const ReservaSchema = Yup.object().shape({
    nombreCompleto: Yup.string().required('Requerido'),
    numeroDocumento: Yup.string().required('Requerido'),
    correoElectronico: Yup.string().email('Inválido').required('Requerido'),
    adultos: Yup.number().min(1).required('Requerido'),
    ninos: Yup.number().min(0).required('Requerido'),
    numeroDias: Yup.number().min(1).required('Requerido'),
    fechaEntrada: Yup.date().required('Requerido'),
    alojamientoId: Yup.string().required('Requerido'),
    medioPago: Yup.string().oneOf(['Nequi', 'Transferencia']).required('Requerido'),
    numeroTransaccion: Yup.string().required('Requerido'),
  });

  // 📤 envío de reserva + pago
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // tomar datos correctos según tipo
      const item = alojamientos.find(x => x.id === +values.alojamientoId);
      if (!item) throw new Error('Selección inválida');

      const precio = item.precio_por_noche || item.precioPorNoche;
      const total = precio * values.numeroDias;
      const antic = total * 0.3;

      // 1) crear reserva (envía cookie con JWT)
      const { data: reserva } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reservas`,
        {
          cliente_id: user.id,
          alojamiento_id: item.id, // Alojamiento en vez de habitacion_id
          fecha_inicio: values.fechaEntrada,
          fecha_fin: new Date(
            new Date(values.fechaEntrada).setDate(
              new Date(values.fechaEntrada).getDate() + +values.numeroDias
            )
          ),
          total_pago: total,
          porcentaje_pagado: 0.3,
          estado: 'Pendiente',
        },
        { withCredentials: true } // ← Aquí también
      );

      // 2) comprobante opcional (comentado)
      // if (imagenComprobante) { … }

      // 3) pago anticipado
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pagos`,
        {
          reserva_id: reserva.id,
          monto: antic,
          medio_pago: values.medioPago,
          numero_transaccion: values.numeroTransaccion,
        },
        { withCredentials: true } // ← Y aquí
      );

      // 4) resumen en UI
      setResumenReserva({
        código: reserva.id,
        nombre: values.nombreCompleto,
        correo: values.correoElectronico,
        entrada: values.fechaEntrada,
        noches: values.numeroDias,
        alojamiento: `${item.tipo} ${item.nombre || item.numero}`,
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
              alojamientoId: '',
              medioPago: '',
              numeroTransaccion: '',
            }}
            validationSchema={ReservaSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4">
                {/* selector tipo */}
                <div>
                  <label className="block mb-1">Tipo Alojamiento</label>
                  <select
                    value={tipoAlojamiento}
                    onChange={e => {
                      setTipoAlojamiento(e.target.value);
                      setFieldValue('alojamientoId', '');
                    }}
                    className="w-full border p-2 rounded"
                  >
                    <option value="habitacion">Habitación</option>
                    <option value="cabana">Cabaña</option>
                  </select>
                </div>

                {/* resto campos */}
                {[
                  { name: 'nombreCompleto', label: 'Nombre Completo', type: 'text' },
                  { name: 'numeroDocumento', label: 'Número Documento', type: 'text' },
                  { name: 'correoElectronico', label: 'Correo Electrónico', type: 'email' },
                  { name: 'adultos', label: 'Adultos', type: 'number' },
                  { name: 'ninos', label: 'Niños', type: 'number' },
                  { name: 'numeroDias', label: 'Noches', type: 'number' },
                  { name: 'fechaEntrada', label: 'Fecha Entrada', type: 'date' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block mb-1">{f.label}</label>
                    <Field
                      name={f.name}
                      type={f.type}
                      className="w-full border p-2 rounded"
                    />
                    <ErrorMessage
                      name={f.name}
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                ))}

                {/* select dinámico */}
                <div>
                  <label className="block mb-1">Alojamiento</label>
                  <Field as="select" name="alojamientoId" className="w-full border p-2 rounded">
                    <option value="">-- Seleccione --</option>
                    {alojamientos.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.tipo === 'habitacion' ? `#${a.numero}` : a.nombre} – Capacidad: {a.capacidad} – ${a.precio_por_noche}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="alojamientoId"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* medio, comprobante, transacción */}
                <div>
                  <label className="block mb-1">Medio Pago</label>
                  <Field as="select" name="medioPago" className="w-full border p-2 rounded">
                    <option value="">-- Seleccione --</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Transferencia">Transferencia</option>
                  </Field>
                  <ErrorMessage
                    name="medioPago"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div>
                  <label className="block mb-1">Comprobante (imagen)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImagenComprobante(e.currentTarget.files[0])}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1"># Transacción</label>
                  <Field
                    name="numeroTransaccion"
                    className="w-full border p-2 rounded"
                  />
                  <ErrorMessage
                    name="numeroTransaccion"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  {isSubmitting ? 'Procesando…' : 'Realizar Reserva'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {resumenReserva && (
        <div className="mt-8 w-full flex justify-center">
          <div className="w-2/3 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            {Object.entries(resumenReserva).map(([k, v]) => (
              <p key={k}>
                <strong>{k}:</strong> {v}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reserva;

