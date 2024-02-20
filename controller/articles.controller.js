const {
    selectArticleId
} = require('../model/articles.model');


const getArticleId = (req, res, next) => {
    const articleId = req.params.article_id; 

    selectArticleId(articleId)
    .then((article) => {
        if (article) {
            res.status(200).send(article);
        } else {
            res.status(404).send({status: 404, msg: 'Article not found'})
        }
    })
    .catch((error) => {
        next(error)
    });
};

module.exports = { getArticleId }