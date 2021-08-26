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
socket.onopen = () => {
    if (queue.length > 0) {
        queue.forEach((element, index) => {
            element();
            queue.splice(index, 1);
        });
    }
    todo_get_categories();
    todo_get_types();
    todo_get_tasks();
    socket.onmessage = ({ data }) => {
        const verification_failed = "Verification failed.";
        switch (data.toString()) {
            case verification_failed:
                showErrorOverlay("{label24}");
                return;
            case "Verification successful.":
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

function todo_get_categories() {
    _getCategories(function (result) {
        var html = "";
        result.forEach((element, index) => {
            html += `<option value="${element.ID}">${element.Name}</option>`;
        });
        document.getElementById("task_category").innerHTML = html;
    });
}
function todo_get_types() {
    _getTypes(function (result) {
        var html = "";
        result.forEach((element, index) => {
            html += `<option value="${element.ID}">${element.Name}</option>`;
        });
        document.getElementById("task_type").innerHTML = html;
    });
}
function todo_get_tasks() {
    _getTasks(function (result) {
        var html = "";
        result.forEach((element, index) => {
            html += `<tr>¨
                            <td>${element.StateID}</td>
                            <td>${element.TypeID}</td>
                            <td>${element.CategoryID}</td>
                            <td>${element.Description}</td>
                            <td>${element.Date}</td>
                        </tr>`;
        });
        document.getElementById("tasks").innerHTML = html;
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
window.addEventListener("beforeunload", function () {
    document.getElementById("erroroverlay").style.opacity = 0;
});
