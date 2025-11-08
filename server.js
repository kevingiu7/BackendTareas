// server.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(express.json()); 
app.use(cors()); 


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