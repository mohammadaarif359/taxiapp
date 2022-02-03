const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://shahid:shahid@cluster0.zbodk.mongodb.net/gaadistand_aarif?retryWrites=true&w=majority"

const connectToMongo = () =>{
    mongoose.connect(mongoURI, ()=>{
        console.log('connect to mongo successfully');
    })
}
module.exports = connectToMongo;