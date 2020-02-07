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
    after((done) => {
        DB.disconnectDB()
            .then(() => done())
            .catch((err) => done(err))

    })
    it('OK, posting price to db works', (done) => {
        request(server.use(router)).post('/')
            .send({
                id: "13860428",
                currency_code: "USD",
                value: 1.99
            })
            .then((res) => {
                const body = res.body
                expect(body).to.contain.property('createdProduct')
                expect(body).to.deep.nested.include({
                    'createdProduct._id': '13860428'
                });
                expect(body).to.deep.nested.include({
                    'createdProduct.current_price.value': 1.99,
                });
                expect(body).to.deep.nested.include({
                    'createdProduct.current_price.currency_code': "USD",
                });
                done()
            })
            .catch((err) => done(err))
    })


    it('Fail, creating product requires id', (done) => {
        request(server.use(router)).post('/')
            .send({
                currency_code: "USD",
                value: 1.99
            })
            .then((res) => {
                const body = res.body
                expect(body).to.contain.property('error')
                done()
            })
            .catch((err) => done(err))
    })
})