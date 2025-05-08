const express = require('express');
const router = express.Router();
const pasadiaController = require('../controllers/pasadiaController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/',   verifyToken, pasadiaController.createPasadia);
router.get('/',    verifyToken, pasadiaController.getAllPasadias);

module.exports = router;
