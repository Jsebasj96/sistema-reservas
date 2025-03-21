import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); // 🔹 Agregado
  const [address, setAddress] = useState(""); // 🔹 Agregado
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://sistema-reservas-final.onrender.com/api/auth/register", {
        name,
        email,
        password,
        phone, // 🔹 Enviado al backend
        address, // 🔹 Enviado al backend
      });

      // Notificación de éxito
      toast.success("✅ Registro exitoso. ¡Ahora inicia sesión!");

      // Redirige al login después de 1.5 segundos
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      // Notificación de error personalizada
      toast.error(`❌ ${err.response?.data?.message || "Error de conexión"}`);
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de usuario</h2>
      <form onSubmit={handleRegister}>
        <label>Nombre:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label>Teléfono:</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />

        <label>Dirección:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />

        <button type="submit">Registrarse</button>
      </form>

      <p>¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link></p>
    </div>
  );
};

export default Register;