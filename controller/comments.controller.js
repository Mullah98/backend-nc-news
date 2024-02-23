const { selectArticleId } = require('../model/articles.model');
const { selectComments, insertComment, removeComment } = require('../model/comments.model')

const getComments = (req, res, next) => {
    const article_id = req.params.article_id;
    selectComments(article_id)
    .then((comments) => {
        if (comments && comments.length > 0) {
            res.status(200).send(comments)
        } else {
            res.status(404).send({ status: 404, msg: 'No comments found for this article'})
        }
    })
    .catch((error) => {
        next(error)
    })
    }


const postComment = (req, res, next) => {
    const articleID = req.params.article_id;
    selectArticleId(articleID).then(() => insertComment(articleID, req.body)
    ).then((comment) => 
    res.status(201).send(comment)
    ).catch((error) => next(error));
};

const deleteComments = (req, res, next) => {
    const comment_id = req.params.comment_id;
    removeComment(comment_id).then(() => {
        res.status(204).send({})
    })
    .catch((error) => next(error))
}

module.exports = { getComments, postComment, deleteComments }