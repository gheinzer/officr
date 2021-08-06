var mysql = require("mysql");
const mysql_config = require("../config");
var connection = mysql.createConnection(mysql_config.connection);
connection.connect();

function execQuery(query, callback = (err, res, fields) => {}) {
    connection.query(query, callback);
}

module.exports = execQuery;

console.log(execQuery("SELECT * FROM testtesttets"));
connection.end();
