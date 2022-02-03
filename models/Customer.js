const mongoose = require('mongoose');
const { Schema } = mongoose;

const CustomerSchema = new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    pickup_city:{
        type:Number,
        required:true
    },
    drop_city:{
        type:Number,
        required:true
    },
    search_date:{
        type:Date,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('customer',CustomerSchema);