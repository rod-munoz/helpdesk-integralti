const mongoose = require('mongoose');

// Esquema de cada mensaje dentro del historial
const mensajeSchema = new mongoose.Schema({
    id_usuario:  { type: Number, required: true },
    autor:       { type: String, required: true },
    contenido:   { type: String, required: true },
    fecha:       { type: Date, default: Date.now }
});

// Esquema del documento principal (uno por ticket)
const historialSchema = new mongoose.Schema({
    id_ticket: { type: Number, required: true, unique: true },
    mensajes:  [mensajeSchema]
});

module.exports = mongoose.model('Historial', historialSchema);
