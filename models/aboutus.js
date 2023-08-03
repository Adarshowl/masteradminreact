const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const aboutUsSchema = new mongoose.Schema({
    about_us: {
        type: String,
        required: true,
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

aboutUsSchema.set('timestamps', true);
aboutUsSchema.plugin(uniqueValidator);
module.exports = mongoose.model('aboutus',aboutUsSchema,'aboutus');