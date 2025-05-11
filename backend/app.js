const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const restauranteRoutes = require('./routes/restauranteRoutes');
const barRoutes = require('./routes/barRoutes');
const pasadiaRoutes = require('./routes/pasadiaRoutes');
const habitacionRoutes = require('./routes/habitacionRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const cabanaRoutes = require('./routes/cabanaRoutes'); // ✅ Agregado

const app = express();

// Configurar CORS
app.use(cors({
  origin: [
    "http://localhost:3000",  // Dominio local para desarrollo
    "https://sistema-reservas-frontend-2vkwl931h-jsebasj96s-projects.vercel.app" // Dominio desplegado en Vercel
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Middleware para procesar cuerpos de solicitudes en formato JSON
app.use(express.json());

// Definir las rutas
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/restaurante', restauranteRoutes);
app.use('/api/bar', barRoutes);
app.use('/api/pasadias', pasadiaRoutes);
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/cabanas', cabanaRoutes);    // ✅ Montaje de la ruta de cabañas
app.use('/api/inventario', inventarioRoutes);

module.exports = app;
