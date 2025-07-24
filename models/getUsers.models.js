const db = require("../db/connection.js")

exports.fetchUsers = () => {db.query("SELECT * FROM users")
.then((result) =>{
    return result.rows;})}

