var mysql = require("mysql");
const { mysql_config } = require("../config");
var connection = mysql.createConnection(mysql_config.connection);
connection.connect();

function execQuery(query, placeholders, callback = (err, res, fields) => {}) {
    connection.query(query, placeholders, callback);
}

module.exports = execQuery;
