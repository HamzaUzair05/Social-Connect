const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true,
    },
    description : {
        type : String ,
        required : false,
    },
});

const ProductModel = mongoose.model('Products',ProductSchema);
module.exports = ProductModel;