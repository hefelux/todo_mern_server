// RUTAS PARA PROYECTOS
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { check } = require("express-validator");
const auth = require('../middlewares/auth');

// Projects
// endPoint: /projects
router.post(
    "/create",
    auth,
    [check("name", "El nombre del proyecto es obligatorio.").not().isEmpty()],
    projectController.createProject
);
router.get(
    "/",
    auth,
    projectController.getProjects
);

router.put(
    "/edit/:id",
    auth,
    [check("name", "El nombre del proyecto es obligatorio.").not().isEmpty()],
    projectController.editProject
);

router.delete(
    "/delete/:id",
    auth,
    projectController.deleteProject
);



module.exports = router;