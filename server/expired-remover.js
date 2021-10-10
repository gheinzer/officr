// This script is responsible for removing all expired sessions form the database.

console.log("expired-remover.js was started.");
const execQuery = require("./mysql");

/**
 * This deletes all expired sessions from the database.
 */
function deleteExpired() {
    execQuery(
        "DELETE FROM usersessions WHERE Expires<" +
            Math.floor(Date.now() / 1000).toString() // This calculates the timestamp
    );
}
setInterval(deleteExpired, 10000); // Deletes all expired sessions every 10 secons
