process.env.NODE_ENV = "test"

require('dotenv').config();
const expect = require('chai').expect
const request = require('supertest')
const router = require('../../routers/products-router.js')
const server = require('../../server')
const DB = require('../../models')

describe('GET /products', () => {
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

    it('OK, getting product by id works', (done) => {
        request(server.use(router)).post('/')
            .send({
                id: "87654321",
                currency_code: "USD",
                value: 1.99
            })
            .then((res) => {
                request(server.use(router)).get('/87654321')
                const body = res.body
                expect(body).to.contain.property('createdProduct')
                done()
            })
            .catch((err) => done(err))
    })

    it('FAIL, getting product does not work with wrong', (done) => {
        request(server.use(router)).post('/')
            .send({
                id: "87654321",
                currency_code: "USD",
                value: 1.99
            })
            .then((res) => {
                request(server.use(router)).get('/1')
                const body = res.body
                expect(body).to.contain.property('error')
                done()
            })
            .catch((err) => done(err))

    })
})

