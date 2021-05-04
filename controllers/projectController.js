const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createProject = async (req, res) => {
    // Revisar si hay errores con express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer nombre
    const { name } = req.body;

    try {
        // Validar proyecto preexistente
        let project = await Project.findOne({ name });

        if (project) {
            return res
                .status(400)
                .json({ msg: "Ya tienes un projecto con el mismo nombre." });
        }
        // Create
        project = new Project(req.body);
        // Update owner using JWT user id
        project.owner = req.user.id;
        // save
        await project.save();
        res.json(project);
    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error al crear el proyecto");
    }
};

// Obtener projectos de usuario actual
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user.id }).sort({
            created_at: -1,
        });
        res.json(projects);
    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error al obtener los proyectos");
    }
};

// Editar proyecto
exports.editProject = async (req, res) => {
    // Revisar si hay errores con express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer nombre
    const { name } = req.body;
    const newProject = {};

    if (name) {
        newProject.name = name;
    }

    try {
        // Revisar el ID
        let project = await Project.findById(req.params.id);
        // Verificar si existe proyecto
        if (!oldProject) {
            return res.status(404).json({ msg: "Proyecto no encontrado." });
        }
        // Verificar creador del proyecto
        if (oldProject.owner.toString() !== req.user.id) {
            return res.status(401).json({
                msg: "No tienes permiso para actualizar este proyecto.",
            });
        }

        oldProject = await Project.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: newProject },
            { new: true }
        );
        res.json(oldProject);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error en el servidor");
    }
};

// Eliminar proyecto
exports.deleteProject = async (req, res) => {
    
    try {
        // Revisar el ID
        const project = await Project.findById(req.params.id);
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

        await Project.findOneAndRemove(
            { _id: req.params.id }
        );
        res.json({ msg: "Proyecto eliminado exitosamente." });
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error en el servidor");
    }
};
