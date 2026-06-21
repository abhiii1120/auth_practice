import mongoose from "mongoose"

let noteSchema = new mongoose.Schema({
    title:{
        type:String,
        minLength:3,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    user:{
        type:String,
    }
},
{
    timestamps:true,
})

let noteModel = mongoose.model('notes',noteSchema);

export default noteModel;