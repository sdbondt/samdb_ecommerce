const express = require('express')
const { getProducts, getProduct, searchProduct } = require('../controllers/productController')
const router = express.Router()
const cartRouter = require('./cartRouter')

router.use('/:productId/cart', cartRouter)
router.get('/', getProducts)
router.get('/search', searchProduct)
router.get('/:productId', getProduct)


module.exports = router