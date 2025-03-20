import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("https://sistema-reservas-final.onrender.com/api/auth/register", {
                name,
                email,
                password,
            });

            alert("Registro exitoso. Inicia sesión ahora.");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Error de conexión");
        }
    };

    return (
        <div className="register-container">
            <h2>Registro de usuario</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <label>Nombre:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>Contraseña:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link></p>
        </div>
    );
};

export default Register;