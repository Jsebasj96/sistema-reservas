// app.js (o index.js / server.js — el que arranca tu Express)
require('dotenv').config();            // 1) Carga .env
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes       = require('./routes/authRoutes');
const reservaRoutes    = require('./routes/reservaRoutes');
const pagoRoutes       = require('./routes/pagoRoutes');
const restauranteRoutes= require('./routes/restauranteRoutes');
const barRoutes        = require('./routes/barRoutes');
const pasadiaRoutes    = require('./routes/pasadiaRoutes');
const habitacionRoutes = require('./routes/habitacionRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const cabanaRoutes     = require('./routes/cabanaRoutes');

const app = express();


// Orígenes permitidos — añade aquí todos los dominios de tu frontend
const WHITE_LIST = [
  'http://localhost:3000',
  'https://sistema-reservas-eight.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {

    if (!origin || WHITE_LIST.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Origen CORS no permitido: ${origin}`));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};

app.use(cors(corsOptions));             // monta CORS antes que cualquier ruta
app.options('*', cors(corsOptions));    // habilita preflight para todas las rutas


app.use(cookieParser());               // para leer cookies (si usas JWT en cookies)
app.use(express.json());               // para parsear JSON en el body


app.use('/api/auth',        authRoutes);
app.use('/api/reservas',    reservaRoutes);
app.use('/api/pagos',       pagoRoutes);
app.use('/api/restaurante', restauranteRoutes);
app.use('/api/bar',         barRoutes);
app.use('/api/pasadias',    pasadiaRoutes);
app.use('/api/habitaciones',habitacionRoutes);
app.use('/api/cabanas',     cabanaRoutes);
app.use('/api/inventario',  inventarioRoutes);

// Opcional: ruta raíz
app.get('/', (req, res) => {
  res.send('API Sistema de Reservas La Buena Vida');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

