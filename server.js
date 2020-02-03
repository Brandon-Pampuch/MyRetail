const express = require("express");

const server = express();


server.get("/", (req, res) => {
    res.send("connected")
})

server.get("/products/:id", (req, res) => {
    var id = req.params.id;

    res.send(id)
})

module.exports = server