const express = require('express');
const router = express.Router();
const autenticacionCtrl = require('../controllers/autenticacion');

router.get('/login', autenticacionCtrl.mostrarLogin);
router.post('/login', autenticacionCtrl.procesarLogin);
router.get('/logout', autenticacionCtrl.cerrarSesion);

module.exports = router;
