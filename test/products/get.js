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
        request(server.use(router)).post('/')
            .send({
                id: "13860428",
                currency_code: "USD",
                value: 1.99
            })
            .then(() => done())
            .catch((err) => done(err))
    })
    after((done) => {
        DB.disconnectDB()
            .then(() => done())
            .catch((err) => done(err))

    })

    it('OK, getting both api data and db data works', (done) => {
        request(server.use(router)).get('/13860428')
            .then((res) => {
                const body = res.body
                expect(body).to.deep.nested.include({
                    'current_price.currency_code': 'USD',
                });
                expect(body).to.deep.nested.include({
                    'current_price.value': 1.99,
                });
                expect(body).to.include({
                    'name': 'The Big Lebowski (Blu-ray)',
                });
                expect(body).to.include({
                    'id': 13860428,
                });
                done()
            })
            .catch((err) => done(err))
    })

    it('FAIL, getting product does not work with wrong id', (done) => {
        request(server.use(router)).post('/')
            .send({
                id: "13860428",
                currency_code: "USD",
                value: 1.99
            })
            .then((res) => {
                request(server.use(router)).get('/1')
                const body = res.body
                expect(body).to.contain.property('error')
                expect(body).to.contain.property('error')
                done()
            })
            .catch((err) => done(err))

    })
})

