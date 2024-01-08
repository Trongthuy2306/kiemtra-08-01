var express = require('express');
const { model } = require('mongoose');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelproduct = require('../models/product')
var validate = require('../validates/product')
var Schemaproduct = require('../schema/product')
const {validationResult} = require('express-validator');




router.get('/', async function (req, res, next) {
  console.log(req.query);
  var productsAll = await modelproduct.getall(req.query);
  responseData.responseReturn(res, 200, true, productsAll);
});

router.get('/:id', async function (req, res, next) {// get by ID
  try {
    var product = await modelproduct.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay product");
  }
});
router.post('/add',validate.validator(),
  async function (req, res, next) {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
      responseData.responseReturn(res, 400, false, errors.array().map(error=>error.msg));
      return;
    }
  var product = await modelproduct.getByName(req.body.name);
  if (product) {
    responseData.responseReturn(res, 404, false, "product da ton tai");
  } else {
    const newproduct = await modelproduct.createproduct({
      name: req.body.name,
      price: req.body.price,
      isdelete: req.body.isdelete,
      order: req.body.order,
    })
    responseData.responseReturn(res, 200, true, newproduct);
  }
});
router.put('/edit/:id',validate.validator(), async function (req, res, next) {
  try {
    var product = await Schemaproduct.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay product");
  }
});
router.delete('/delete/:id', async function (req, res, next) {
  try {
    // Thay đổi xóa thành cập nhật trường isDelete thành true
    const product = await Schemaproduct.findByIdAndUpdate(req.params.id, { isdelete: true });

    if (product) {
      responseData.responseReturn(res, 200, true, "xóa thành công");
    } else {
      responseData.responseReturn(res, 404, false, "Không tìm thấy product");
    }
  } catch (error) {
    responseData.responseReturn(res, 500, false, "Lỗi khi xóa product");
  }
});

module.exports = router;
