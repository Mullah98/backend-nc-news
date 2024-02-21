const { selectComments } = require('../model/comments.model')

const getComments = (req, res, next) => {
    const article_id = req.params.article_id;
    selectComments(article_id)
    .then((comments) => {
        if (comments && comments.length > 0) {
            res.status(200).send(comments)
        } else {
            res.status(404).send({status: 404, msg: 'Unable to find comments'})
        }
    })
    .catch((error) => {
        next(error)
    })
    }

module.exports = { getComments }