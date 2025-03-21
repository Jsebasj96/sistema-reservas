const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Para validar el reCAPTCHA
const { createUser, findUserByEmail } = require('../models/User');
require('dotenv').config();

// 🎉 **Registro de usuario con datos extra**
exports.register = async (req, res) => {
    const { name, email, password, role, phone, address } = req.body;

    try {
        // ✅ **Validación básica de los campos**
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // 📧 **Validar formato de email**
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email no válido' });
        }

        // 🔒 **Validar la longitud de la contraseña**
        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // 📲 **Validar el formato del teléfono (mínimo 7 dígitos)**
        const phoneRegex = /^[0-9]{7,15}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Teléfono no válido' });
        }

        // 🔍 **Comprobar si el usuario ya existe**
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Usuario ya registrado' });
        }

        // 🔐 **Encriptar la contraseña**
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🎯 **Asignar rol por defecto "user" si no viene uno especificado**
        const userRole = role || 'user';

        // ✅ **Crear el usuario con teléfono y dirección incluidos**
        const newUser = await createUser(name, email, hashedPassword, userRole, phone, address);

        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 🔐 **Inicio de sesión con reCAPTCHA**
exports.login = async (req, res) => {
    const { email, password, captchaValue } = req.body;

    try {
        // ✅ **Validar que email y contraseña estén presentes**
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        }

        // 🔥 **Validar el reCAPTCHA con Google**
        if (!captchaValue) {
            return res.status(400).json({ message: 'Completa el reCAPTCHA' });
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Toma la clave secreta desde el .env
        const captchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaValue}`
        );

        if (!captchaResponse.data.success) {
            return res.status(400).json({ message: 'reCAPTCHA no válido' });
        }

        // 🔍 **Buscar al usuario por email**
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // 🔒 **Comparar la contraseña**
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // 🔥 **Crear el token JWT, incluyendo el rol**
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ✨ **Eliminar la contraseña antes de responder**
        const { password: _, ...userData } = user;

        // 🎉 **Responder con token y datos del usuario**
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: userData,
            token
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};