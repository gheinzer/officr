console.log("expired-remover.js was started.");
const execQuery = require("./mysql");

function deleteExpired() {
    execQuery(
        "DELETE FROM usersessions WHERE Expires<" +
            Math.floor(Date.now() / 1000).toString()
    );
}
setInterval(deleteExpired, 10000); // Deletes all expired sessions every 10 secons
