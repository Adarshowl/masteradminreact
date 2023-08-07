const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
    },
    module: {
        type: String,
        required: false,
    },
    create: {
        type: String,
        required: false,
        default: 'Active'
    },
    read: {
        type: String,
        required: false,
        default: 'Active'
    },
    update: {
        type: String,
        required: false,
        default: 'Active'
    },
    delete: {
        type: String,
        required: false,
        default: 'Active'
    },
    status: {
        type: String,
        required: false,
        default: 'Active'
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