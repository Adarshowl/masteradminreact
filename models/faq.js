const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

faqSchema.set('timestamps', true);
faqSchema.plugin(uniqueValidator);
module.exports = mongoose.model('faq',faqSchema,'faq');