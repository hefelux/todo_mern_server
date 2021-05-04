const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.authenticateUser = async (req, res) => {
    // Revisar si hay errores con express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer email y password
    const { email, password } = req.body;

    try {
        // Validar usuario existente
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "El usuario no existe." });
        }
        // Revisar password
        const isCorrectPassword = await bcryptjs.compare(password, user.password);

        if(!isCorrectPassword) {
            return res.status(400).json({ msg: 'Password incorrecto.'});
        }

        // Si datos correctos crear y firmar JWT
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.SECRET,
            { expiresIn: 3600 },
            (error, token) => {
                if (error) throw error;
                res.json({ token });
            }
        );
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg:"Datos incorrectos."});
    }
};

// Obtener datos de usuario autenticado
exports.getUser = async (req, res) => {
    try {
        // Validar usuario existente
        let user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(400).json({ msg: "El usuario no existe." });
        }
        res.json({ user });

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Hubo un error al obtener el usuario." });
    }
};