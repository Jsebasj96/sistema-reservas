import React from "react";

const Reservas = () => {
  return (
    <div>
      <h2>Bienvenido a tus Reservas</h2>
      <p>Ahora puedes gestionar tus vuelos 🚀</p>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Reservas;