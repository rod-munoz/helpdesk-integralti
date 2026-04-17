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

module.exports = { buscarPorEmail, crear };
