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
function getUserByID(id, callback = function (result) {}) {
    execQuery(
        `SELECT * FROM users WHERE ID=?`,
        [id],
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

    return { public: publicID };
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
                password = _md5(password);
                execQuery(
                    "INSERT INTO users (Username, Password, Email) VALUES (?, ?, ?)",
                    [username, password, email]
                );
                return;
            }
            throw new Error("Already existing username.");
        });
    } catch {
        const hashedPassword = _md5(password);
    }
}
/**
 *This verifies user credentials and runs the callback method, when the verification is complete.
 * @param {string} username The username to verify.
 * @param {string} password The password to verify.
 * @param {function} callback This function is called when the verification is complete. The function needs a parameter, which will be set to true, if the user data is valid. In any other case, the parameter will be set to false.
 */
function user_verify(username, password, callback = function (result) {}) {
    password = _md5(password);
    getUserByName(username, function (result) {
        if (result === undefined) {
            callback(false);
            return;
        }
        if (result.Password.toString() === password.toString()) {
            callback(true);
        } else {
            callback(false);
        }
    });
}
/**
 *Verifies a given session.
 * @param {string} session_id The public session identifier.
 * @param {function} callback This function is called when the verification is complete. The function needs one parameter, which will be set to the user id, if the session is valid. In any other case, the parameter is set to false.
 */
function session_verify(session_id, callback = function (result) {}) {
    execQuery("SELECT * FROM usersessions", [], function (err, result) {
        if (err) throw err;
        if (result === undefined || result === []) {
            callback(false);
            return;
        } else {
            var userIDFound = false;
            result.forEach((element) => {
                const publicID = _md5(element.PrivateID);
                if (session_id.toString() === publicID.toString()) {
                    userIDFound = true;
                    callback(element.UserID);
                }
            });
            if (!userIDFound) callback(false);
        }
    });
}

module.exports = {
    user_create_session,
    user_get_sessions,
    user_delete_sessions,
    createAccount,
    user_verify,
    session_verify,
    getUserByID,
};
