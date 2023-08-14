const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const ticketmessageSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: false,
    },
    message:{
        type: String,
        required: false,
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

ticketmessageSchema.set('timestamps', true);
ticketmessageSchema.plugin(uniqueValidator);
module.exports = mongoose.model('ticketmessage',ticketmessageSchema,'ticketmessage');