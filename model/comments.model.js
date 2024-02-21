const db = require("../db/connection")
const data = require("../db/data/test-data")

exports.selectComments = (article_id) => {
    const queryString = `SELECT * FROM comments WHERE article_id = $1 
    ORDER BY created_at DESC;`

    return db.query(queryString, [article_id])
    .then((results) => {
        return results.rows
    })
}