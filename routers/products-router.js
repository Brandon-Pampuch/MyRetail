const axios = require('axios')
const Product = require('../models/product')
const router = require('express').Router();


router.post("/", (req, res) => {

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

router.get("/:id", (req, res) => {
    const id = req.params.id
    //  call to api for product details
    axios.get(`https://redsky.target.com/v2/pdp/tcin/${id}?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics`)
        .then(apiProduct => {
            const title = apiProduct.data.product.item.product_description.title;
            // call to db model to retrieve product price
            return title
        }).then((title) => {
            Product.findById(id).then(dbProduct => {
                res.status(200).json({
                    id: parseInt(dbProduct._id),
                    name: title,
                    current_price: dbProduct.current_price
                })
            })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
})

// update product value in database
router.put("/:id", (req, res) => {
    // find and update price in db
    Product.findByIdAndUpdate({ _id: req.params.id }, req.body)
        .then(() => {
            //  request product from db again to return updated price
            Product.findOne({ _id: req.params.id }).then(updatedPrice => {
                res.send(updatedPrice)
            })
        })
        .catch(err => {
            console.log(err)
        })
})

module.exports = router