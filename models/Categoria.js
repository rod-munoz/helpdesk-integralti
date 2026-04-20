const db = require('../config/basedatos');

// Obtiene todas las categorias
const obtenerTodas = async () => {
    const [filas] = await db.pool.execute(
        'SELECT * FROM categorias ORDER BY nombre_categoria'
    );
    return filas;
};

// Crea una nueva categoria
const crear = async (nombre_categoria, descripcion) => {
    await db.pool.execute(
        'INSERT INTO categorias (nombre_categoria, descripcion) VALUES (?, ?)',
        [nombre_categoria, descripcion || null]
    );
};

// Obtiene una categoria por ID
const obtenerPorId = async (id_categoria) => {
    const [filas] = await db.pool.execute(
        'SELECT * FROM categorias WHERE id_categoria = ?',
        [id_categoria]
    );
    return filas[0];
};

// Actualiza nombre y descripcion
const actualizar = async (id_categoria, nombre_categoria, descripcion) => {
    await db.pool.execute(
        'UPDATE categorias SET nombre_categoria = ?, descripcion = ? WHERE id_categoria = ?',
        [nombre_categoria, descripcion || null, id_categoria]
    );
};

// Cambia el estado activo/inactivo
const cambiarEstado = async (id_categoria, activo) => {
    await db.pool.execute(
        'UPDATE categorias SET activo = ? WHERE id_categoria = ?',
        [activo, id_categoria]
    );
};

module.exports = { obtenerTodas, crear, obtenerPorId, actualizar, cambiarEstado };
