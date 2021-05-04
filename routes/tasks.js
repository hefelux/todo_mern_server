// RUTAS PARA TAREAS
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { check } = require("express-validator");
const auth = require("../middlewares/auth");

// endPoint: /tasks
router.post(
    "/create",
    auth,
    [
        check("name", "El nombre de la tarea es obligatorio.").not().isEmpty(),
        check("projectId", "El id del proyecto es obligatorio.").not().isEmpty(),
    ],
    taskController.createTask
);
router.get("/", auth, taskController.getTasks);

router.put(
    "/edit/:id",
    auth,
    taskController.editTask
);

router.delete("/delete/:id", auth, taskController.deleteTask);

module.exports = router;
