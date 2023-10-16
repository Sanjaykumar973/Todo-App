const mongoose = require("mongoose")

const todoSchem = new mongoose.Schema({
    title: String,
    description: String,
    completed:{
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "UserTodos",
        required: true,
    }
});


module.exports = mongoose.model("Todos",todoSchem );
