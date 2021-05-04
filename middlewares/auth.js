const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    // Leer el token del header
    const token = req.header('x-auth-token');
    // Revisar si no hay token
    if(!token) {
        return res.status(401).json({ msg: 'El token no ha sido encontrado. Permiso no válido.'})
    }
    // Validar token
    try {
        const encryption = jwt.verify(token, process.env.SECRET);
        req.user = encryption.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'El token no es válido o está expirado.'})
    }
}