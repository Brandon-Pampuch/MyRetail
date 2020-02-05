const axios = require('axios')
const Product = require('../models/product')
const router = require('express').Router();

// POST  /products
router.post("/", async (req, res) => {

    try {
        const product = new Product({
            _id: req.body.id,
            current_price: {
                value: req.body.value,
                currency_code: req.body.currency_code
            }
        })
        const result = await product.save()
        res.status(201).json({
            message: "product was created",
            createdProduct: result
        })
    } catch (err) {
        res.status(500).json({
            error: "internal server error"
        })
    }
})

// GET   products/:id
router.get("/:id", async (req, res) => {

    try {
        const id = req.params.id
        const apiProduct = await axios.get(`https://redsky.target.com/v2/pdp/tcin/${id}?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics`)
        const title = apiProduct.data.product.item.product_description.title;
        const foundProduct = await Product.findById(id)
        res.status(200).json({
            id: parseInt(foundProduct._id),
            name: title,
            current_price: foundProduct.current_price
        })
    } catch (err) {
        res.status(404).json({
            error: "product not found"
        })
    }
})

//PUT   /products/:id
router.put("/:id", async (req, res) => {

    try {
        const foundProduct = await Product.findByIdAndUpdate({ _id: req.params.id }, req.body)
        if (!foundProduct) {
            throw new Error();
        }
        updatedPrice = await Product.findOne({ _id: req.params.id })
        res.status(200).json({
            message: "product has been updated",
            updated_price: updatedPrice
        })
    } catch (err) {
        res.status(404).json({
            error: "no product found"
        })
    }
})

//Delete   /products/:id

module.exports = router