const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const couponSchema = new mongoose.Schema({
    coupon_code: {
        type: String,
        required: true,
    },
    usage_limit: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    currency: {
        type: String,
        required: true,
    },
    expiry_date: {
        type: String,
        required: true,
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

couponSchema.set('timestamps', true);
couponSchema.plugin(uniqueValidator);
module.exports = mongoose.model('coupon',couponSchema,'coupon');