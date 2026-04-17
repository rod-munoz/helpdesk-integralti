const express = require('express');
const router = express.Router();
const tecnicoCtrl = require('../controllers/tecnico');
const { verificarSesion, soloTecnico } = require('../config/middleware');

// Todas las rutas requieren sesion activa y perfil Técnico
router.use(verificarSesion, soloTecnico);

router.get('/tickets',                    tecnicoCtrl.todosLosTickets);
router.get('/tickets/:id',                tecnicoCtrl.detalleTicket);
router.post('/tickets/:id/estado',        tecnicoCtrl.actualizarEstado);
router.post('/tickets/:id/prioridad',     tecnicoCtrl.actualizarPrioridad);

module.exports = router;
