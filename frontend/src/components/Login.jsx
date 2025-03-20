import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Si el usuario no completa el captcha, mostramos error
    if (!captchaValue) {
      setError("⚠️ Por favor completa el reCAPTCHA");
      return;
    }

    try {
      const res = await axios.post("https://sistema-reservas-final.onrender.com/api/auth/login", {
        email,
        password,
        captchaValue,
      });

      alert("Inicio de sesión exitoso");
      localStorage.setItem("token", res.data.token);
      window.location.href = "/reservas";
    } catch (err) {
      setError(err.response?.data?.message || "Error de conexión");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {/* Aquí agregamos el reCAPTCHA */}
        <ReCAPTCHA
          sitekey="6LcY4PoqAAAAAP3_-8TnWNznGNTsM2hCsCUnMxIo" // Reemplaza con tu clave pública de Google
          onChange={(value) => setCaptchaValue(value)}
        />

        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
    </div>
  );
};

export default Login;