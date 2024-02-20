const fs = require('fs')
const path = require('path')
const endpoints = require('../endpoints.json');
const {
    selectTopics, selectArticleId
} = require('../model/topics.model');


const getTopics = (req, res, next) => {
    const body = req.body
    return selectTopics(body)
    .then((result) => {
        res.status(200).send({topics: result})
})
}

const getEndpoints = (req, res, next) => {
    res.status(200).send({ endpoints })
};


module.exports = {getTopics, getEndpoints}