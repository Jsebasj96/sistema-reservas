import React, { useState, useEffect } from 'react';
import { usePagoContext } from '../context/PagoContext';

function Pagos() {
  const { pagos, realizarPago } = usePagoContext();
  const [metodoPago, setMetodoPago] = useState('');

  const handlePago = () => {
    realizarPago(metodoPago);
  };

  return (
    <div>
      <h2>Detalles de Pago</h2>
      <p>Total a pagar: ${pagos.total}</p>
      <select onChange={e => setMetodoPago(e.target.value)}>
        <option value="nequi">Nequi</option>
        <option value="banco">Banco</option>
        <option value="efectivo">Efectivo</option>
      </select>
      <button onClick={handlePago}>Realizar Pago</button>
    </div>
  );
}

export default Pagos;
