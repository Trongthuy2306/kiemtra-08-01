var express = require('express');
const { model } = require('mongoose');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelcategory = require('../models/category')
var modelproduct = require('../models/product')
var validate = require('../validates/category')
var Schemacategory = require('../schema/category')
const {validationResult} = require('express-validator');




router.get('/', async function (req, res, next) {
  console.log(req.query);
  var categorysAll = await modelcategory.getall(req.query);
  const categoriesWithProducts = await Promise.all(
    categorysAll.map(async (category) => {
        const products = await modelproduct.getProductsByCategory(category.order);
        return { ...category.toObject(), products };
    })
);

responseData.responseReturn(res, 200, true, categoriesWithProducts);
  responseData.responseReturn(res, 200, true, categorysAll);
});

router.get('/:id', async function (req, res, next) {// get by ID
  try {
    var category = await modelcategory.getOne(req.params.id);
    if (!category) {
      responseData.responseReturn(res, 404, false, "Không tìm thấy category");
      return;
  }
  const products = await modelproduct.getProductsByCategory(category.order);

  const categoryWithProducts = {
      ...category.toObject(),
      products
  };

  responseData.responseReturn(res, 200, true, categoryWithProducts);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay category");
  }
});
router.post('/add',validate.validator(),
  async function (req, res, next) {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
      responseData.responseReturn(res, 400, false, errors.array().map(error=>error.msg));
      return;
    }
  var category = await modelcategory.getByName(req.body.name);
  if (category) {
    responseData.responseReturn(res, 404, false, "category da ton tai");
  } else {
    const newcategory = await modelcategory.createcategory({
      name: req.body.name,
      isdelete: req.body.isdelete,
      order: req.body.order,
    })
    responseData.responseReturn(res, 200, true, newcategory);
  }
});
router.put('/edit/:id',validate.validator(), async function (req, res, next) {
  try {
    var category = await Schemacategory.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    responseData.responseReturn(res, 200, true, category);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay category");
  }
});
router.delete('/delete/:id', async function (req, res, next) {
  try {
    // Thay đổi xóa thành cập nhật trường isDelete thành true
    const category = await Schemacategory.findByIdAndUpdate(req.params.id, { isdelete: true });

    if (category) {
      responseData.responseReturn(res, 200, true, "xóa thành công");
    } else {
      responseData.responseReturn(res, 404, false, "Không tìm thấy category");
    }
  } catch (error) {
    responseData.responseReturn(res, 500, false, "Lỗi khi xóa category");
  }
});

module.exports = router;
