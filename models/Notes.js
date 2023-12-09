const mongoose = require('mongoose')


const notesschema = new mongoose.Schema({
    user:{
            type:mongoose.Schema.ObjectId
    },
        title:{
            type:String,
            required:true
        },
        descryption:{
            type:String,
            required:true,
        },
        tag:{
            type:String,
            default:"General"
        },
        date:{
            type: Date,
            default:Date.now
        }

})

 module.exports = new mongoose.model('notes' , notesschema)