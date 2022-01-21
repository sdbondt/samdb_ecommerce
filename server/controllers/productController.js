const pool = require('../db')
const asyncHandler = require('../errorhandlers/asyncHandler')
const { StatusCodes } = require("http-status-codes")

exports.getProducts = asyncHandler(async (req, res) => {
    let { page, limit, orderBy, direction } = req.query
    const pageNum = Number(page) || 1
    const pageLimit = Number(limit) || 10
    const skip = (pageNum - 1) * pageLimit
    let queryString = 'SELECT *, COUNT(*) OVER() as full_count FROM products'

    queryString = orderBy === 'p' ? queryString + ' ORDER BY product_price' : queryString + ' ORDER BY product_name'
    queryString = direction === 'asc' ? queryString + ' ASC' : queryString + ' DESC'
    queryString = queryString + ' LIMIT $1 OFFSET $2;'
    
    const results = await pool.query(queryString, [pageLimit, skip])
    const { rows: products } = results
    if (products.length === 0) {
        res.status(StatusCodes.NO_CONTENT).json({ msg: 'No products to show.'})
    } else {
        res.status(StatusCodes.OK).json({ data: products, count: parseInt(products[0].full_count) })
    }
})

exports.getProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const result = await pool.query('SELECT * FROM products WHERE product_id = $1;', [productId])
    const product = result.rows[0]
    if (!product) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: 'No product found with that id.'})
    } else {
        res.status(StatusCodes.OK).json({ data: product })
    }
})

exports.searchProduct = asyncHandler(async (req, res) => {
    let { q, page, limit, orderBy, direction } = req.query
    console.log(req.query);
    q = q.toLowerCase()
    
    const pageNum = Number(page) || 1
    const pageLimit = Number(limit) || 10
    const skip = (pageNum - 1) * pageLimit

    let queryString = 'SELECT *, COUNT(*) OVER() as full_count FROM products WHERE LOWER(product_name) LIKE $1 OR LOWER(product_description) LIKE $1'
    queryString = orderBy === 'p' ? queryString + ' ORDER BY product_price' : queryString + ' ORDER BY product_name'
    queryString = direction === 'asc' ? queryString + ' ASC' : queryString + ' DESC'
    queryString = queryString + ' LIMIT $2 OFFSET $3;'

    const results = await pool.query(queryString, ['%'+ q +'%',  pageLimit, skip ])
    const { rows: products } = results
    if (products.length === 0) {
        res.status(StatusCodes.NO_CONTENT).json({ msg: 'No products to show.'})
    } else {
        res.status(StatusCodes.OK).json({ data: products, count: parseInt(products[0].full_count) })
    }
})