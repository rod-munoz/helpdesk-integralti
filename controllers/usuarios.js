const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// Muestra listado de usuarios y formulario de creacion
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
            exito: null
        });
    } catch (error) {
        console.error('Error al listar usuarios:', error.message);
        res.redirect('/tecnico/tickets');
    }
};

// Procesa la creacion de un nuevo usuario
const crear = async (req, res) => {
    // Sanitizar entradas
    const nombre = (req.body.nombre || '').trim();
    const apellido = (req.body.apellido || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = (req.body.password || '').trim();
    const confirmar = (req.body.confirmar || '').trim();
    const id_rol = req.body.id_rol;
    const id_departamento = req.body.id_departamento;

    // Funcion auxiliar para re-renderizar con error
    const renderConError = async (error) => {
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
            exito: null
        });
    };

    // Validaciones
    if (!nombre || !apellido || !email || !password || !confirmar || !id_rol || !id_departamento) {
        return renderConError('Todos los campos son obligatorios');
    }

    // Validar formato de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        return renderConError('El correo electrónico no tiene un formato válido');
    }

    if (password.length < 6) {
        return renderConError('La contraseña debe tener al menos 6 caracteres');
    }

    if (password !== confirmar) {
        return renderConError('Las contraseñas no coinciden');
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
            exito: `Usuario ${nombre} ${apellido} creado correctamente`
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
