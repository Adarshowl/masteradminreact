const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const privacyPolicySchema = new mongoose.Schema({
    privacy_policy: {
        type: String,
        required: false,
    },
    term_and_condition:{
        type:String,
        required:false
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

privacyPolicySchema.set('timestamps', true);
privacyPolicySchema.plugin(uniqueValidator);
module.exports = mongoose.model('privacypolicy',privacyPolicySchema,'privacypolicy');