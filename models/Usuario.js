// models/Usuario.js

const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    idUsuario: { type: String, required: true, unique: true }, 
    NombreUsuario: { type: String, required: true },
    ApellidoUsuarioPaterno: { type: String, required: true },
    ApellidoUsuarioMaterno: { type: String },
    CorreoUsuario: { type: String, required: true, unique: true },
    TelefonoUsuario: { type: String },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);