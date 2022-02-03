const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('user',UserSchema);