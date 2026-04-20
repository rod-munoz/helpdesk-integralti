const express = require('express');
const router = express.Router();
const categoriasCtrl = require('../controllers/categorias');
const { verificarSesion, soloTecnico } = require('../config/middleware');

router.use(verificarSesion, soloTecnico);

router.get('/',              categoriasCtrl.listar);
router.post('/',             categoriasCtrl.crear);
router.get('/:id/editar',    categoriasCtrl.mostrarEditar);
router.post('/:id/editar',   categoriasCtrl.actualizar);
router.post('/:id/estado',   categoriasCtrl.cambiarEstado);

module.exports = router;
