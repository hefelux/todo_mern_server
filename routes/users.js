// RUTAS PARA CREAR USUARIOS
const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

// Crear Usuario
// endPoint: /api/users/create
router.post('/create', [
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe tener mínimo 6 carácteres').isLength({ min: 6 })
], userController.createUser);

module.exports = router;