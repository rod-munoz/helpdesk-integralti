const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// Muestra el formulario de perfil
const mostrarPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.obtenerPorId(req.usuario.id);
        const rutaVista = req.usuario.rol === 'Técnico' ? 'tecnico/perfil' : 'colaborador/perfil';
        res.render(rutaVista, { usuario, error: null, exito: null });
    } catch (error) {
        console.error('Error al obtener perfil:', error.message);
        res.redirect('/login');
    }
};

// Actualiza datos personales
const actualizarDatos = async (req, res) => {
    const nombre = (req.body.nombre || '').trim();
    const apellido = (req.body.apellido || '').trim();
    const rutaVista = req.usuario.rol === 'Técnico' ? 'tecnico/perfil' : 'colaborador/perfil';

    if (!nombre || !apellido) {
        const usuario = await Usuario.obtenerPorId(req.usuario.id);
        return res.render(rutaVista, {
            usuario,
            error: 'Nombre y apellido son obligatorios',
            exito: null
        });
    }

    try {
        await Usuario.actualizar(req.usuario.id, nombre, apellido);
        const usuario = await Usuario.obtenerPorId(req.usuario.id);
        res.render(rutaVista, { usuario, error: null, exito: 'Datos actualizados correctamente' });
    } catch (error) {
        console.error('Error al actualizar datos:', error.message);
        res.redirect('/login');
    }
};

// Actualiza la contraseña
const actualizarPassword = async (req, res) => {
    const password_actual = (req.body.password_actual || '').trim();
    const password_nuevo = (req.body.password_nuevo || '').trim();
    const password_confirmar = (req.body.password_confirmar || '').trim();
    const rutaVista = req.usuario.rol === 'Técnico' ? 'tecnico/perfil' : 'colaborador/perfil';

    const usuario = await Usuario.obtenerPorId(req.usuario.id);

    const renderConError = (error) => res.render(rutaVista, { usuario, error, exito: null });

    const passwordValida = await bcrypt.compare(password_actual, usuario.password_hash);
    if (!passwordValida) {
        return renderConError('La contraseña actual es incorrecta');
    }

    if (password_nuevo.length < 6) {
        return renderConError('La contraseña debe tener al menos 6 caracteres');
    }

    if (password_nuevo !== password_confirmar) {
        return renderConError('Las contraseñas nuevas no coinciden');
    }

    try {
        const hash = await bcrypt.hash(password_nuevo, 10);
        await Usuario.actualizarPassword(req.usuario.id, hash);
        res.render(rutaVista, {
            usuario,
            error: null,
            exito: 'Contraseña actualizada correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar password:', error.message);
        res.redirect('/login');
    }
};

module.exports = { mostrarPerfil, actualizarDatos, actualizarPassword };
