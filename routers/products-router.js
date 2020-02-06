const axios = require('axios')
const Joi = require('@hapi/joi');
const Product = require('../models/product')
const router = require('express').Router();

// POST  /products
router.post("/", async (req, res) => {
    try {
        const schema = Joi.object().keys({
            id: Joi.string().required(),
            value: Joi.number().required(),
            currency_code: Joi.string().required()
        })
        await schema.validateAsync(req.body);
        const newProduct = new Product({
            _id: req.body.id,
            current_price: {
                value: req.body.value,
                currency_code: req.body.currency_code
            }
        })
        const result = await newProduct.save()
        res.status(201).json({
            message: "product was created",
            createdProduct: result
        })
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({
                error: err,
                message: "duplicate entry use unique id"
            })

        } else if (err.details) {
            res.status(400).json({
                error: err,
                message: "include id, value and currency code in request body"
            })
        } else {
            res.status(500).json({
                error: (err),
                message: "internal server error"
            })
        }
    }
})

// GET   products/:id
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const apiProduct = await axios.get(`https://redsky.target.com/v2/pdp/tcin/${id}?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics`)
        const title = apiProduct.data.product.item.product_description.title;
        const foundProduct = await Product.findById(id)
        if (foundProduct === null) {
            throw new Error("not found");
        }
        res.status(200).json({
            id: parseInt(foundProduct._id),
            name: title,
            current_price: foundProduct.current_price
        })
    } catch (err) {
        if (err.message === "not found") {
            res.status(404).json({
                error: err,
                message: "entry not found in pricing db"

            })
        } else if (err.name === "Error") {
            res.status(404).json({
                error: err,
                message: "entry not found in target api"
            })

        } else {
            res.status(500).json({
                error: err,
                message: "internal server error"
            })

        }
    }
})

//PUT   /products/:id
router.put("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const schema = Joi.object().keys({
            value: Joi.number().required()
        })
        await schema.validateAsync(req.body);
        const foundProduct = await Product.findById(id)
        if (foundProduct === null) {
            throw new Error("not found");
        }
        const updatedProduct = new Product({
            _id: foundProduct._id,
            current_price: {
                value: req.body.value,
                currency_code: foundProduct.current_price.currency_code
            }
        })
        const updatedPrice = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true })
        res.status(201).json({
            message: "product price was updated",
            newPrice: updatedPrice
        })
    } catch (err) {
        if (err.message === "not found") {
            res.status(404).json({
                error: err,
                message: "entry was not found in pricing db"
            })

        } else if (err.details) {
            res.status(400).json({
                error: err,
                message: "include value as a valid number in request body"
            })
        } else {
            res.status(500).json({
                error: err
            })
        }
    }
})

//DELETE /products/:id
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const foundProduct = await Product.findById(id)
        if (foundProduct === null) {
            throw new Error("not found");
        }
        await Product.findByIdAndRemove(id)
        res.status(200).json({
            message: "product price has been deleted"
        })
    } catch (err) {
        if (err.message === "not found") {
            res.status(404).json({
                error: err,
                message: "product not found for deletion"
            })
        } else {
            res.status(500).json({
                error: err
            })
        }
    }
})

module.exports = router