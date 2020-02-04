const mongoose = require('mongoose');
const MONGO_URI = require("../config")

const connectDB = () => {
    return mongoose.connect(MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    });
};

mongoose.connection.once('open', () => {
    console.log('connected to database');
});

module.exports = {
    connectDB: connectDB,
}