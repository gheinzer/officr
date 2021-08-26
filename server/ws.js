const { createWebSocketStream } = require("ws");
const WebSocket = require("ws");
const { brotliDecompressSync } = require("zlib");
const { ws_config } = require("../config");
const {
    session_verify,
    getUserByID,
    user_get_todo_categories,
    user_create_todo_task,
    user_get_todo_types,
    user_get_todo_tasks,
} = require("./user_management");

const server = new WebSocket.Server({ port: parseInt(ws_config.port) });

const messagesFunctions = {
    getSubjects: null,
};
console.log("ws.js was started");

server.on("connection", (socket) => {
    let username;
    let userID;
    let ready = false;
    let queue = [];
    function executeMessage(message) {
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
        }
        const add_todo_task = message.toString().match(/ADD_TODO_TASK={.*}/);
        if (add_todo_task) {
            const json_data = add_todo_task[0]
                .toString()
                .replace("ADD_TODO_TASK=", "");
            if (
                !(
                    json_data.userID &&
                    json_data.categoryID &&
                    json_data.typeID &&
                    json_data.description &&
                    json_data.duedate
                )
            ) {
                socket.send("ADD_TODO_TASK_ANSWER=Bad JSON");
            }
            user_create_todo_task(
                json_data.userID,
                json_data.categoryID,
                json_data.typeID,
                json_data.description,
                json_data.duedate
            );
            socket.send("ADD_TODO_TASK_ANSWER=OK");
        }
    }
    socket.on("message", (message) => {
        const init = message.match(/INITIALIZE_WITH_SESSION_ID=.*/);
        if (init !== null) {
            const sessionID = init[0].split("=")[1];
            session_verify(sessionID, function (result) {
                if (!result) {
                    socket.send("Verification failed.");
                    socket.close();
                    return;
                } else {
                    socket.send("Verification successful.");
                    userID = result;
                    getUserByID(result, function (result) {
                        username = result.Username;
                        ready = true;
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
});
