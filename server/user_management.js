const execQuery = require("./mysql");
const crypto = require("crypto");

function _md5(str) {
    return crypto.createHash("md5").update(str.toString()).digest("hex");
}
function getUserByName(username, callback = function (result) {}) {
    execQuery(
        `SELECT * FROM users WHERE Username=?`,
        [username],
        function (err, result, fields) {
            if (err) throw err;
            callback(result[0]);
        }
    );
}
function user_create_session(username) {
    const sessionID = _md5(
        Math.random() * Math.random() * 1000000000 * new Date().getTime()
    );
    const privateID = sessionID;
    const publicID = _md5(sessionID);

    getUserByName(username, function (result) {
        if (result === undefined) {
            throw new Error("Invalid username.");
        }
        const userID = result.ID;

        execQuery(
            `INSERT INTO usersessions (privateID, userID) VALUES ('${privateID}', ${userID})`,
            function (err, result) {
                if (err) {
                    throw err;
                }
            }
        );
    });

    return { private: privateID, public: publicID };
}
function user_get_sessions(username, callback = (err, result, fields) => {}) {
    getUserByName(username, function (result) {
        if (result === undefined) {
            throw new Error("Invalid username.");
        }
        console.log(result.ID);
        execQuery(
            "SELECT * FROM usersessions WHERE userID=?",
            [result.ID],
            function (err, result) {
                if (err) throw err;
                callback(result);
            }
        );
    });
}
function user_delete_sessions(username) {
    getUserByName(username, function (result) {
        if (result === undefined) {
            throw new Error("Invalid username.");
        }
        console.log(result.ID);
        execQuery("DELETE FROM usersessions WHERE userID=?", [result.ID]);
    });
}

function createAccount(username, password, email) {
    try {
        getUserByName(username, function (result) {
            if (result === undefined) {
                return;
            }
            throw new Error("Already existing username.");
        });
    } catch {
        const hashedPassword = _md5(password);
    }
}
