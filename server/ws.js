const { createWebSocketStream } = require("ws");
const WebSocket = require("ws");
const { httpd_config } = require("../config");
console.log("Starting httpd.js...");
// This script is responsible for serving the files in public_html via http.
const { httpserver, sslserver } = require("./httpd");
const {
    session_verify,
    getUserByID,
    user_get_todo_categories,
    user_create_todo_task,
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
} = require("./user_management");

const wsserver = new WebSocket.Server({ server: httpserver });

const messagesFunctions = {
    getSubjects: null,
};
console.log("ws.js was started");

wsserver.on("connection", (socket, req) => {
    wsOnConnection(socket, req);
});
if (httpd_config.ssl.active) {
    const wssserver = new WebSocket.Server({ server: sslserver });

    wssserver.on("connection", (socket, req) => {
        wsOnConnection(socket, req);
    });
}
function wsOnConnection(socket, req) {
    let username;
    let userID;
    let ready = false;
    let queue = [];
    function executeMessage(message) {
        message = message.toString();
        switch (message) {
            case "getCategories":
                user_get_todo_categories(userID, function (result) {
                    socket.send(
                        "DATA-FOR-GET-CATEGORIES=" + JSON.stringify(result)
                    );
                });
                break;
            case "getTypes":
                user_get_todo_types(userID, function (result) {
                    socket.send("DATA-FOR-GET-TYPES=" + JSON.stringify(result));
                });
                break;
            case "getTasks":
                user_get_todo_tasks(userID, function (result) {
                    socket.send("DATA-FOR-GET-TASKS=" + JSON.stringify(result));
                });
                break;
            case "getNumberOfUsers":
                if (admin) {
                    getNumberOfUsers(function (result) {
                        socket.send(
                            "DATA-FOR-GET-NUMBER-OF-USERS=" + result.toString()
                        );
                    });
                }
                break;
            case "updateOfficr":
                if (admin) {
                    const { exec } = require("child_process");
                    console.log("UPDATING OFFICR...");
                    exec(
                        "git add . && git commit -m `Made changes for running officr` && git fetch && git pull"
                    );
                    throw new Error("officr was updated. Restart.");
                }
                break;

            case "getNotifications":
                user_getNotifications(userID, function (result) {
                    socket.send(
                        "getNotificationsAnswer=" + JSON.stringify(result)
                    );
                });
                break;
        }
        const add_todo_task = message.toString().match(/ADD_TODO_TASK={.*}/);
        if (add_todo_task) {
            const json_data = JSON.parse(
                add_todo_task[0].toString().replace("ADD_TODO_TASK=", "")
            );
            if (
                json_data.categoryID &&
                json_data.typeID &&
                json_data.description &&
                json_data.duedate
            ) {
                user_create_todo_task(
                    userID,
                    json_data.categoryID,
                    json_data.typeID,
                    json_data.description,
                    json_data.duedate
                );
                socket.send("ADD_TODO_TASK_ANSWER=OK");
            } else {
                socket.send("ADD_TODO_TASK_ANSWER=Bad JSON");
                return;
            }
        }
        const sendNotification = message
            .toString()
            .match(/sendNotification={.*}/);
        if (sendNotification) {
            if (admin) {
                console.log(sendNotification[0]);
                const json_data = JSON.parse(
                    sendNotification[0]
                        .toString()
                        .replace("sendNotification=", "")
                );
                if (json_data.title && json_data.text) {
                    addNotification(json_data.title, json_data.text);
                }
            }
        }
        const toggle_state = message
            .toString()
            .match(/TOGGLE_STATE=[0-9]+,[0-1]/);
        if (toggle_state) {
            const data = toggle_state[0].split("=")[1];
            const id = data.split(",")[0];
            const state = data.split(",")[1];
            user_todo_task_toggle_state(id, state, function () {
                socket.send("updateTasks");
            });
        }
        const add_type = message.toString().match(/ADD-TYPE=.*/);
        if (add_type) {
            const name = add_type[0].split("=")[1];
            user_todo_add_type(userID, name, function () {
                socket.send("ADD-TODO-TYPE-ANSWER=OK");
            });
        }
        const mark_notification_as_seen = message
            .toString()
            .match(/markNotificationAsSeen=.*/);
        if (mark_notification_as_seen) {
            const id = mark_notification_as_seen[0].split("=")[1];
            user_mark_notification_as_seen(id, userID);
        }
        const add_category = message.toString().match(/ADD-CATEGORY=.*/);
        if (add_category) {
            const name = add_category[0].split("=")[1];
            user_todo_add_category(userID, name, function () {
                socket.send("ADD-TODO-CATEGORY-ANSWER=OK");
            });
        }
        const edit_category = message.toString().match(/EDIT-CATEGORY={.*}/);
        if (edit_category) {
            const data = JSON.parse(edit_category[0].split("=")[1]);
            user_todo_edit_category(userID, data.id, data.new, function () {
                socket.send("updateAll");
            });
        }
        const edit_type = message.toString().match(/EDIT-TYPE={.*}/);
        if (edit_type) {
            const data = JSON.parse(edit_type[0].split("=")[1]);
            user_todo_edit_type(userID, data.id, data.new, function () {
                socket.send("updateAll");
            });
        }
        const delete_type = message.toString().match(/DELETE-TYPE=.*/);
        if (delete_type) {
            const id = delete_type[0].split("=")[1];
            user_todo_delete_type(userID, id, function () {
                socket.send("updateAll");
            });
        }
        const delete_category = message.toString().match(/DELETE-CATEGORY=.*/);
        if (delete_category) {
            const id = delete_category[0].split("=")[1];
            user_todo_delete_category(userID, id, function () {
                socket.send("updateAll");
            });
        }
    }
    socket.on("message", (message) => {
        const init = message.toString().match(/INITIALIZE_WITH_SESSION_ID=.*/);
        if (init !== null) {
            const sessionID = init[0].split("=")[1];
            session_verify(sessionID, function (result) {
                if (!result) {
                    socket.send("Verification failed.");
                    socket.close();
                    return;
                } else {
                    userID = result;
                    getUserByID(result, function (result) {
                        if (result.isAdmin == 1) {
                            admin = true;
                        } else {
                            admin = false;
                        }
                        username = result.Username;
                        ready = true;
                        socket.send("Verification successful.");
                    });
                }
                if (queue.length > 0) {
                    queue.forEach((msg, index) => {
                        executeMessage(msg);
                        queue.splice(index, 1);
                    });
                }
            });
            return;
        }
        if (!ready) {
            queue.push(message);
            return;
        }
        if (!init && ready) executeMessage(message);
    });
}
