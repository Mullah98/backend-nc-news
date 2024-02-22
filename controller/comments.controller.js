const { selectArticleId } = require('../model/articles.model');
const { selectComments, insertComment } = require('../model/comments.model')

const getComments = (req, res, next) => {
    const article_id = req.params.article_id;
    selectArticleId(article_id).then(() => {
        return selectComments(article_id)
    }).then((comments) => {
        res.status(200).send(comments)
    }).catch((error) => {
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


module.exports = { getComments, postComment }