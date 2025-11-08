// routes/usuarioRoutes.js

const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario'); 
// Librerías de seguridad
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Clave Secreta para firmar el token JWT. (DEBE IR EN EL .ENV EN PRODUCCIÓN)
const JWT_SECRET = 'MI_CLAVE_SECRETA_LARGA_PARA_JWT_2025'; 


// RUTA 1: POST /api/usuarios/registro (CREATE - INSERTAR SEGURO)
router.post('/registro', async (req, res) => {
    try {
        // CORRECCIÓN CLAVE: Desestructurar TODOS los campos que vienen del Body
        const { 
            idUsuario, 
            NombreUsuario, 
            ApellidoUsuarioPaterno, 
            ApellidoUsuarioMaterno, 
            CorreoUsuario, 
            TelefonoUsuario, 
            password // El campo de seguridad
        } = req.body; 
        
        // 1. Verificar si el usuario ya existe por Correo o ID
        const usuarioExistente = await Usuario.findOne({ 
            $or: [{ CorreoUsuario: CorreoUsuario }, { idUsuario: idUsuario }] 
        });

        if (usuarioExistente) {
            // Devolver un error 409 (Conflict) si ya existe.
            return res.status(409).json({ 
                mensaje: 'Error al registrar: El ID o correo electrónico ya están en uso.'
            });
        }
        
        // 2. Cifrar la Contraseña (Hash) - Usa 10 rondas de salting
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Crear el nuevo usuario con la contraseña Cifrada
        const nuevoUsuario = new Usuario({
            idUsuario, 
            NombreUsuario,
            ApellidoUsuarioPaterno, // <--- Ahora se usa la variable desestructurada
            ApellidoUsuarioMaterno, // <--- Ahora se usa la variable desestructurada
            CorreoUsuario,
            TelefonoUsuario, // <--- Ahora se usa la variable desestructurada
            password: hashedPassword // El hash seguro
        });

        const usuarioGuardado = await nuevoUsuario.save(); 
        
        // 4. Devolver la respuesta
        return res.status(201).json({ 
            mensaje: 'Usuario registrado exitosamente', 
            id: usuarioGuardado._id,
            correo: usuarioGuardado.CorreoUsuario
        });

    } catch (error) {
        // Manejo de error genérico (ej. si Mongoose encuentra un required: true faltante)
        console.error("Error de registro:", error);
        return res.status(500).json({ 
            mensaje: 'Error interno del servidor durante el registro.', 
            error: error.message 
        });
    }
});


// RUTA 2: POST /api/usuarios/login (INICIO DE SESIÓN)
router.post('/login', async (req, res) => {
    try {
        // Solo necesitamos correo y contraseña
        const { CorreoUsuario, password } = req.body;

        // 1. Encontrar al usuario
        const usuario = await Usuario.findOne({ CorreoUsuario });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario o contraseña inválida.' });
        }

        // 2. Comparar la contraseña (Promise)
        const isMatch = await bcrypt.compare(password, usuario.password); 

        if (!isMatch) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña inválida.' });
        }

        // 3. Generar el JSON Web Token (JWT)
        const token = jwt.sign(
            { id: usuario._id, correo: usuario.CorreoUsuario }, 
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        // 4. Devolver el token
        return res.status(200).json({ 
            mensaje: 'Inicio de sesión exitoso', 
            token,
            idUsuario: usuario.idUsuario
        });

    } catch (error) {
        return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
});


// RUTA 3, 4, 5, 6: El antiguo CRUD (Ahora solo se usa para fines administrativos)

// RUTA 3: GET /api/usuarios (READ - CONSULTAR TODOS)
router.get('/', async (req, res) => {
    try {
        // Opcional: Aquí podrías añadir el middleware auth para proteger esta ruta
        const usuarios = await Usuario.find({}).select('-password'); // No mostrar contraseñas
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al consultar', error: error.message });
    }
});
// ... (El resto del CRUD PUT y DELETE que ya tenías)
router.put('/:idUsuario', async (req, res) => { /* ... código ... */ });
router.delete('/:idUsuario', async (req, res) => { /* ... código ... */ });


module.exports = router;