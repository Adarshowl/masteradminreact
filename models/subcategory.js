const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const categorySchema = new mongoose.Schema({
    main_category_id:{
        type:String,
        required:true
    },
    sub_category_name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true,
        default: 'Active'
    }
});

categorySchema.set('timestamps', true);
categorySchema.plugin(uniqueValidator);
module.exports = mongoose.model('category',categorySchema,'category');