// middleware/auth.js

const jwt = require('jsonwebtoken');
// Usa la misma clave secreta que definiste en usuarioRoutes.js
const JWT_SECRET = 'MI_CLAVE_SECRETA_LARGA_PARA_JWT_2025'; 


const auth = (req, res, next) => {
    // 1. Obtener el token del header (usualmente: Authorization: Bearer <token>)
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Se requiere un token.' });
    }

    // Extraemos solo el token de "Bearer <token>"
    const token = authHeader.replace('Bearer ', '');

    try {
        // 2. Verificar el token y obtener el payload (el ID del usuario)
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Adjuntar el ID del usuario decodificado a la petición (req.usuario)
        req.usuario = decoded; // req.usuario.id contendrá el _id de MongoDB
        
        // 4. Continuar con la función de la ruta
        next();

    } catch (e) {
        // 401: Token inválido o expirado
        res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
};

module.exports = auth;