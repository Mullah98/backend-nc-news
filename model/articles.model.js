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
    const queryString = `SELECT 
    a.title, 
    a.topic, 
    a.author, 
    a.created_at, 
    a.votes, 
    a.article_img_url,
    COUNT(c.comment_id) AS comment_count
  FROM 
    articles AS a
  LEFT JOIN 
    comments AS c 
  ON 
    a.article_id = c.article_id
  GROUP BY 
    a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url
  ORDER BY
    a.created_at DESC`;
    return db.query(queryString)
    .then((results) => {
    return results.rows
    })
}