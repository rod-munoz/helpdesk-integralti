const express = require('express');
const router = express.Router();
const tecnicoCtrl = require('../controllers/tecnico');
const { verificarSesion, soloTecnico } = require('../config/middleware');

router.use(verificarSesion, soloTecnico);

router.get('/tickets', tecnicoCtrl.todosLosTickets);
router.get('/tickets/:id', tecnicoCtrl.detalleTicketConMensajes);
router.post('/tickets/:id/estado', tecnicoCtrl.actualizarEstado);
router.post('/tickets/:id/prioridad', tecnicoCtrl.actualizarPrioridad);
router.post('/tickets/:id/respuesta', tecnicoCtrl.enviarRespuesta);

module.exports = router;