const db = require('../config/basedatos');

// Obtiene todos los tickets de un colaborador específico
const obtenerPorUsuario = async (id_usuario) => {
    const [filas] = await db.pool.execute(
        `SELECT t.*, 
            e.nombre_estado, 
            p.nombre_prioridad, 
            p.color,
            c.nombre_categoria
        FROM tickets t
        JOIN estados e ON t.id_estado = e.id_estado
        JOIN prioridades p ON t.id_prioridad = p.id_prioridad
        JOIN categorias c ON t.id_categoria = c.id_categoria
        WHERE t.id_usuario_creador = ?
        ORDER BY t.fecha_creacion DESC`,
        [id_usuario]
    );
    return filas;
};

// Obtiene un ticket por su ID con todos sus datos relacionados
const obtenerPorId = async (id_ticket) => {
    const [filas] = await db.pool.execute(
        `SELECT t.*, 
            e.nombre_estado,
            p.nombre_prioridad,
            p.color,
            c.nombre_categoria,
            u.nombre AS nombre_creador,
            u.apellido AS apellido_creador
        FROM tickets t
        JOIN estados e ON t.id_estado = e.id_estado
        JOIN prioridades p ON t.id_prioridad = p.id_prioridad
        JOIN categorias c ON t.id_categoria = c.id_categoria
        JOIN usuarios u ON t.id_usuario_creador = u.id_usuario
        WHERE t.id_ticket = ?`,
        [id_ticket]
    );
    return filas[0];
};

// Crea un nuevo ticket
const crear = async (datos) => {
    const { titulo, descripcion, id_categoria, id_prioridad, id_usuario_creador } = datos;
    const [resultado] = await db.pool.execute(
        `INSERT INTO tickets 
            (titulo, descripcion, id_estado, id_prioridad, id_categoria, id_usuario_creador)
        VALUES (?, ?, 1, ?, ?, ?)`,
        [titulo, descripcion, id_prioridad, id_categoria, id_usuario_creador]
    );
    return resultado.insertId;
};

// Obtiene todas las categorías activas (para el formulario)
const obtenerCategorias = async () => {
    const [filas] = await db.pool.execute(
        'SELECT * FROM categorias WHERE activo = TRUE ORDER BY nombre_categoria'
    );
    return filas;
};

// Obtiene todas las prioridades (para el formulario)
const obtenerPrioridades = async () => {
    const [filas] = await db.pool.execute(
        'SELECT * FROM prioridades ORDER BY id_prioridad'
    );
    return filas;
};

// Obtiene todos los tickets del sistema para el panel técnico
const obtenerTodos = async (filtros = {}) => {
    let consulta = `
        SELECT t.*, 
            e.nombre_estado,
            p.nombre_prioridad,
            p.color,
            c.nombre_categoria,
            u.nombre AS nombre_creador,
            u.apellido AS apellido_creador
        FROM tickets t
        JOIN estados e ON t.id_estado = e.id_estado
        JOIN prioridades p ON t.id_prioridad = p.id_prioridad
        JOIN categorias c ON t.id_categoria = c.id_categoria
        JOIN usuarios u ON t.id_usuario_creador = u.id_usuario
        WHERE 1=1
    `;
    const parametros = [];

    if (filtros.id_estado) {
        consulta += ' AND t.id_estado = ?';
        parametros.push(filtros.id_estado);
    }
    if (filtros.id_categoria) {
        consulta += ' AND t.id_categoria = ?';
        parametros.push(filtros.id_categoria);
    }
    if (filtros.id_prioridad) {
        consulta += ' AND t.id_prioridad = ?';
        parametros.push(filtros.id_prioridad);
    }

    consulta += ' ORDER BY t.fecha_creacion DESC';
    const [filas] = await db.pool.execute(consulta, parametros);
    return filas;
};

// Cambia el estado de un ticket
const cambiarEstado = async (id_ticket, id_estado) => {
    // Si el estado es Cerrado (4), registra la fecha de cierre
    const fechaCierre = id_estado == 4 ? new Date() : null;
    await db.pool.execute(
        'UPDATE tickets SET id_estado = ?, fecha_cierre = ? WHERE id_ticket = ?',
        [id_estado, fechaCierre, id_ticket]
    );
};

// Cambia la prioridad de un ticket
const cambiarPrioridad = async (id_ticket, id_prioridad) => {
    await db.pool.execute(
        'UPDATE tickets SET id_prioridad = ? WHERE id_ticket = ?',
        [id_prioridad, id_ticket]
    );
};

// Obtiene todos los estados (para el formulario)
const obtenerEstados = async () => {
    const [filas] = await db.pool.execute('SELECT * FROM estados ORDER BY id_estado');
    return filas;
};

// Resumen de tickets por estado para las tarjetas del panel
const obtenerResumen = async () => {
    const [filas] = await db.pool.execute(`
        SELECT e.nombre_estado, COUNT(t.id_ticket) AS total
        FROM estados e
        LEFT JOIN tickets t ON e.id_estado = t.id_estado
        GROUP BY e.id_estado, e.nombre_estado
        ORDER BY e.id_estado
    `);
    return filas;
};

// Cierra un ticket (solo si está en estado Resuelto)
const cerrar = async (id_ticket, id_usuario_creador) => {
    await db.pool.execute(
        `UPDATE tickets SET id_estado = 4, fecha_cierre = NOW() 
        WHERE id_ticket = ? AND id_usuario_creador = ? AND id_estado = 3`,
        [id_ticket, id_usuario_creador]
    );
};

module.exports = { 
    obtenerPorUsuario, obtenerPorId, crear, 
    obtenerCategorias, obtenerPrioridades,
    obtenerTodos, cambiarEstado, cambiarPrioridad, 
    obtenerEstados, obtenerResumen, cerrar
};
