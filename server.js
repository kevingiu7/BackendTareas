// server.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// **INICIO DE CÓDIGO CORREGIDO PARA CORS**
// 1. Define el origen permitido (Tu URL publicada en Netlify)
const allowedOrigins = ['https://gestortareasusuarios.netlify.app']; 

// 2. Configuración de CORS
app.use(cors({
    origin: function(origin, callback){
        // Permitir peticiones sin 'origin' (como las de Postman)
        if(!origin) return callback(null, true); 
        
        // Permitir solo si el origin está en la lista de permitidos
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = 'La política CORS no permite el acceso desde el Origen especificado.';
            // En caso de fallo, devolvemos el error 
            return callback(new Error(msg), false);
        }
        // Si el origen es permitido (Netlify), damos acceso
        return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos CRUD que usamos
    credentials: true
}));


// --- 1. Conexión a MongoDB Atlas ---
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Base de Datos Conectada: MongoDB Atlas'))
    .catch(err => console.error('❌ Error de conexión a MongoDB:', err.message));


// --- 2. Rutas del API ---
// Necesita que routes/usuarioRoutes.js exista
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/tareas', require('./routes/tareaRoutes'));

app.get('/', (req, res) => {
    res.send('API de Registro y CRUD lista para operar.');
});


// --- 3. Iniciar el Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
});