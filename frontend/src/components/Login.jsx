import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validamos si el usuario completó el reCAPTCHA
    if (!captchaValue) {
      toast.warning("⚠️ Por favor completa el reCAPTCHA");
      return;
    }

    try {
      const res = await axios.post("https://sistema-reservas-final.onrender.com/api/auth/login", {
        email,
        password,
        captchaValue,
      });

      // Notificación de éxito
      toast.success("✅ Inicio de sesión exitoso");

      // Guardamos el token y redirigimos
      localStorage.setItem("token", res.data.token);
      setTimeout(() => (window.location.href = "/reservas"), 1500);
    } catch (err) {
      // Notificación de error personalizada
      toast.error(`❌ ${err.response?.data?.message || "Error de conexión"}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {/* reCAPTCHA */}
        <ReCAPTCHA
          sitekey="6LcY4PoqAAAAAP3_-8TnWNznGNTsM2hCsCUnMxIo" // Reemplaza con tu clave pública real
          onChange={(value) => setCaptchaValue(value)}
        />

        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
    </div>
  );
};

export default Login;