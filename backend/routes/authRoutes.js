const express = require('express');
const { check, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Registro de usuario con validaciones
router.post(
  '/register',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

router.post('/login', login);

module.exports = router;