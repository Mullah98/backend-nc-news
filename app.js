const express = require('express')
const app = express();
const { getTopics } = require('./controller/topics.controller')

app.get("/api/topics", getTopics)

app.all("/api/*", (req, res, next) => {
    res.status(404).send({ msg: 'Unable to find'})
})



module.exports = app;