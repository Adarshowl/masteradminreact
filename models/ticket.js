const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    subject: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
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

ticketSchema.set('timestamps', true);
ticketSchema.plugin(uniqueValidator);
module.exports = mongoose.model('ticket',ticketSchema,'ticket');