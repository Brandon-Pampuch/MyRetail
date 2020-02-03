const Product = require('./models/product')
const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const server = express();

// middleware
server.use(bodyParser.json());

server.get("/", (req, res) => {
    res.send("connected")
})
// post a new product
server.post("/products", (req, res) => {
    console.log(req.body.value)
    const product = new Product({
        _id: req.body.id,
        current_price: {
            value: req.body.value,
            currency_code: req.body.currency_code
        }
    })
    product.save().then(result => {
        console.log(result)
    })
        .catch(err => console.log(err))
    res.status(201).json({
        message: "product was created",
        createdProduct: product
    })
})
// retrieve product by id
server.get("/products/:id", (req, res) => {
    const id = req.params.id

    Product.findById(id).then(product => {
        console.log(product)
        res.status(200).json(product)
    })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})

module.exports = server