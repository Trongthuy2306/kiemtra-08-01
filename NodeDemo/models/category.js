var Schemacategory = require('../schema/category')

module.exports ={
    getall:function(){
        return Schemacategory.find({ isdelete: false }).sort({ order: 1 });
    },
    getOne:function(id){
        return Schemacategory.findById(id);
    },
    getByName:function (name){
        return Schemacategory.findOne({name:name}).exec();
    },
    createcategory:function(category){
        return new Schemacategory(category).save();
    },
    
}