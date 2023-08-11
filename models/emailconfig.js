const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const emailConfigSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
    },
    smtp_server: {
        type: String,
        required: false,
    },
    smtp_port: {
        type: Number,
        required: false,
    },
    username: {
        type: String,
        required: false,
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

emailConfigSchema.set('timestamps', true);
emailConfigSchema.plugin(uniqueValidator);
module.exports = mongoose.model('emailconfig',emailConfigSchema,'emailconfig');