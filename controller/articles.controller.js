const {
    selectArticleId, selectArticles, updateArticleVotes
} = require('../model/articles.model');


const getArticleId = (req, res, next) => {
    const articleId = req.params.article_id; 

    selectArticleId(articleId)
    .then((article) => {
        if (article) {
            res.status(200).send(article);
        } else {
            res.status(404).send({status: 404, msg: 'Unable to find article'})
        }
    })
    .catch((error) => {
        next(error)
    });
};

const getArticles = (req, res, next) => {
    return selectArticles()
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((error) => {
        next(error)
    })
}

const patchArticle = (req, res, next) => {
    const article_id = req.params.article_id;
    const { inc_votes } = req.body;

    updateArticleVotes(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((error) => next(error))
}

module.exports = { getArticleId, getArticles, patchArticle }