const Categoria = require('../models/Categoria');

// Lista todas las categorías
const listar = async (req, res) => {
    try {
        const categorias = await Categoria.obtenerTodas();
        res.render('tecnico/categorias', { categorias, usuario: req.usuario, error: null });
    } catch (error) {
        console.error('Error al listar categorias:', error.message);
        res.redirect('/tecnico/tickets');
    }
};

// Procesa creación de nueva categoría
const crear = async (req, res) => {
    const { nombre_categoria, descripcion } = req.body;

    if (!nombre_categoria || !nombre_categoria.trim()) {
        const categorias = await Categoria.obtenerTodas();
        return res.render('tecnico/categorias', {
            categorias,
            usuario: req.usuario,
            error: 'El nombre de la categoria es obligatorio'
        });
    }

    try {
        await Categoria.crear(nombre_categoria.trim(), descripcion);
        res.redirect('/tecnico/categorias');
    } catch (error) {
        console.error('Error al crear categoria:', error.message);
        res.redirect('/tecnico/categorias');
    }
};

// Muestra formulario de edición
const mostrarEditar = async (req, res) => {
    try {
        const categoria = await Categoria.obtenerPorId(req.params.id);
        if (!categoria) return res.redirect('/tecnico/categorias');
        res.render('tecnico/editar-categoria', { categoria, usuario: req.usuario, error: null });
    } catch (error) {
        console.error('Error al obtener categoria:', error.message);
        res.redirect('/tecnico/categorias');
    }
};

// Procesa edición de categoría
const actualizar = async (req, res) => {
    const { nombre_categoria, descripcion } = req.body;

    if (!nombre_categoria || !nombre_categoria.trim()) {
        const categoria = await Categoria.obtenerPorId(req.params.id);
        return res.render('tecnico/editar-categoria', {
            categoria,
            usuario: req.usuario,
            error: 'El nombre de la categoria es obligatorio'
        });
    }

    try {
        await Categoria.actualizar(req.params.id, nombre_categoria.trim(), descripcion);
        res.redirect('/tecnico/categorias');
    } catch (error) {
        console.error('Error al actualizar categoria:', error.message);
        res.redirect('/tecnico/categorias');
    }
};

// Activa o desactiva una categoría
const cambiarEstado = async (req, res) => {
    try {
        const categoria = await Categoria.obtenerPorId(req.params.id);
        await Categoria.cambiarEstado(req.params.id, !categoria.activo);
        res.redirect('/tecnico/categorias');
    } catch (error) {
        console.error('Error al cambiar estado:', error.message);
        res.redirect('/tecnico/categorias');
    }
};

module.exports = { listar, crear, mostrarEditar, actualizar, cambiarEstado };
