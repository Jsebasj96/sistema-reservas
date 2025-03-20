const express = require('express');
const { getUserById, updateUser, deleteUser } = require('../models/User');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Obtener perfil del usuario autenticado
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar datos del usuario autenticado
router.put('/profile', verifyToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await updateUser(req.user.userId, name, email);
    res.json({ message: 'Usuario actualizado con éxito', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar cuenta del usuario autenticado
router.delete('/profile', verifyToken, async (req, res) => {
  try {
    const deletedUser = await deleteUser(req.user.userId);
    if (!deletedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Cuenta eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;