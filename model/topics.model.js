const db = require("../db/connection.js");
const data = require('../db/data/test-data')


exports.selectTopics = () => {
    const queryString = `SELECT * FROM topics;`
    return db.query(queryString)
    .then((results) => {
        return results.rows
    })
}

