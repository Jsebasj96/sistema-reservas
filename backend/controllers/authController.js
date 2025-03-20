const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/User');
require('dotenv').config();

// Registro de usuario
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Usuario ya registrado' });

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Permitir asignar rol solo si es un admin el que registra
    const userRole = req.user && req.user.role === 'admin' ? role : 'user';

    // Crear usuario en la base de datos
    const newUser = await createUser(name, email, hashedPassword, userRole);

    res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Ahora incluimos el role en el token
    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Eliminar la contraseña antes de enviar la respuesta
    delete user.password;

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};