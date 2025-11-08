// models/Tarea.js

const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema({
    // CAMPO RELACIONAL: Esto relaciona esta Tarea con el Usuario que la creó.
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Indica que se relaciona con el modelo 'Usuario'
        required: true
    },
    
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    
    descripcion: {
        type: String,
        required: false
    },
    
    fechaLimite: {
        type: Date, // Para complejidad de manejo de fechas
        required: false
    },
    
    estado: {
        type: String,
        enum: ['pendiente', 'en progreso', 'completada'], // Solo permite estos 3 valores
        default: 'pendiente'
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Tarea', TareaSchema);