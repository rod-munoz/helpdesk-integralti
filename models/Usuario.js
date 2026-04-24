const db = require('../config/basedatos');

// Busca un usuario por email para el login
const buscarPorEmail = async (email) => {
    const [filas] = await db.pool.execute(
        'SELECT u.*, r.nombre_rol FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE u.email = ?',
        [email]
    );
    return filas[0];
};

// Crea un nuevo usuario en la BD
const crear = async (datos) => {
    const { nombre, apellido, email, password_hash, id_rol, id_departamento } = datos;
    const [resultado] = await db.pool.execute(
        'INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol, id_departamento) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, apellido, email, password_hash, id_rol, id_departamento]
    );
    return resultado.insertId;
};

// Obtiene un usuario por ID
const obtenerPorId = async (id_usuario) => {
    const [filas] = await db.pool.execute(
        `SELECT u.*, r.nombre_rol, d.nombre_departamento 
        FROM usuarios u
        JOIN roles r ON u.id_rol = r.id_rol
        JOIN departamentos d ON u.id_departamento = d.id_departamento
        WHERE u.id_usuario = ?`,
        [id_usuario]
    );
    return filas[0];
};

// Actualiza datos personales
const actualizar = async (id_usuario, nombre, apellido) => {
    await db.pool.execute('UPDATE usuarios SET nombre = ?, apellido = ? WHERE id_usuario = ?', [
        nombre,
        apellido,
        id_usuario
    ]);
};

// Actualiza la contraseña
const actualizarPassword = async (id_usuario, password_hash) => {
    await db.pool.execute('UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?', [
        password_hash,
        id_usuario
    ]);
};

// Obtiene todos los usuarios para el listado del técnico
const obtenerTodos = async () => {
    const [filas] = await db.pool.execute(
        `SELECT u.*, r.nombre_rol, d.nombre_departamento
        FROM usuarios u
        JOIN roles r ON u.id_rol = r.id_rol
        JOIN departamentos d ON u.id_departamento = d.id_departamento
        ORDER BY u.fecha_creacion DESC`
    );
    return filas;
};

// Obtiene todos los roles
const obtenerRoles = async () => {
    const [filas] = await db.pool.execute('SELECT * FROM roles ORDER BY id_rol');
    return filas;
};

// Obtiene todos los departamentos
const obtenerDepartamentos = async () => {
    const [filas] = await db.pool.execute(
        'SELECT * FROM departamentos ORDER BY nombre_departamento'
    );
    return filas;
};

// Cambia el estado activo/inactivo de un usuario
const cambiarEstado = async (id_usuario, activo) => {
    await db.pool.execute('UPDATE usuarios SET activo = ? WHERE id_usuario = ?', [
        activo,
        id_usuario
    ]);
};

module.exports = {
    buscarPorEmail,
    crear,
    obtenerPorId,
    actualizar,
    actualizarPassword,
    obtenerTodos,
    obtenerRoles,
    obtenerDepartamentos,
    cambiarEstado
};
