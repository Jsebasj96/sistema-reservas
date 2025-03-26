import React, { useState } from "react";

const SegmentForm = ({ segments, setSegments }) => {
  const handleAddSegment = () => {
    setSegments([...segments, { flight_code: "", origin: "", destination: "", departure_time: "", arrival_time: "" }]);
  };

  const handleSegmentChange = (index, field, value) => {
    const newSegments = segments.map((segment, i) => {
      if (i === index) {
        return { ...segment, [field]: value };
      }
      return segment;
    });
    setSegments(newSegments);
  };

  return (
    <div>
      <h4>Tramos de vuelo (si aplica)</h4>
      {segments.map((segment, index) => (
        <div key={index} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
          <label>Código de Vuelo:</label>
          <input
            type="text"
            value={segment.flight_code}
            onChange={(e) => handleSegmentChange(index, "flight_code", e.target.value)}
            required
          />
          <label>Origen (Código de 3 letras):</label>
          <input
            type="text"
            value={segment.origin}
            onChange={(e) => handleSegmentChange(index, "origin", e.target.value)}
            required
          />
          <label>Destino (Código de 3 letras):</label>
          <input
            type="text"
            value={segment.destination}
            onChange={(e) => handleSegmentChange(index, "destination", e.target.value)}
            required
          />
          <label>Hora de Salida:</label>
          <input
            type="datetime-local"
            value={segment.departure_time}
            onChange={(e) => handleSegmentChange(index, "departure_time", e.target.value)}
            required
          />
          <label>Hora de Llegada:</label>
          <input
            type="datetime-local"
            value={segment.arrival_time}
            onChange={(e) => handleSegmentChange(index, "arrival_time", e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={handleAddSegment}>
        Agregar Tramo
      </button>
    </div>
  );
};

export default SegmentForm;