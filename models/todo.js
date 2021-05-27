const mongoose = require('mongoose');

var today = new Date()

var dt = `${today.getHours()}:${today.getMinutes()} ${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`

const todoSchema = new mongoose.Schema({
    title : {
        type:String,
        required:true
    },
    task : {
        type:String,
        required:true
    },
    status : {
        type:String,
        default:"ToDo"
    },
    dateTime : {
        type:String,
        default:dt
    },
});

const ToDo = mongoose.model('ToDo',todoSchema);
module.exports = ToDo;