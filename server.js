const Product = require('./models/product')
const express = require("express");
const axios = require("axios")
const bodyParser = require('body-parser')
const server = express();

// middleware
server.use(bodyParser.json());

server.get("/", (req, res) => {
    res.send("connected")
})
// post a new products price
server.post("/products", (req, res) => {

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
// retrieve product and it's price by id
server.get("/products/:id", (req, res) => {
    const id = req.params.id
    axios.get(`https://redsky.target.com/v2/pdp/tcin/${id}?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics`)
        .then(response => {
            const title = response.data.product.item.product_description.title;
            Product.findById(id).then(product => {
                res.status(200).json({
                    id: parseInt(product._id),
                    name: title,
                    current_price: product.current_price
                })
            })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err })
                })
        })
        .catch(error => {
            console.log(error);
        });
})
// update product value in database

server.put("/products/:id", (req, res) => {
    Product.findByIdAndUpdate({ _id: req.params.id }, req.body)
        .then(() => {
            Product.findOne({ _id: req.params.id }).then(updatedPrice => {
                res.send(updatedPrice)
            })
        })
})

module.exports = server