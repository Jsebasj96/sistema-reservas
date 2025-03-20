import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("https://sistema-reservas-final.onrender.com/api/auth/login", {
                email,
                password,
            });

            console.log(res.data);
            alert("Inicio de sesión exitoso");
            localStorage.setItem("token", res.data.token);
            window.location.href = "/reservas";  // Redirige a la página de reservas
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

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;