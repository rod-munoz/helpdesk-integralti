const express = require('express');
const router = express.Router();
const colaboradorCtrl = require('../controllers/colaborador');
const { verificarSesion, soloColaborador } = require('../config/middleware');

// Todas las rutas requieren sesion activa y perfil Colaborador
router.use(verificarSesion, soloColaborador);

router.get('/tickets',           colaboradorCtrl.misTickets);
router.get('/tickets/nuevo',     colaboradorCtrl.mostrarNuevoTicket);
router.post('/tickets/nuevo',    colaboradorCtrl.crearTicket);
router.get('/tickets/:id',       colaboradorCtrl.detalleTicket);

module.exports = router;
