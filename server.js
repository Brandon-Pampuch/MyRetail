const express = require('express');
const bodyParser = require('body-parser')
const helmet = require('helmet')
const productsRouter = require('./routers/products-router')
const authRouter = require('./routers/auth-router')

const server = express();
// middleware
server.use(bodyParser.json())
server.use(helmet())

// routers
server.use('/products', productsRouter)
server.use('/auth', authRouter)

module.exports = server






