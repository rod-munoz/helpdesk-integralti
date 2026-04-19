const express = require('express');
const router = express.Router();
const colaboradorCtrl = require('../controllers/colaborador');
const { verificarSesion, soloColaborador } = require('../config/middleware');

router.use(verificarSesion, soloColaborador);

router.get('/tickets',                        colaboradorCtrl.misTickets);
router.get('/tickets/nuevo',                  colaboradorCtrl.mostrarNuevoTicket);
router.post('/tickets/nuevo',                 colaboradorCtrl.crearTicket);
router.get('/tickets/:id',                    colaboradorCtrl.detalleTicketConMensajes);
router.post('/tickets/:id/respuesta',         colaboradorCtrl.enviarRespuesta);

module.exports = router;