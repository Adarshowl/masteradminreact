const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const emailTemplateSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    message: {
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

emailTemplateSchema.set('timestamps', true);
emailTemplateSchema.plugin(uniqueValidator);
module.exports = mongoose.model('emailtemplate',emailTemplateSchema,'emailtemplate');