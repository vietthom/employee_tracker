const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mino1234',
    database:'employee_db'
})
.promise();

module.exports = connection;