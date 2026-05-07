const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// Muestra listado de usuarios y formulario de creación
const listar = async (req, res) => {
    try {
        const [usuarios, roles, departamentos] = await Promise.all([
            Usuario.obtenerTodos(),
            Usuario.obtenerRoles(),
            Usuario.obtenerDepartamentos()
        ]);
        res.render('tecnico/usuarios', {
            usuarios,
            roles,
            departamentos,
            usuario: req.usuario,
            error: null,
            exito: null,
            valores: null
        });
    } catch (error) {
        console.error('Error al listar usuarios:', error.message);
        res.redirect('/tecnico/tickets');
    }
};

// Procesa la creación de un nuevo usuario
const crear = async (req, res) => {
    // Sanitizar entradas
    const nombre = (req.body.nombre || '').trim();
    const apellido = (req.body.apellido || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = (req.body.password || '').trim();
    const confirmar = (req.body.confirmar || '').trim();
    const id_rol = req.body.id_rol;
    const id_departamento = req.body.id_departamento;

    // Función auxiliar para re-renderizar con error
    const renderConError = async (error, valores = {}) => {
        const [usuarios, roles, departamentos] = await Promise.all([
            Usuario.obtenerTodos(),
            Usuario.obtenerRoles(),
            Usuario.obtenerDepartamentos()
        ]);
        return res.render('tecnico/usuarios', {
            usuarios,
            roles,
            departamentos,
            usuario: req.usuario,
            error,
            exito: null,
            valores
        });
    };

    // Validaciones
    if (!nombre || !apellido || !email || !password || !confirmar || !id_rol || !id_departamento) {
        return renderConError('Todos los campos son obligatorios');
    }

    // Validar formato de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        return renderConError('El correo electrónico no tiene un formato válido', {
            nombre,
            apellido,
            email,
            id_rol,
            id_departamento
        });
    }
    if (email.length > 100) {
        return renderConError('El correo electrónico no puede superar 100 caracteres', {
            nombre,
            apellido,
            email,
            id_rol,
            id_departamento
        });
    }
    if (password.length < 6) {
        return renderConError('La contraseña debe tener al menos 6 caracteres', {
            nombre,
            apellido,
            email,
            id_rol,
            id_departamento
        });
    }
    if (password !== confirmar) {
        return renderConError('Las contraseñas no coinciden', {
            nombre,
            apellido,
            email,
            id_rol,
            id_departamento
        });
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);
        await Usuario.crear({ nombre, apellido, email, password_hash, id_rol, id_departamento });

        const [usuarios, roles, departamentos] = await Promise.all([
            Usuario.obtenerTodos(),
            Usuario.obtenerRoles(),
            Usuario.obtenerDepartamentos()
        ]);
        res.render('tecnico/usuarios', {
            usuarios,
            roles,
            departamentos,
            usuario: req.usuario,
            error: null,
            exito: `Usuario ${nombre} ${apellido} creado correctamente`,
            valores: null
        });
    } catch (error) {
        const mensajeError =
            error.code === 'ER_DUP_ENTRY'
                ? 'Ya existe un usuario registrado con ese correo'
                : 'Error al crear el usuario';
        return renderConError(mensajeError);
    }
};

// Activa o desactiva un usuario
const cambiarEstado = async (req, res) => {
    try {
        const usuarioObj = await Usuario.obtenerPorId(req.params.id);
        if (!usuarioObj) return res.redirect('/tecnico/usuarios');
        await Usuario.cambiarEstado(req.params.id, !usuarioObj.activo);
        res.redirect('/tecnico/usuarios');
    } catch (error) {
        console.error('Error al cambiar estado:', error.message);
        res.redirect('/tecnico/usuarios');
    }
};

module.exports = { listar, crear, cambiarEstado };
