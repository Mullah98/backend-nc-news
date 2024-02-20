const express = require('express')
const app = express();
const { getTopics, getEndpoints } = require('./controller/topics.controller')
const { getArticleId } = require('./controller/articles.controller')


app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/article/:article_id", getArticleId)


app.use((err, req, res, next) => {
    if (err.code === '23502' || err.code === '22P02') {
        res.status(400).send({ status: 400, msg: 'Bad request'})
    }
    next(err)
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg})
    }
    next(err)
})

app.all("/api/*", (req, res, next) => {
    res.status(404).send({ msg: 'Unable to find'})
})
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error'})
  })

module.exports = app;