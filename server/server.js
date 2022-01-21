require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const errorHandler = require('./errorhandlers/errorHandler.js')
const notFoundHandler = require('./errorhandlers/notFoundHandler')
const authRouter = require('./routers/authRouter')
const productRouter = require('./routers/productRouter')
const cartRouter = require('./routers/cartRouter')
const auth = require('./utils/auth.js')

const app = express()
const PORT = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products', auth, productRouter)
app.use('/api/v1/cart', auth, cartRouter)



app.use(notFoundHandler)
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`app is listening on PORT ${PORT}.`);
})