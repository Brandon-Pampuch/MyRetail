const express = require('express');
const bodyParser = require('body-parser')
const helmet = require('helmet')
const server = express();
const productsRouter = require('./routers/products-router')

// middleware
server.use(bodyParser.json());
server.use(helmet())
server.use('/products', productsRouter);

module.exports = server






