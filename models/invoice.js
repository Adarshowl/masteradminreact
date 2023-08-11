const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const invoiceSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        required: false,
    },
    company_logo: {
        type: String,
        required: false,
    },
    company_name: {
        type: String,
        required: false,
    },
    company_email: {
        type: String,
        required: false,
    },
    company_phone: {
        type: String,
        required: false,
    },
    company_address: {
        type: String,
        required: false,
    },
    client_name: {
        type: String,
        required: false,
    },
    client_email: {
        type: String,
        required: false,
    },
    client_phone: {
        type: String,
        required: false,
    },
    client_address: {
        type: String,
        required: false,
    },
    invoice_date:{
        type: String,
        required: false,
    },
    payment_type:{
        type: String,
        required: false,
    },
    payment_status:{
        type: String,
        required: false,
        default: 'Unpaid'
    },
    productId:{
        type:Array,
        ref:'invoiceproduct',
        required:false
    },
    subtotal:{
        type: Number,
        required: false,
    },
    currency:{
        type: String,
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

invoiceSchema.set('timestamps', true);
invoiceSchema.plugin(uniqueValidator);
module.exports = mongoose.model('invoice',invoiceSchema,'invoice');