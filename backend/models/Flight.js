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
    const directFlight = await pool.query(
      "SELECT * FROM flights WHERE origin = $1 AND destination = $2 ORDER BY departure_time ASC",
      [origin, destination]
    );

    if (directFlight.rows.length > 0) {
      // ✈️ Hay un vuelo directo, lo retornamos
      return { flights: directFlight.rows, segments: [] };
    }

    // 🛫 Buscar vuelos que salgan desde la ciudad de origen
    const firstLeg = await pool.query(
      "SELECT * FROM flights WHERE origin = $1 ORDER BY departure_time ASC",
      [origin]
    );

    for (let flight1 of firstLeg.rows) {
      // 🛬 Buscar vuelos que conecten con el destino final desde la ciudad intermedia
      const secondLeg = await pool.query(
        "SELECT * FROM flights WHERE origin = $1 AND destination = $2 ORDER BY departure_time ASC",
        [flight1.destination, destination]
      );

      if (secondLeg.rows.length > 0) {
        // ✅ Si encontramos un vuelo con escala, lo retornamos
        return {
          flights: [flight1],
          segments: secondLeg.rows
        };
      }
    }

    return { flights: [], segments: [] }; // ❌ No hay vuelos disponibles
  } catch (error) {
    console.error("❌ Error buscando vuelos:", error);
    throw new Error("Error buscando vuelos con conexiones");
  }
};

module.exports = { getAllFlights, getFlightById, createFlight, updateFlight, deleteFlight, getAvailableCities, findFlightsWithConnections};