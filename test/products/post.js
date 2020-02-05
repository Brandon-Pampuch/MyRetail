const expect = require('chai').expect
const request = require('supertest')

const router = require('../../routers/products-router.js')
const conn = require('../../models/index.js')

describe('POST /products', () => {
    before((done) => {
        conn.connectDB()
            .then(() => done())
            .catch((err) => done(err))
    })

    it('OK, creating product works', (done) => {
        request(router).post('/')
            .send({
                _id: 12345678,
                current_price: { currency_code: "USD", value: 1.99 }
            })
            .then((res) => {
                const body = res.body
                expect(body.to.contain.property('_id'))
                expect(body.to.contain.property('current_price'))
                done()
            })
    })
})
