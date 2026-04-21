const Ticket = require('../models/Ticket');

// Muestra el listado de tickets del colaborador
const misTickets = async (req, res) => {
    try {
        const tickets = await Ticket.obtenerPorUsuario(req.usuario.id);
        res.render('colaborador/mis-tickets', {
            tickets,
            usuario: req.usuario
        });
    } catch (error) {
        console.error('Error al obtener tickets:', error.message);
        res.render('colaborador/mis-tickets', { tickets: [], usuario: req.usuario });
    }
};

// Muestra el formulario de nuevo ticket
const mostrarNuevoTicket = async (req, res) => {
    try {
        const categorias = await Ticket.obtenerCategorias();
        const prioridades = await Ticket.obtenerPrioridades();
        res.render('colaborador/nuevo-ticket', {
            categorias,
            prioridades,
            usuario: req.usuario,
            error: null
        });
    } catch (error) {
        console.error('Error al cargar formulario:', error.message);
        res.redirect('/colaborador/tickets');
    }
};

// Procesa el formulario de nuevo ticket
const crearTicket = async (req, res) => {
    const { titulo, descripcion, id_categoria, id_prioridad } = req.body;

    // Validacion basica
    if (!titulo || !descripcion || !id_categoria || !id_prioridad) {
        const categorias = await Ticket.obtenerCategorias();
        const prioridades = await Ticket.obtenerPrioridades();
        return res.render('colaborador/nuevo-ticket', {
            categorias,
            prioridades,
            usuario: req.usuario,
            error: 'Todos los campos son obligatorios'
        });
    }

    try {
        await Ticket.crear({
            titulo,
            descripcion,
            id_categoria,
            id_prioridad,
            id_usuario_creador: req.usuario.id
        });
        res.redirect('/colaborador/tickets');
    } catch (error) {
        console.error('Error al crear ticket:', error.message);
        res.redirect('/colaborador/tickets');
    }
};

// Muestra el detalle de un ticket
const detalleTicket = async (req, res) => {
    try {
        const ticket = await Ticket.obtenerPorId(req.params.id);

        // Verificar que el ticket pertenece al colaborador
        if (!ticket || ticket.id_usuario_creador !== req.usuario.id) {
            return res.redirect('/colaborador/tickets');
        }

        res.render('colaborador/detalle-ticket', {
            ticket,
            usuario: req.usuario
        });
    } catch (error) {
        console.error('Error al obtener detalle:', error.message);
        res.redirect('/colaborador/tickets');
    }
};

const Respuesta = require('../models/Respuesta');

// Muestra el detalle con historial de mensajes
const detalleTicketConMensajes = async (req, res) => {
    try {
        const ticket = await Ticket.obtenerPorId(req.params.id);

        if (!ticket || ticket.id_usuario_creador !== req.usuario.id) {
            return res.redirect('/colaborador/tickets');
        }

        const respuestas = await Respuesta.obtenerPorTicket(req.params.id);

        res.render('colaborador/detalle-ticket', {
            ticket,
            respuestas,
            usuario: req.usuario
        });
    } catch (error) {
        console.error('Error al obtener detalle:', error.message);
        res.redirect('/colaborador/tickets');
    }
};

// Procesa el envio de un mensaje
const enviarRespuesta = async (req, res) => {
    const { contenido } = req.body;
    const id_ticket = req.params.id;

    if (!contenido || !contenido.trim()) {
        return res.redirect(`/colaborador/tickets/${id_ticket}`);
    }

    try {
        await Respuesta.crear({
            id_ticket,
            id_usuario:  req.usuario.id,
            contenido:   contenido.trim(),
            nombre_rol:  req.usuario.rol
        });
        res.redirect(`/colaborador/tickets/${id_ticket}`);
    } catch (error) {
        console.error('Error al enviar respuesta:', error.message);
        res.redirect(`/colaborador/tickets/${id_ticket}`);
    }
};

// Cierra un ticket que está en estado Resuelto
const cerrarTicket = async (req, res) => {
    try {
        await Ticket.cerrar(req.params.id, req.usuario.id);
        res.redirect(`/colaborador/tickets/${req.params.id}`);
    } catch (error) {
        console.error('Error al cerrar ticket:', error.message);
        res.redirect(`/colaborador/tickets/${req.params.id}`);
    }
};

module.exports = { 
    misTickets, mostrarNuevoTicket, crearTicket, 
    detalleTicket, detalleTicketConMensajes, 
    enviarRespuesta, cerrarTicket
};
