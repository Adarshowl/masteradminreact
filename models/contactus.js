const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const contactUsSchema = new mongoose.Schema({
    contact_us: {
        type: String,
        required: true,
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

contactUsSchema.set('timestamps', true);
contactUsSchema.plugin(uniqueValidator);
module.exports = mongoose.model('contactus',contactUsSchema,'contactus');