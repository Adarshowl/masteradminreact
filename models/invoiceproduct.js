const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const invoiceProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: false,
    },
    product_price: {
        type: Number,
        required: false,
    },
    product_quantity: {
        type: Number,
        required: false,
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

invoiceProductSchema.set('timestamps', true);
invoiceProductSchema.plugin(uniqueValidator);
module.exports = mongoose.model('invoiceproduct',invoiceProductSchema,'invoiceproduct');