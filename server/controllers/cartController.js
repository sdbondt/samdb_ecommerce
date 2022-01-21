const pool = require('../db')
const asyncHandler = require('../errorhandlers/asyncHandler')
const { StatusCodes } = require("http-status-codes")

exports.addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const result = await pool.query('SELECT * FROM cart WHERE cart_product = $1 AND cart_user = $2;', [productId, req.user.user_id])
    const cartOrder = result.rows[0]
    if (!cartOrder) {
        const newOrder = await pool.query('INSERT INTO cart (cart_product, cart_user, quantity) VALUES($1, $2, $3) RETURNING *;', [productId, req.user.user_id, 1])
        const order = newOrder.rows[0]
        return res.status(StatusCodes.CREATED).json({ data: order })
    } else {
        const updateOrder = await pool.query('UPDATE cart SET quantity = $1 WHERE cart_user = $2 AND cart_product = $3 RETURNING *;', [parseInt(cartOrder.quantity) + 1, req.user.user_id, productId])
        const order = updateOrder.rows[0]
        return res.status(StatusCodes.OK).json({ data: order })
    }
})

exports.removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const result = await pool.query('SELECT * FROM cart WHERE cart_product = $1 AND cart_user = $2;', [productId, req.user.user_id])
    const cartOrder = result.rows[0]
    
    if (!cartOrder) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No such product exists.'})
    } else if(cartOrder.quantity == 1) {
        const deleteOrder = await pool.query('DELETE FROM cart WHERE cart_id = $1 RETURNING *;', [cartOrder.cart_id])
        const order = deleteOrder.rows[0]
        return res.status(StatusCodes.OK).json({ data: order })
    } else {
        const updateOrder = await pool.query('UPDATE cart SET quantity = $1 WHERE cart_user = $2 AND cart_product = $3 RETURNING *;', [parseInt(cartOrder.quantity) - 1, req.user.user_id, productId])
        const order = updateOrder.rows[0]
        return res.status(StatusCodes.OK).json({ data: order })
    }
})

exports.deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const result = await pool.query('SELECT * FROM cart WHERE cart_product = $1 AND cart_user = $2;', [productId, req.user.user_id])
    const cartOrder = result.rows[0]
    if (!cartOrder) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No such product exists.'})
    } else {
        const deleteOrder = await pool.query('DELETE FROM cart WHERE cart_id = $1 RETURNING *;', [cartOrder.cart_id])
        const order = deleteOrder.rows[0]
        return res.status(StatusCodes.OK).json({ data: order })
    }
})

exports.getCart  = asyncHandler(async (req, res) => {
    const results = await pool.query('SELECT * FROM cart LEFT JOIN products ON cart.cart_product = products.product_id WHERE cart_user = $1;', [req.user.user_id])
    const cart = results.rows
    if (cart.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: 'You don\'t have any items in your cart.'})
    } else {
        res.status(StatusCodes.OK).json({ data: cart, count: cart.length })
    }
})