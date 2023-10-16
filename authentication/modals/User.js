const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required :true,
        default:""
    },
    lastName:{
        type:String,
        required:true,
        default:"",
    },
    email:{
        type:String,
        unique:true,
        required :true,
    },
    phone:{
        type:Number,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        enum:["male","female","other"],
        default:"male"
    },
    emailVerified :{
        type: Boolean,
        default: false,
        required:true,

    },
    password:{
        type:String,
        
    }

});

const UserTodos = mongoose.model("UserTodos",userSchema)
module.exports = {UserTodos}

