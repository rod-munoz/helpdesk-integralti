const express = require('express');
const router = express.Router();
const usuariosCtrl = require('../controllers/usuarios');
const { verificarSesion, soloTecnico } = require('../config/middleware');

router.use(verificarSesion, soloTecnico);

router.get('/', usuariosCtrl.listar);
router.post('/', usuariosCtrl.crear);
router.post('/:id/estado', usuariosCtrl.cambiarEstado);

module.exports = router;
