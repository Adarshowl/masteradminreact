const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const subcategorySchema = new mongoose.Schema({
    main_category_id:{
        type:String,
        ref:'category',
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

subcategorySchema.set('timestamps', true);
subcategorySchema.plugin(uniqueValidator);
module.exports = mongoose.model('subcategory',subcategorySchema,'subcategory');