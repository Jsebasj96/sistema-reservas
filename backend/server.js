require('dotenv').config({ path: './backend/.env' }); // 🔹 Cargar variables desde backend/
console.log("🔍 DATABASE_URL en server.js:", process.env.DATABASE_URL || "❌ NO CARGADA");

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Verificar si DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL no está definida en el archivo .env");
    process.exit(1); // Detiene la ejecución si falta la variable
}

console.log("✅ DATABASE_URL cargada correctamente");

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));