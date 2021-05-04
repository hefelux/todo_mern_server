const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
    // Revisar si hay errores con express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    // Extraer email y password
    const { email, password } = req.body;

    try {
        // Validar usuario preexistente
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "El usuario ya existe." });
        }
        // Create
        user = new User(req.body);
        console.log(req.body);
        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);
        // save
        await user.save();

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
        res.status(400).send("Hubo un error al crear el usuario");
    }
};
