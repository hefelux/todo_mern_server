const Task = require("../models/Task");
const Project = require("../models/Project");
const projectController = require("../controllers/projectController");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {
    // Revisar si hay errores con express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer id proyecto
    const { name, projectId } = req.body;

    try {
        // Revisar el ID del proyecto y nombre tarea
        let project = await Project.findById(projectId);
        // Verificar si existe proyecto
        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado." });
        }
        // Verificar creador del proyecto
        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                msg: "No tienes permiso para crear tareas en este proyecto.",
            });
        }
        // Validar tarea preexistente
        let task = await Task.findOne({ name, projectId });

        if (task) {
            return res
                .status(400)
                .json({ msg: "Ya tienes una tarea con el mismo nombre." });
        }

        // Create
        task = new Task(req.body);
        // save
        await task.save();
        res.json(task);
    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error al crear la tarea");
    }
};

// Obtener tareas de proyecto actual
exports.getTasks = async (req, res) => {
    // Extraer nombre
    const { projectId } = req.query;
    console.log(req.query);

    try {
        // Revisar el ID del proyecto
        let project = await Project.findById(projectId);
        // Verificar si existe proyecto
        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado." });
        }
        // Verificar creador del proyecto
        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                msg:
                    "No tienes permiso para obtener las tareas de este proyecto.",
            });
        }

        const tasks = await Task.find({ projectId }).sort({
            created_at: -1,
        });
        res.json(tasks);
    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error al obtener las tareas");
    }
};

// Editar tarea
exports.editTask = async (req, res) => {
    // Extraer nombre
    const { name, done, projectId } = req.body;
    
    try {
        // Revisar el ID del proyecto
        let project = await Project.findById(projectId);
        // Verificar si existe proyecto
        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado." });
        }
        // Verificar creador del proyecto
        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                msg: "No tienes permiso para editar la tarea.",
            });
        }

        // Revisar el ID
        let oldTask = await Task.findById(req.params.id);
        // Verificar si existe tarea
        if (!oldTask) {
            return res.status(404).json({ msg: "Tarea no encontrada." });
        }

        let newTask = {};
        // Validamos los campos que vienen con datos
        if (name === undefined && done === undefined) {
            return res.status(400).json({
                msg: "Debes indicar un nombre y/o estado de la tarea.",
            });
        } 

        if (name !== undefined && name !== '') newTask.name = name;
        if (done !== undefined && typeof done === 'boolean') newTask.done = done;

        const task = await Task.findByIdAndUpdate(
            { _id: req.params.id },
            newTask ,
            { new: true }
        );
        res.json(task);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error en el servidor");
    }
};

// Eliminar tarea
exports.deleteTask = async (req, res) => {
    try {
        // Revisar el ID Tarea
        const task = await Task.findById(req.params.id);
        // Verificar si existe task
        if (!task) {
            return res.status(404).json({ msg: "Tarea no encontrada." });
        }
        // Revisar el ID del proyecto
        let project = await Project.findById(task.projectId);
        // Verificar si existe proyecto
        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado." });
        }
        // Verificar creador del proyecto
        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                msg: "No tienes permiso para eliminar este proyecto.",
            });
        }

        await Task.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Tarea eliminada exitosamente." });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error en el servidor");
    }
};
