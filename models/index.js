const mongoose = require('mongoose')
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
const MONGO_URI = require("../config")

const connectDB = async () => {
    if (process.env.NODE_ENV = 'test') {
        const mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        return mongoose.connect(mongoUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        })
    } else {
        return mongoose.connect(MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        })
    }
};

const disconnectDB = () => {
    return mongoose.connection.close()
}


mongoose.connection.once('open', () => {
    console.log('connected to database');
})

module.exports = {
    connectDB, disconnectDB
}