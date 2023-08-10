const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const paymenthistorySchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
    },
    payment_type: {
        type: String,
        required: false,
    },
    payment_method: {
        type: String,
        required: false,
    },
    transaction_id: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    last4digit: {
        type: String,
        required: false,
    },
    exp_month: {
        type: String,
        required: false,
    },
    exp_year: {
        type: String,
        required: false,
    },
    payment_receipt: {
        type: String,
        required: false,
    },
    payment_status: {
        type: String,
        required: false,
        default: 'UnPaid'
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

paymenthistorySchema.set('timestamps', true);
paymenthistorySchema.plugin(uniqueValidator);
module.exports = mongoose.model('paymenthistory',paymenthistorySchema,'paymenthistory');