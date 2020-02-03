const express = require("express");



const server = express();


server.get("/", (req, res) => {
    res.send("connected")
})

module.exports = server