const express = require('express')
const app = express();
const { getTopics, getEndpoints } = require('./controller/topics.controller')
const { getArticleId, getArticles } = require('./controller/articles.controller')
const { getComments, postComment } = require('./controller/comments.controller')

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/article/:article_id", getArticleId)

app.get("/api/articles", getArticles)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', postComment)


//Error handling middleware
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
    res.status(404).send({ satus: 404, msg: 'Unable to find article'})
})
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error'})
  })

module.exports = app;