const db = require("../db/connection.js");
const data = require('../db/data/test-data')
const fs = require('fs')
const path = require('path')


exports.selectArticleId = (articleId) => {
    const queryString = `SELECT * FROM articles WHERE article_id = $1`;
    
    return db.query(queryString, [articleId])
        .then((results) => {
            return results.rows[0];
        })
};