const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    done: {
        type: Boolean,
        default: false
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Task", TaskSchema);
