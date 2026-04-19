const Ticket = require('../models/Ticket');

// Muestra el panel principal con todos los tickets
const todosLosTickets = async (req, res) => {
    try {
        const filtros = {
            id_estado:    req.query.estado    || null,
            id_categoria: req.query.categoria || null,
            id_prioridad: req.query.prioridad || null
        };

        // Elimina filtros vacíos
        Object.keys(filtros).forEach(k => !filtros[k] && delete filtros[k]);

        const [tickets, resumen, estados, categorias, prioridades] = await Promise.all([
            Ticket.obtenerTodos(filtros),
            Ticket.obtenerResumen(),
            Ticket.obtenerEstados(),
            Ticket.obtenerCategorias(),
            Ticket.obtenerPrioridades()
        ]);

        res.render('tecnico/todos-tickets', {
            tickets,
            resumen,
            estados,
            categorias,
            prioridades,
            filtros: req.query,
            usuario: req.usuario
        });
    } catch (error) {
        console.error('Error al obtener tickets:', error.message);
        res.render('tecnico/todos-tickets', {
            tickets: [], resumen: [], estados: [],
            categorias: [], prioridades: [],
            filtros: {}, usuario: req.usuario
        });
    }
};

// Muestra el detalle de un ticket
const detalleTicket = async (req, res) => {
    try {
        const [ticket, estados, prioridades] = await Promise.all([
            Ticket.obtenerPorId(req.params.id),
            Ticket.obtenerEstados(),
            Ticket.obtenerPrioridades()
        ]);

        if (!ticket) return res.redirect('/tecnico/tickets');

        res.render('tecnico/detalle-ticket', {
            ticket,
            estados,
            prioridades,
            usuario: req.usuario
        });
    } catch (error) {
        console.error('Error al obtener detalle:', error.message);
        res.redirect('/tecnico/tickets');
    }
};

// Cambia el estado de un ticket
const actualizarEstado = async (req, res) => {
    try {
        await Ticket.cambiarEstado(req.params.id, req.body.id_estado);
        res.redirect(`/tecnico/tickets/${req.params.id}`);
    } catch (error) {
        console.error('Error al cambiar estado:', error.message);
        res.redirect('/tecnico/tickets');
    }
};

// Cambia la prioridad de un ticket
const actualizarPrioridad = async (req, res) => {
    try {
        await Ticket.cambiarPrioridad(req.params.id, req.body.id_prioridad);
        res.redirect(`/tecnico/tickets/${req.params.id}`);
    } catch (error) {
        console.error('Error al cambiar prioridad:', error.message);
        res.redirect('/tecnico/tickets');
    }
};

const Respuesta = require('../models/Respuesta');

// Muestra detalle con historial de mensajes
const detalleTicketConMensajes = async (req, res) => {
    try {
        const [ticket, estados, prioridades, respuestas] = await Promise.all([
            Ticket.obtenerPorId(req.params.id),
            Ticket.obtenerEstados(),
            Ticket.obtenerPrioridades(),
            Respuesta.obtenerPorTicket(req.params.id)
        ]);

        if (!ticket) return res.redirect('/tecnico/tickets');

        res.render('tecnico/detalle-ticket', {
            ticket,
            estados,
            prioridades,
            respuestas,
            usuario: req.usuario
        });
    } catch (error) {
        console.error('Error al obtener detalle:', error.message);
        res.redirect('/tecnico/tickets');
    }
};

// Procesa el envio de un mensaje
const enviarRespuesta = async (req, res) => {
    const { contenido } = req.body;
    const id_ticket = req.params.id;

    if (!contenido || !contenido.trim()) {
        return res.redirect(`/tecnico/tickets/${id_ticket}`);
    }

    try {
        await Respuesta.crear({
            id_ticket,
            id_usuario:  req.usuario.id,
            contenido:   contenido.trim(),
            nombre_rol:  req.usuario.rol
        });
        res.redirect(`/tecnico/tickets/${id_ticket}`);
    } catch (error) {
        console.error('Error al enviar respuesta:', error.message);
        res.redirect(`/tecnico/tickets/${id_ticket}`);
    }
};

module.exports = { 
    todosLosTickets, detalleTicket, actualizarEstado, actualizarPrioridad,
    detalleTicketConMensajes, enviarRespuesta
};
