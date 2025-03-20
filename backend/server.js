require('dotenv').config(); // Cargar variables de entorno al inicio

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ✅ Configurar CORS para permitir localhost y el frontend en Vercel
app.use(
    cors({
        origin: [
            "http://localhost:3000", // Para desarrollo local
            "https://sistema-reservas-frontend-bo0sq8oyx-jsebasj96s-projects.vercel.app" // URL del frontend en producción
        ],
        credentials: true, // Permitir cookies y headers protegidos
    })
);

app.use(express.json());

// ✅ Configuración de rutas organizadas
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// ✅ Puerto configurado desde variables de entorno o por defecto 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));