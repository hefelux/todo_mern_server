// RUTAS PARA AUTENTICAR USUARIOS
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const auth = require("../middlewares/auth");

// Login Usuario
// endPoint: /api/auth/login
router.post(
    "/login",
    authController.authenticateUser
);

// Obtener Usuario Autenticado
// endPoint: /api/auth/getuser
router.get(
    "/getuser",
    auth,
    authController.getUser
);

module.exports = router;
