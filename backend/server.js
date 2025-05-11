require('dotenv').config();  // Cargar variables de entorno desde el archivo .env
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // ✅ Necesario para leer cookies

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const restauranteRoutes = require('./routes/restauranteRoutes');
const barRoutes = require('./routes/barRoutes');
const pasadiaRoutes = require('./routes/pasadiaRoutes');
const habitacionRoutes = require('./routes/habitacionRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const cabanaRoutes = require('./routes/cabanaRoutes');

const app = express();

// Configurar CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sistema-reservas-eight.vercel.app',
    'https://sistema-reservas-frontend-2vkwl931h-jsebasj96s-projects.vercel.app', 
    'https://sistema-reservas-final.onrender.com'
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true  // ✅ Necesario para permitir el envío de cookies desde el frontend
}));

// Middleware para procesar cuerpos de solicitudes en formato JSON
app.use(express.json());
app.use(cookieParser()); // ✅ Permite leer cookies (para JWT)

// Definir las rutas
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/restaurante', restauranteRoutes);
app.use('/api/bar', barRoutes);
app.use('/api/pasadias', pasadiaRoutes);
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/cabanas', cabanaRoutes);

// Ruta raíz opcional
app.get('/', (req, res) => {
  res.send('API del sistema de reservas del Club Campestre La Buena Vida');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
