const mongoose = require('mongoose');
const { Schema } = mongoose;

const SupplySchema = new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    taxi_type:{
        type:Number,
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
    fare:{
        type:Number,
        required:true
    },
    commission:{
        type:Number,
        default:0
    },
    available_date:{
        type:Date,
        required:true
    },
    available_time:{
        type:Date,
        required:true
    },
    status:{
        type:Boolean,
        default:1
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('supply',SupplySchema);