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
    const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 24 * 14; // The session should expire after 14 days

    getUserByName(username, function (result) {
        if (result === undefined) {
            throw new Error("Invalid username.");
        }
        const userID = result.ID;

        execQuery(
            `INSERT INTO usersessions (PrivateID, UserID, Expires) VALUES ('${privateID}', ${userID}, ${expires})`,
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
                    parseInt(element.Expires) > Math.floor(Date.now() / 1000) &&
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
        "SELECT * FROM todo_tasks WHERE UserID=? ORDER BY Date ASC",
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
function user_todo_task_toggle_state(task_id, new_state, callback) {
    execQuery(
        `UPDATE todo_tasks SET StateID=? WHERE ID=?`,
        [new_state, task_id],
        function (result) {
            callback();
        }
    );
}
function user_todo_add_type(userID, typeName, callback) {
    execQuery(
        `INSERT INTO todo_types (UserID, Name) VALUES (?, ?)`,
        [userID, typeName],
        function (result) {
            callback();
        }
    );
}
function user_todo_add_category(userID, categoryName, callback) {
    execQuery(
        `INSERT INTO todo_categories (UserID, Name) VALUES (?, ?)`,
        [userID, categoryName],
        function (result) {
            callback();
        }
    );
}
function user_todo_edit_category(userID, categoryID, categoryName, callback) {
    execQuery(
        `UPDATE todo_categories SET Name=? WHERE UserID=? AND ID=?`,
        [categoryName, userID, categoryID],
        function (result) {
            callback();
        }
    );
}

function user_todo_edit_type(userID, typeID, typeName, callback) {
    execQuery(
        `UPDATE todo_types SET Name=? WHERE UserID=? AND ID=?`,
        [typeName, userID, typeID],
        function (result) {
            callback();
        }
    );
}
function user_todo_delete_type(userID, id, callback) {
    execQuery(
        `DELETE FROM todo_types WHERE UserID=? AND ID=?`,
        [userID, id],
        function (result) {
            execQuery(
                `DELETE FROM todo_tasks WHERE UserID=? AND TypeID=?`,
                [userID, id],
                function (result) {
                    callback();
                }
            );
        }
    );
}
function user_todo_delete_category(userID, id, callback) {
    execQuery(
        `DELETE FROM todo_categories WHERE UserID=? AND ID=?`,
        [userID, id],
        function (result) {
            execQuery(
                `DELETE FROM todo_tasks WHERE UserID=? AND CategoryID=?`,
                [userID, id],
                function (result) {
                    callback();
                }
            );
        }
    );
}
function getNumberOfUsers(callback) {
    execQuery("SELECT * FROM users", [], function (err, result, fields) {
        result = JSON.parse(JSON.stringify(result));
        callback(result.length);
    });
}

function addNotification(title, text, callback = function () {}) {
    execQuery(
        "INSERT INTO notifications (Title, Text) VALUES (?, ?)",
        [title, text],
        function (err, result, fields) {
            if (err) throw err;
            callback();
        }
    );
}
function user_getNotifications(userID, callback) {
    execQuery(
        "SELECT * FROM notifications",
        [],
        function (err, allNotifications, fields) {
            var result = [];
            if (err) throw err;
            execQuery(
                "SELECT * FROM notifications_seen WHERE UserID=?",
                [userID],
                function (err, seenNotifications, fields) {
                    if (seenNotifications) {
                        allNotifications.forEach((element) => {
                            var found = false;
                            seenNotifications.forEach((seenNotification) => {
                                if (
                                    element.ID ==
                                    seenNotification.NotificationID
                                ) {
                                    found = true;
                                }
                            });
                            if (!found) {
                                result.push(element);
                            }
                        });
                        callback(result);
                    } else {
                        callback(allNotifications);
                    }
                }
            );
        }
    );
}
function user_mark_notification_as_seen(id, userID) {
    execQuery(
        "INSERT INTO notifications_seen (UserID, NotificationID) VALUES (?, ?)",
        [userID, id]
    );
}
function sessionDestroy(sessionID) {
    execQuery(
        "DELETE FROM usersessions WHERE MD5(PrivateID)=?",
        [sessionID],
        function (err, res) {
            if (err) throw err;
            console.table(res);
        }
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
    user_todo_task_toggle_state,
    user_todo_add_type,
    user_todo_add_category,
    user_todo_edit_category,
    user_todo_edit_type,
    user_todo_delete_type,
    user_todo_delete_category,
    getNumberOfUsers,
    addNotification,
    user_getNotifications,
    user_mark_notification_as_seen,
    sessionDestroy,
};
