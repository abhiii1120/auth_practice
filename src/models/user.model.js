import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
    },
},
{
    timestamps:true,
})

let UserModel = mongoose.model('user',userSchema);

export default UserModel;