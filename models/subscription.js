const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const subscriptionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    offer_name: {
        type: String,
        required: false,
    },
    popular_status: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

subscriptionSchema.set('timestamps', true);
subscriptionSchema.plugin(uniqueValidator);
module.exports = mongoose.model('subscription',subscriptionSchema,'subscription');