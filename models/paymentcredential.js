const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const paymentCredentialSchema = new mongoose.Schema({
    payment_method_name: {
        type: String,
        required: false,
    },
    environment: {
        type: String,
        required: false,
    },
    test_key: {
        type: String,
        required: false
    },
    test_secret: {
        type: String,
        required: false
    },
    live_key: {
        type: String,
        required: false
    },
    live_secret: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true,
        default: 'Active'
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

paymentCredentialSchema.set('timestamps', true);
paymentCredentialSchema.plugin(uniqueValidator);
module.exports = mongoose.model('paymentcredential',paymentCredentialSchema,'paymentcredential');