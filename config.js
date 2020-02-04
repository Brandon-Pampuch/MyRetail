let MONGO_URI

if (process.env.NODE_ENV === "development") {
    MONGO_URI = process.env.DEVELOPMENT_URI
} else if (process.env.NODE_ENV === "production") {
    MONGO_URI = process.env.PRODUCTION_URI
}

module.exports = MONGO_URI 