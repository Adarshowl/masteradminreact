const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: false,
    },
    module: {
        type: String,
        required: false,
    },
    create: {
        type: String,
        required: false,
        default: 'Deactive'
    },
    read: {
        type: String,
        required: false,
        default: 'Deactive'
    },
    update: {
        type: String,
        required: false,
        default: 'Deactive'
    },
    delete: {
        type: String,
        required: false,
        default: 'Deactive'
    },
    status: {
        type: String,
        required: false,
        default: 'Deactive'
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

roleSchema.set('timestamps', true);
roleSchema.plugin(uniqueValidator);
module.exports = mongoose.model('role',roleSchema,'role');