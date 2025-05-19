// server.js
require('dotenv').config();   // Carga .env
const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');

// Rutas
const authRoutes        = require('./routes/authRoutes');
const reservaRoutes     = require('./routes/reservaRoutes');
const pagoRoutes        = require('./routes/pagoRoutes');
const restauranteRoutes = require('./routes/restauranteRoutes');
const barRoutes         = require('./routes/barRoutes');
const pasadiaRoutes     = require('./routes/pasadiaRoutes');
const habitacionRoutes  = require('./routes/habitacionRoutes');
const inventarioRoutes  = require('./routes/inventarioRoutes');
const cabanaRoutes      = require('./routes/cabanaRoutes');
const eventosRoutes = require('./routes/eventos.routes');

const app = express();

// 1) CONFIGURAR CORS
const WHITE_LIST = [
  'http://localhost:3000',
  'https://sistema-reservas-frontend-2vkwl931h-jsebasj96s-projects.vercel.app',
  'https://sistema-reservas-eight.vercel.app',       // ← tu Vercel
  'https://sistema-reservas-final.onrender.com'      // si vas a consumir API desde sí misma
];

const corsOptions = {
  origin: (origin, callback) => {
  console.log("🌐 ORIGIN:", origin);
  if (!origin || WHITE_LIST.includes(origin)) {
    console.log("✅ ORIGIN PERMITIDO");
    callback(null, true);
  } else {
    console.warn("⛔ ORIGIN BLOQUEADO:", origin);
    callback(new Error(`Origen CORS no permitido: ${origin}`));
  }
},
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};
// monta CORS y el preflight handler
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 2) MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// 3) RUTAS
app.use('/api/auth',         authRoutes);
app.use('/api/reservas',      reservaRoutes);
app.use('/api/pagos',         pagoRoutes);
app.use('/api/restaurante',   restauranteRoutes);
app.use('/api/bar',           barRoutes);
app.use('/api/pasadias',      pasadiaRoutes);
app.use('/api/habitaciones',  habitacionRoutes);
app.use('/api/cabanas',       cabanaRoutes);
app.use('/api/inventario',    inventarioRoutes);
app.use('/api/eventos', eventosRoutes);

// 4) RUTA RAÍZ (opcional)
app.get('/', (req, res) => {
  res.send('API Sistema de Reservas La Buena Vida');
});

// 5) ARRANQUE
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
