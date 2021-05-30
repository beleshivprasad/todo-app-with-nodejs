const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
    title : {
        type:String,
        required:true
    },
    task : {
        type:String,
        required:true
    },
    dateTime : {
        type:String,
        required:true
    },
    status : {
        type:String,
        default:"ToDo"
    }
});

const ToDo = mongoose.model('ToDo',todoSchema);
module.exports = ToDo;