const db = require("../db/connection.js");
const data = require('../db/data/test-data')


exports.selectArticleId = (articleId) => {
    const queryString = `SELECT * FROM articles WHERE article_id = $1`;
    
    return db.query(queryString, [articleId])
        .then((results) => {
          if (!results.rows.length) {
            return Promise.reject({status: 404, msg: 'Request not found'})
          }
          return results.rows[0];
        })
};

exports.selectArticles = () => {
  const queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments) AS comment_count FROM articles JOIN comments ON comments.article_id=articles.article_id 
  GROUP BY articles.article_id 
  ORDER BY created_at DESC`;
    return db.query(queryString)
    .then((results) => {
    return results.rows
    })
}

exports.updateArticleVotes = (article_id, inc_votes) => {
  const { 'inc_votes' : newVote } = inc_votes;
  if(newVote && typeof newVote !== 'number') {
    return Promise.reject({status: 400, msg: 'Bad request'})
  }


  const queryString = `UPDATE articles
  SET votes = votes + $1 
  WHERE article_id = $2 
  RETURNING *;`

  return db.query(queryString, [inc_votes, article_id])
  .then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Article not found'})
    }
    return article.rows[0]
  })
}