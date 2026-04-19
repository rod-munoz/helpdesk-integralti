const db = require('../config/basedatos');
const Historial = require('./Historial');

// Obtiene todas las respuestas de un ticket desde MySQL
const obtenerPorTicket = async (id_ticket) => {
    const [filas] = await db.pool.execute(
        `SELECT r.*, u.nombre, u.apellido, ro.nombre_rol
        FROM respuestas r
        JOIN usuarios u ON r.id_usuario = u.id_usuario
        JOIN roles ro ON u.id_rol = ro.id_rol
        WHERE r.id_ticket = ?
        ORDER BY r.fecha_respuesta ASC`,
        [id_ticket]
    );
    return filas;
};

// Guarda una respuesta en MySQL y registra en MongoDB
const crear = async (datos) => {
    const { id_ticket, id_usuario, contenido, nombre_rol } = datos;

    // Guardar en MySQL
    await db.pool.execute(
        'INSERT INTO respuestas (id_ticket, id_usuario, contenido) VALUES (?, ?, ?)',
        [id_ticket, id_usuario, contenido]
    );

    // Registrar en MongoDB — busca el documento del ticket o lo crea
    await Historial.findOneAndUpdate(
        { id_ticket },
        {
            $push: {
                mensajes: {
                    id_usuario,
                    autor: nombre_rol,
                    contenido,
                    fecha: new Date()
                }
            }
        },
        { upsert: true, returnDocument: 'after' }
    );
};

module.exports = { obtenerPorTicket, crear };
