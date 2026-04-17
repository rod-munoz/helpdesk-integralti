const jwt = require('jsonwebtoken');

// Verifica que el usuario tenga sesión activa
const verificarSesion = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = datos; // disponible en todos los controladores
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

// Verifica que el usuario sea Técnico
const soloTecnico = (req, res, next) => {
    if (req.usuario.rol !== 'Técnico') {
        return res.redirect('/colaborador/tickets');
    }
    next();
};

// Verifica que el usuario sea Colaborador
const soloColaborador = (req, res, next) => {
    if (req.usuario.rol !== 'Colaborador') {
        return res.redirect('/tecnico/tickets');
    }
    next();
};

module.exports = { verificarSesion, soloTecnico, soloColaborador };
