const express = require('express')
const { addToCart, removeFromCart, getCart, deleteProduct } = require('../controllers/cartController')
const router = express.Router({ mergeParams: true })

router.post('/add', addToCart)
router.post('/remove', removeFromCart)
router.post('/delete', deleteProduct)
router.get('/', getCart)

module.exports = router
