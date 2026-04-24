const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Muestra el formulario de login
const mostrarLogin = (req, res) => {
    res.render('login', { error: null });
};

// Procesa el formulario de login
const procesarLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe
        const usuario = await Usuario.buscarPorEmail(email);
        if (!usuario) {
            return res.render('login', { error: 'Email o contraseña incorrectos' });
        }

        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValida) {
            return res.render('login', { error: 'Email o contraseña incorrectos' });
        }

        // Verificar que la cuenta esté activa
        if (!usuario.activo) {
            return res.render('login', { error: 'Cuenta deshabilitada, contacta al administrador' });
        }

        // Crear token JWT con datos del usuario
        const token = jwt.sign(
            {
                id:       usuario.id_usuario,
                nombre:   usuario.nombre,
                apellido: usuario.apellido,
                rol:      usuario.nombre_rol
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Guardar token en cookie segura
        res.cookie('token', token, { httpOnly: true });

        // Redirigir según perfil
        if (usuario.nombre_rol === 'Técnico') {
            return res.redirect('/tecnico/tickets');
        }
        return res.redirect('/colaborador/tickets');

    } catch (error) {
        console.error('Error en login:', error.message);
        res.render('login', { error: 'Error del servidor, intenta de nuevo' });
    }
};

// Cierra la sesión eliminando la cookie
const cerrarSesion = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};

module.exports = { mostrarLogin, procesarLogin, cerrarSesion };
