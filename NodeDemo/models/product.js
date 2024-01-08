var Schemaproduct = require('../schema/product')

module.exports ={
    getall:function(){
        return Schemaproduct.find({ isdelete: false }).sort({ order: 1 });
    },
    getOne:function(id){
        return Schemaproduct.findById(id);
    },
    getByName:function (name){
        return Schemaproduct.findOne({name:name}).exec();
    },
    createproduct:function(product){
        return new Schemaproduct(product).save();
    },
    getProductsByCategory: function(order) {
        return Schemaproduct.find({ order: order, isdelete: false })
            .sort({ order: 1 })
            .exec();
    },
}