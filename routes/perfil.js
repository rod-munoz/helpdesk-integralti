const express = require('express');
const router = express.Router();
const perfilCtrl = require('../controllers/perfil');
const { verificarSesion } = require('../config/middleware');

// Ambos perfiles pueden acceder
router.use(verificarSesion);

router.get('/', perfilCtrl.mostrarPerfil);
router.post('/datos', perfilCtrl.actualizarDatos);
router.post('/password', perfilCtrl.actualizarPassword);

module.exports = router;
