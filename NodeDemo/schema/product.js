var mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name:String,
    price: Number,
    isdelete: {
        type: Boolean,
        default: false
    },
    order: Number
});

module.exports = mongoose.model('product', schema);;

