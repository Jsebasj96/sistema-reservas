require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL no está definida en .env");
  process.exit(1);
}

const sslConfig = process.env.DATABASE_URL.includes("railway")
  ? false
  : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

pool.connect()
  .then(() => console.log("✅ Conexión exitosa a PostgreSQL"))
  .catch(err => console.error("❌ Error de conexión:", err));

module.exports = pool;