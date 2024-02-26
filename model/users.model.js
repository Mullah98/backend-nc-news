const db = require('../db/connection.js')
const data = require('../db/data/test-data')

exports.selectAllUsers = () => {
    const queryString = `SELECT * FROM users;`
    return db.query(queryString)
    .then((results) => {
        return results.rows
    })
}