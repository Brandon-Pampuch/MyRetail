process.env.NODE_ENV = "test"

require('dotenv').config();
const expect = require('chai').expect
const request = require('supertest')
const router = require('../../routers/products-router.js')
const server = require('../../server')
const DB = require('../../models')

describe('DELETE /products/:id', () => {
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

    it('OK, deleting product by id works', (done) => {
        request(server.use(router)).post('/')
            .send({
                id: "87654321",
                currency_code: "USD",
                value: 1.99
            })
            .then((res) => {
                request(server.use(router)).get('/87654321')
                const body = res.body
                expect(body).to.deep.nested.include({
                    'createdProduct.current_price.value': 1.99,
                })
                done()
            }).then((res) => {
                request(server.use(router)).delete('/87654321')
                request(server.use(router)).get('/87654321')
                expect(res).to.equal(undefined)
            })
            .catch((err) => done(err))
    })
})

