const express = require('express')
const app = express();
const { getTopics, getEndpoints } = require('./controller/topics.controller')

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.all("/api/*", (req, res, next) => {
    res.status(404).send({ msg: 'Unable to find'})
})



module.exports = app;