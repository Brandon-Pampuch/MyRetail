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
        if (err.details[0].type === "any.required") {
            res.status(400).json({
                error: err,
                message: "include id, value and currency code in request body"
            })
        } else if (err.code === 11000) {
            res.status(400).json({
                error: err,
                message: "duplicate entry use unique id"
            })
        } else {
            res.status(500).json({
                error: (err)
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
        console.log(foundProduct)
        console.log(title)
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
                error: err
            })

        }
    }
})

//PUT   /products/:id
router.put("/:id", async (req, res) => {
    const schema = Joi.object().keys({
        id: Joi.string().required(),
        value: Joi.number().required(),
        currency_code: Joi.string().required()
    })
    await schema.validateAsync(req.body);
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