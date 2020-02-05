process.env.NODE_ENV = "test"

require('dotenv').config();
const expect = require('chai').expect
const request = require('supertest')
const router = require('../../routers/products-router.js')
const server = require('../../server')
const DB = require('../../models')

describe('POST /products', () => {
    before((done) => {
        DB.connectDB()
            .then(() => done())
            .catch((err) => done(err))
    })

    it('OK, creating product works', (done) => {
        request(server.use(router)).post('/')
            .send({
                id: "87654321",
                currency_code: "USD",
                value: 1.99
            })
            .then((res) => {
                const body = res.body
                expect(body).to.contain.property('current_price')
                expect(body).to.contain.property('_id')
                done()
            })
            .catch((err) => done(err))
    })
})
