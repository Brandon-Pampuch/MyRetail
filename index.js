require('dotenv').config();
const server = require('./server.js');
const DB = require('./models');
const PORT = process.env.PORT || 4000;

DB.connectDB().then(async () => {
    server.listen(PORT, () =>
        console.log(`🚀  Server listening on port ${PORT}!`),
    );
});