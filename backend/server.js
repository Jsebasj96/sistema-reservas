require('dotenv').config(); // Cargar variables de entorno al inicio

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');  // 📌 Importar correctamente

const app = express();

app.use(cors());
app.use(express.json());

// 📌 Asegurar que las rutas están configuradas
app.use('/api/auth', authRoutes);

const flightRoutes = require('./routes/flightRoutes');
app.use('/api/flights', flightRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));