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

module.exports = { misTickets, mostrarNuevoTicket, crearTicket, detalleTicket };
