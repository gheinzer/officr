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
            `INSERT INTO usersessions (PrivateID, UserID) VALUES ('${privateID}', ${userID})`,
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
function session_verify(
    session_id,
    callback = function (result, publicSessionID) {}
) {
    execQuery("SELECT * FROM usersessions", [], function (err, result) {
        if (err) throw err;
        if (result === undefined || result === []) {
            callback(false);
            return;
        } else {
            var userIDFound = false;
            result.forEach((element) => {
                const publicID = _md5(element.PrivateID);
                if (
                    session_id.toString() === publicID.toString() &&
                    !userIDFound
                ) {
                    userIDFound = true;
                    callback(element.UserID, publicID);
                }
            });
            if (!userIDFound) {
                callback(false);
            }
        }
    });
}

/**
 * Gets all the category entries of a specified user.
 * @param {int} userID The user ID of the user to get the categories for.
 * @param {function} callback The callback to be called when categories are got. This has to have one parameter, that will be set to the subject entries of the user.
 */
function user_get_todo_categories(userID, callback = function (result) {}) {
    execQuery(
        "SELECT * FROM todo_categories WHERE UserID=?",
        userID,
        function (err, res, fields) {
            if (err) throw err;
            callback(res);
        }
    );
}
function user_get_todo_types(userID, callback = function (result) {}) {
    execQuery(
        "SELECT * FROM todo_types WHERE UserID=?",
        userID,
        function (err, res, fields) {
            if (err) throw err;
            callback(res);
        }
    );
}
function user_get_todo_tasks(userID, callback = function (result) {}) {
    execQuery(
        "SELECT * FROM todo_tasks WHERE UserID=?",
        [userID],
        function (err, res, fileds) {
            if (err) throw err;
            callback(res);
        }
    );
}
function user_create_todo_task(
    userID,
    categoryID,
    typeID,
    description,
    duedate
) {
    execQuery(
        "INSERT INTO todo_tasks (UserID, CategoryID, TypeID, Description, Date) VALUES (?,?,?,?,?)",
        [userID, categoryID, typeID, description, duedate]
    );
}

module.exports = {
    user_create_session,
    user_get_sessions,
    user_delete_sessions,
    createAccount,
    user_verify,
    session_verify,
    getUserByID,
    user_create_todo_task,
    user_get_todo_categories,
    getUserByName,
    user_get_todo_types,
    user_get_todo_tasks,
};
