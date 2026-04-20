const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// Muestra el formulario de perfil
const mostrarPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.obtenerPorId(req.usuario.id);
        const rutaVista = req.usuario.rol === 'Técnico' 
            ? 'tecnico/perfil' 
            : 'colaborador/perfil';
        res.render(rutaVista, { usuario, error: null, exito: null });
    } catch (error) {
        console.error('Error al obtener perfil:', error.message);
        res.redirect('/login');
    }
};

// Actualiza datos personales
const actualizarDatos = async (req, res) => {
    const { nombre, apellido } = req.body;
    const rutaVista = req.usuario.rol === 'Técnico' 
        ? 'tecnico/perfil' 
        : 'colaborador/perfil';

    if (!nombre || !apellido) {
        const usuario = await Usuario.obtenerPorId(req.usuario.id);
        return res.render(rutaVista, { 
            usuario, 
            error: 'Nombre y apellido son obligatorios', 
            exito: null 
        });
    }

    try {
        await Usuario.actualizar(req.usuario.id, nombre.trim(), apellido.trim());
        const usuario = await Usuario.obtenerPorId(req.usuario.id);
        res.render(rutaVista, { usuario, error: null, exito: 'Datos actualizados correctamente' });
    } catch (error) {
        console.error('Error al actualizar datos:', error.message);
        res.redirect('/login');
    }
};

// Actualiza la contraseña
const actualizarPassword = async (req, res) => {
    const { password_actual, password_nuevo, password_confirmar } = req.body;
    const rutaVista = req.usuario.rol === 'Técnico' 
        ? 'tecnico/perfil' 
        : 'colaborador/perfil';

    const usuario = await Usuario.obtenerPorId(req.usuario.id);

    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(password_actual, usuario.password_hash);
    if (!passwordValida) {
        return res.render(rutaVista, { 
            usuario, 
            error: 'La contraseña actual es incorrecta', 
            exito: null 
        });
    }

    // Verificar que las nuevas coincidan
    if (password_nuevo !== password_confirmar) {
        return res.render(rutaVista, { 
            usuario, 
            error: 'Las contraseñas nuevas no coinciden', 
            exito: null 
        });
    }

    // Verificar largo minimo
    if (password_nuevo.length < 6) {
        return res.render(rutaVista, { 
            usuario, 
            error: 'La contraseña debe tener al menos 6 caracteres', 
            exito: null 
        });
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
