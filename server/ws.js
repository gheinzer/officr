const { createWebSocketStream } = require("ws");
const WebSocket = require("ws");
const { ws_config } = require("../config");
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
