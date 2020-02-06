process.env.NODE_ENV = "test"

require('dotenv').config();
const expect = require('chai').expect
const request = require('supertest')
const router = require('../../routers/products-router.js')
const server = require('../../server')
const DB = require('../../models')

describe('PUT /products', () => {
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
    it('OK, updating product value works', (done) => {
        request(server.use(router)).post('/')
            .send({
                id: "87654321",
                currency_code: "USD",
                value: 1.99
            })
            .then(() => {
                request(server.use(router)).put('/87654321')
                    .send({
                        current_price: {
                            value: 2.99,
                            currency_code: "USD"
                        }
                    })
                    .then((res) => {
                        request(server.use(router)).get('/87654321')
                        const body = res.body
                        expect(body).to.deep.nested.include({
                            'updated_price.current_price.value': 2.99,
                        });
                        done()
                    })

            })
            .catch((err) => done(err))
    })
})