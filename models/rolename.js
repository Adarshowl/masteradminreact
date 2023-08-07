const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const rolenameSchema = new mongoose.Schema({
    role_name: {
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

rolenameSchema.set('timestamps', true);
rolenameSchema.plugin(uniqueValidator);
module.exports = mongoose.model('rolename',rolenameSchema,'rolename');