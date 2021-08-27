const socket = new WebSocket(
    "ws://" + location.hostname + ":{rawCodeLabel<ws_config.port>}"
);

function showErrorOverlay(msg) {
    document.getElementById("errormessage").innerHTML = msg;
    document.getElementById("erroroverlay").style.display = "flex";
}
let queue = [];
function socketExec(whatToExecute) {
    if (socket.readyState) {
        whatToExecute();
    } else {
        queue += whatToExecute;
    }
}
let types = [];
let categories = [];
let tasks = [];
let typeIDs = {};
let categoryIDs = {};
let lastestActionCompleted = false;
socket.onopen = () => {
    if (queue.length > 0) {
        queue.forEach((element, index) => {
            element();
            queue.splice(index, 1);
        });
    }
    todo_get_categories(function () {
        todo_get_types(function () {
            todo_get_tasks();
        });
    });
    socket.onmessage = ({ data }) => {
        console.log(data);
        const verification_failed = "Verification failed.";
        switch (data.toString()) {
            case verification_failed:
                showErrorOverlay("{label24}");
                return;
            case "Verification successful.":
                return;
            case "ADD_TODO_TASK_ANSWER=OK":
                addTaskHandleAnswer();
                return;
            case "updateTasks":
                todo_get_tasks();
                return;
        }
        if (data.toString().match(/DATA-FOR-GET-CATEGORIES=\[{.*}\]/)) {
            const jsondata = data
                .toString()
                .match(/DATA-FOR-GET-CATEGORIES=\[{.*}\]/)[0]
                .toString()
                .replace("DATA-FOR-GET-CATEGORIES=", "");
            const category_data = JSON.parse(jsondata);
            getCategoriesHandleAnswer(category_data);
            return;
        }
        if (data.toString().match(/DATA-FOR-GET-TYPES=\[{.*}\]/)) {
            const jsondata = data
                .toString()
                .match(/DATA-FOR-GET-TYPES=\[{.*}\]/)[0]
                .toString()
                .replace("DATA-FOR-GET-TYPES=", "");
            const category_data = JSON.parse(jsondata);
            getTypesHandleAnswer(category_data);
            return;
        }
        if (data.toString().match(/DATA-FOR-GET-TASKS=\[{.*}\]/)) {
            const jsondata = data
                .toString()
                .match(/DATA-FOR-GET-TASKS=\[{.*}\]/)[0]
                .toString()
                .replace("DATA-FOR-GET-TASKS=", "");
            const category_data = JSON.parse(jsondata);
            getTasksHandleAnswer(category_data);
            return;
        }
    };
    socket.send("INITIALIZE_WITH_SESSION_ID={rawCodeLabel<publicSessionID>}");
};

function todo_get_categories(callback) {
    _getCategories(function (result) {
        var html = "";
        result.forEach((element, index) => {
            html += `<option value="${element.ID}">${element.Name}</option>`;
        });
        document.getElementById("task_category").innerHTML = html;

        categories = result;
        result.forEach((element) => {
            categoryIDs[element.ID] = element.Name;
        });
        lastestActionCompleted = true;
        if (callback) callback();
    });
}
function todo_get_types(callback) {
    _getTypes(function (result) {
        var html = "";
        result.forEach((element, index) => {
            html += `<option value="${element.ID}">${element.Name}</option>`;
        });
        document.getElementById("task_type").innerHTML = html;

        types = result;
        result.forEach((element) => {
            typeIDs[element.ID] = element.Name;
        });
        lastestActionCompleted = true;
        if (callback) callback();
    });
}
function todo_get_tasks(callback) {
    _getTasks(function (result) {
        var html = "";
        result.forEach((element, index) => {
            if (element.StateID == 0) {
                element.StateID = `<img class="todo_state_symbol" src="/assets/icons/pending_darkred_24dp.svg" onclick="todo_toggle_state(${element.ID}, 1)" title="{label29}">`;
            }
            if (element.StateID == 1) {
                element.StateID = `<img  class="todo_state_symbol" src="/assets/icons/done_green_24dp.svg" onclick="todo_toggle_state(${element.ID}, 0)" title="{label30}">`;
            }
            html += `<tr>
                            <td>${element.StateID}</td>
                            <td>${typeIDs[element.TypeID]}</td>
                            <td>${categoryIDs[element.CategoryID]}</td>
                            <td>${element.Description}</td>
                            <td>${element.Date}</td>
                        </tr>`;
        });
        document.getElementById("tasks").innerHTML = html;

        tasks = result;
        if (callback) callback();
    });
}

socket.onclose = function () {
    showErrorOverlay("{label25}");
};
function _getCategories(callback) {
    socket.send("getCategories");
    getCategoriesHandleAnswer = function (msg) {
        callback(msg);
    };
}
function _getTypes(callback) {
    socket.send("getTypes");
    getTypesHandleAnswer = function (msg) {
        callback(msg);
    };
}
function _getTasks(callback) {
    socket.send("getTasks");
    getTasksHandleAnswer = function (msg) {
        callback(msg);
    };
}
function _addTask(categoryID, typeID, description, duedate, callback) {
    const data = {
        categoryID: categoryID,
        typeID: typeID,
        description: description,
        duedate: duedate,
    };
    const json_data = JSON.stringify(data);
    socket.send(`ADD_TODO_TASK=${json_data}`);

    addTaskHandleAnswer = function () {
        callback();
    };
}
window.addEventListener("beforeunload", function () {
    document.getElementById("erroroverlay").style.opacity = 0;
});

function todo_add_task() {
    showLoader();
    const categoryID = document.getElementById("task_category").value;
    const typeID = document.getElementById("task_type").value;
    const description = document.getElementById("task_description").value;
    var duedate = document.getElementById("task_date").value;
    duedate = duedate.toString().split("-");
    duedate = `${duedate[2]}.${duedate[1]}.${duedate[0]}`;
    _addTask(categoryID, typeID, description, duedate, function () {
        todo_get_tasks(function () {
            hideLoader();
            hideOverlay("createTaskOverlay");
            document.getElementById("task_category").value = "";
            document.getElementById("task_type").value = "";

            document.getElementById("task_description").value = "";
            document.getElementById("task_date").value = "";
        });
    });
}
function todo_toggle_state(id, state) {
    socket.send(`TOGGLE_STATE=${id},${state}`);
}
