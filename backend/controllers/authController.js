const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/User');
require('dotenv').config();

// 🎉 **Registro de usuario**
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // ✅ Validar que todos los campos estén completos
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // 📧 **Validar formato de email**
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email no válido' });
        }

        // 🔒 **Validar que la contraseña tenga mínimo 6 caracteres**
        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // 🔍 **Comprobar si el usuario ya existe**
        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'Usuario ya registrado' });

        // 🔐 **Encriptar la contraseña**
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🎯 **Asignar rol por defecto "user" si no viene uno especificado**
        const userRole = role || 'user';

        // ✅ **Crear el usuario**
        const newUser = await createUser(name, email, hashedPassword, userRole);

        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 🔐 **Inicio de sesión**
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ✅ **Validar que email y contraseña estén presentes**
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
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