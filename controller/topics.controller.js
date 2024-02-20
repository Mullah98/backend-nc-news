const {
    selectTopics
} = require('../model/topics.model');

const getTopics = (req, res, next) => {
    const body = req.body
    return selectTopics(body)
    .then((result) => {
        res.status(200).send(result)
})
}

module.exports = {getTopics}