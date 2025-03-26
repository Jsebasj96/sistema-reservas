const pool = require('../config/db');

// ✅ Obtener todos los vuelos disponibles
const getAllFlights = async () => {
  const result = await pool.query('SELECT * FROM flights ORDER BY departure_time ASC');
  return result.rows;
};

// ✅ Obtener un vuelo por ID
const getFlightById = async (id) => {
  const result = await pool.query('SELECT * FROM flights WHERE id = $1', [id]);
  return result.rows[0];
};

// ✅ Crear un nuevo vuelo con precios calculados automáticamente
const createFlight = async (airline, origin, destination, departure_time, arrival_time, price) => {
  // 🔥 Calcular automáticamente price_turista y price_business
  const price_turista = parseFloat(price).toFixed(2);
  const price_business = (parseFloat(price) * 1.12).toFixed(2);

  // 🔥 Generar código de vuelo (Ejemplo: AA-123)
  const airlineCode = airline.substring(0, 2).toUpperCase();
  const flightNumber = Math.floor(100 + Math.random() * 900);
  const code = `${airlineCode}-${flightNumber}`;

  const result = await pool.query(
    `INSERT INTO flights (airline, origin, destination, departure_time, arrival_time, price, price_business, price_turista, code) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [airline, origin, destination, departure_time, arrival_time, price, price_business, price_turista, code]
  );

  return result.rows[0];
};

// ✅ Actualizar un vuelo y recalcular los precios si se modifica el precio base
const updateFlight = async (id, updatedFields) => {
  const { airline, origin, destination, departure_time, arrival_time, price } = updatedFields;

  // Si se actualiza el precio, recalcular los valores
  let price_turista, price_business;
  if (price) {
    price_turista = parseFloat(price).toFixed(2);
    price_business = (parseFloat(price) * 1.12).toFixed(2);
  }

  const result = await pool.query(
    `UPDATE flights 
     SET airline = COALESCE($1, airline), 
         origin = COALESCE($2, origin), 
         destination = COALESCE($3, destination), 
         departure_time = COALESCE($4, departure_time), 
         arrival_time = COALESCE($5, arrival_time), 
         price = COALESCE($6, price), 
         price_turista = COALESCE($7, price_turista), 
         price_business = COALESCE($8, price_business)
     WHERE id = $9 RETURNING *`,
    [airline, origin, destination, departure_time, arrival_time, price, price_turista, price_business, id]
  );

  return result.rows[0];
};

// ✅ Eliminar un vuelo
const deleteFlight = async (id) => {
  const result = await pool.query('DELETE FROM flights WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

const getAvailableCities = async () => {
  const result = await pool.query(`
    SELECT DISTINCT origin FROM flights
    UNION
    SELECT DISTINCT destination FROM flights
  `);
  return result.rows.map(row => row.origin); // Solo enviamos los nombres de las ciudades
};

// 🔍 Buscar vuelos directos o con escalas
const findFlightsWithConnections = async (origin, destination) => {
  try {
      console.log(`🔍 Buscando vuelos de ${origin} a ${destination}...`);

      console.log(`🔎 Buscando código IATA para la ciudad (nombre real): ${origin}`);
      console.log(`🔎 Buscando código IATA para la ciudad (nombre real): ${destination}`);

      const originIATA = await getIataCode(origin);
      const destinationIATA = await getIataCode(destination);

      console.log(`📍 Código IATA de origen después de consulta: ${originIATA}`);
      console.log(`📍 Código IATA de destino después de consulta: ${destinationIATA}`);

      if (!originIATA || !destinationIATA) {
          console.log("❌ No se encontraron códigos IATA para las ciudades ingresadas");
          return { error: "No se encontraron aeropuertos para las ciudades ingresadas" };
      }

      // Buscar vuelos directos
      const directFlight = await pool.query(
          "SELECT * FROM flights WHERE origin_iata = $1 AND destination_iata = $2 ORDER BY departure_time ASC",
          [originIATA, destinationIATA]
      );

      console.log(`✈️ Vuelos directos encontrados:`, directFlight.rows.length);

      if (directFlight.rows.length > 0) {
          return { flights: directFlight.rows, segments: [] };
      }

      return { flights: [], segments: [] };

  } catch (error) {
      console.error("❌ Error buscando vuelos:", error);
      throw new Error("Error buscando vuelos con conexiones");
  }
};

const testDatabaseConnection = async () => {
  try {
      const result = await pool.query("SELECT NOW() AS current_time");
      console.log("✅ Conexión a la base de datos exitosa:", result.rows[0]);
  } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
  }
};

testDatabaseConnection();

const getIataCode = async (city) => {
  console.log(`🔎 Buscando código IATA para la ciudad: ${city}`);

  const result = await pool.query(
      "SELECT iata_code FROM airports WHERE LOWER(city) = LOWER($1) LIMIT 1",
      [city]
  );

  console.log(`📌 Resultado SQL en API para: ${city}`, result.rows);

  return result.rows.length > 0 ? result.rows[0].iata_code : null;
};

module.exports = { getAllFlights, getFlightById, createFlight, updateFlight, deleteFlight, getAvailableCities, findFlightsWithConnections};