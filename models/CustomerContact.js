const mongoose = require('mongoose');
const { Schema } = mongoose;

const CustomerContactSchema = new Schema({
    customer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'customer',
        require:true
    },
    supplier_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'supply',
        require:true
    },
    message:{
        type:String,
        require:true
    }
})
module.exports = mongoose.model('customercontact',CustomerContactSchema)