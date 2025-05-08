// Función para calcular los ingresos totales
const calculateIncome = (reservas, pagos) => {
    let totalIngresos = 0;

    // Sumar los ingresos de las reservas
    reservas.forEach(reserva => {
        totalIngresos += reserva.monto; // Asumimos que cada reserva tiene un campo "monto"
    });

    // Sumar los ingresos de los pagos
    pagos.forEach(pago => {
        totalIngresos += pago.monto; // Asumimos que cada pago tiene un campo "monto"
    });

    return totalIngresos;
};

module.exports = calculateIncome;

