// routes/tareaRoutes.js

const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea'); 
const auth = require('../middleware/auth'); // Importamos el guardián


// --- Middleware: Proteger TODAS las rutas de Tareas ---
// Todas las peticiones a /api/tareas primero pasan por auth()
router.use(auth); 


// RUTA 1: POST /api/tareas (CREATE - Insertar una Tarea)
router.post('/', async (req, res) => {
    try {
        // Obtenemos el ID del usuario logueado gracias al middleware
        const idUsuario = req.usuario.id; 
        const { titulo, descripcion, fechaLimite, estado } = req.body;

        const nuevaTarea = new Tarea({
            idUsuario: idUsuario, // Asignación de la relación
            titulo, 
            descripcion,
            fechaLimite,
            estado
        });

        const tareaGuardada = await nuevaTarea.save();
        return res.status(201).json({ mensaje: 'Tarea creada exitosamente', tarea: tareaGuardada });

    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al crear la tarea.', error: error.message });
    }
});


// RUTA 2: GET /api/tareas (READ - Consultar SOLO las Tareas del Usuario Logueado)
router.get('/', async (req, res) => {
    try {
        // Usamos el ID del usuario logueado para filtrar la consulta
        const idUsuario = req.usuario.id; 
        const tareas = await Tarea.find({ idUsuario }).sort({ fechaLimite: 1 });

        return res.status(200).json(tareas);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al consultar las tareas.', error: error.message });
    }
});


// RUTA 3: PUT /api/tareas/:id (UPDATE - Actualizar Tarea)
router.put('/:id', async (req, res) => {
    try {
        const idTarea = req.params.id;
        const idUsuario = req.usuario.id; 
        const updates = req.body;
        
        // Buscamos y actualizamos SOLO si la tarea pertenece al usuario logueado
        const tareaActualizada = await Tarea.findOneAndUpdate(
            { _id: idTarea, idUsuario: idUsuario }, // Filtro DOBLE: Seguridad relacional
            updates,                
            { new: true }            
        );

        if (!tareaActualizada) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada o no tienes permisos.' });
        }

        return res.status(200).json({ mensaje: 'Tarea actualizada exitosamente', tarea: tareaActualizada });

    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al actualizar la tarea.', error: error.message });
    }
});


// RUTA 4: DELETE /api/tareas/:id (DELETE - Eliminar Tarea)
router.delete('/:id', async (req, res) => {
    try {
        const idTarea = req.params.id;
        const idUsuario = req.usuario.id; 

        // Eliminamos SOLO si la tarea pertenece al usuario logueado
        const resultado = await Tarea.findOneAndDelete({ _id: idTarea, idUsuario: idUsuario });

        if (!resultado) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada o no tienes permisos.' });
        }

        return res.status(200).json({ mensaje: 'Tarea eliminada correctamente' });

    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al eliminar la tarea.', error: error.message });
    }
    
});


module.exports = router;