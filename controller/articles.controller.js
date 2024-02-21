const {
    selectArticleId, selectArticles
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
    const body = req.body
    return selectArticles(body)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = { getArticleId, getArticles }