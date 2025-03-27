require('dotenv').config(); // Cargar variables de entorno al inicio

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ✅ Configurar CORS actualizado
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Para desarrollo local
      "https://sistema-reservas-frontend-2vkwl931h-jsebasj96s-projects.vercel.app", // URL actual de Vercel
      "https://sistema-reservas-eight.vercel.app" // Si tienes otra URL vieja
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
    credentials: true, // Permitir cookies, tokens, etc.
  })
);

app.use(express.json());

// ✅ Rutas organizadas
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// ✅ Puerto configurado desde variables de entorno o por defecto 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));