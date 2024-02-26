const { selectAllUsers } = require('../model/users.model')

const getAllUsers = (req, res, next) => {
    return selectAllUsers()
        .then((users) => {
            if (users) {
                res.status(200).send(users);
            } else {
                res.status(404).send({status: 404, msg: 'Unable to find users'})
            }
        })
        .catch((error) => {
            next(error)
        });
    };
module.exports = { getAllUsers }