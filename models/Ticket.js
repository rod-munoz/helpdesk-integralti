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

module.exports = { obtenerPorUsuario, obtenerPorId, crear, obtenerCategorias, obtenerPrioridades };
