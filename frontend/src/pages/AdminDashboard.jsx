import React, { useState, useEffect } from 'react';
import { obtenerIngresos } from '../services/ingresosService';

function AdminDashboard() {
  const [ingresos, setIngresos] = useState({});

  useEffect(() => {
    obtenerIngresos().then((data) => setIngresos(data));
  }, []);

  return (
    <div>
      <h2>Dashboard Administrador</h2>
      <p>Ingreso total por hospedaje: ${ingresos.hospedaje}</p>
      <p>Ingreso total por pasadía: ${ingresos.pasadia}</p>
      <p>Ingreso total por restaurante: ${ingresos.restaurante}</p>
      <p>Ingreso total por bar: ${ingresos.bar}</p>
    </div>
  );
}

export default AdminDashboard;
