var mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name:String,
    order: Number,
    isdelete: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('category', schema);;

