const express = require('express')
const productController = require('../controllers/productController')
const { fixAllProducts } = require('../models/productModel')

const router = express.Router() // bộ định tuyến

router.get('/', productController.getAllProducts) // cấu hình tuyến đường
router.post('/', productController.addAllProducts)
router.put('/:productId', productController.updateProduct)

module.exports = router