const socket = new WebSocket(
    "{WS_PROTOCOL}://" + location.hostname + ":{WS_PORT}"
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

let searchFilter = "";
let stateFilter = 0;
let typeFilter = -1;
let categoryFilter = -1;
let stateFilterIDs = ["state-1", "state-0"];
let typeFilterIDs = [];
let categoryFilterIDs = [];
socket.onopen = () => {
    if (queue.length > 0) {
        queue.forEach((element, index) => {
            element();
            queue.splice(index, 1);
        });
    }
    socket.onmessage = ({ data }) => {
        const verification_failed = "Verification failed.";
        switch (data.toString()) {
            case verification_failed:
                showErrorOverlay("{label24}");
                return;
            case "Verification successful.":
                todo_get_categories(function () {
                    todo_get_types(function () {
                        todo_get_tasks();
                    });
                });
                return;
            case "ADD_TODO_TASK_ANSWER=OK":
                addTaskHandleAnswer();
                showMessage("{label45}");
                return;
            case "updateTasks":
                todo_get_tasks();
                return;
            case "updateAll":
                todo_get_categories(function () {
                    todo_get_types(function () {
                        todo_get_tasks();
                    });
                });
                return;
            case "ADD-TODO-TYPE-ANSWER=OK":
                showMessage("{label46}");
                addTypeHandleAnswer();
                return;
            case "ADD-TODO-CATEGORY-ANSWER=OK":
                showMessage("{label47}");
                addCategoryHandleAnswer();
                return;
        }
        if (data.toString().match(/DATA-FOR-GET-CATEGORIES=\[.*\]/)) {
            const jsondata = data
                .toString()
                .match(/DATA-FOR-GET-CATEGORIES=\[.*\]/)[0]
                .toString()
                .replace("DATA-FOR-GET-CATEGORIES=", "");
            const category_data = JSON.parse(jsondata);
            getCategoriesHandleAnswer(category_data);
            return;
        }
        if (data.toString().match(/DATA-FOR-GET-TYPES=\[.*\]/)) {
            const jsondata = data
                .toString()
                .match(/DATA-FOR-GET-TYPES=\[.*\]/)[0]
                .toString()
                .replace("DATA-FOR-GET-TYPES=", "");
            const category_data = JSON.parse(jsondata);
            getTypesHandleAnswer(category_data);
            return;
        }
        if (data.toString().match(/DATA-FOR-GET-TASKS=\[.*\]/)) {
            const jsondata = data
                .toString()
                .match(/DATA-FOR-GET-TASKS=\[.*\]/)[0]
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

        html = "";
        categoryFilterIDs = [];
        result.forEach((element) => {
            html += `<div
                                class="filter-item"
                                onclick="todo_set_category_filter(this)"
                                id="category-${element.ID}"
                            >
                                ${element.Name}
                            </div>`;
            categoryFilterIDs.push(`category-${element.ID}`);
        });
        document.getElementById("category-filter-list").innerHTML = html;

        html = "";
        result.forEach((element) => {
            html += `<div class="listEntry">
                            <p>${element.Name}</p>
                            <div class="actions">
                                <img
                                    src="/assets/icons/edit_white_24dp.svg"
                                    alt=""
                                    class="pointer"
                                    onclick="editCategory(${element.ID})"
                                />
                                <img
                                    src="/assets/icons/delete_white_24dp.svg"
                                    alt=""
                                    class="pointer"
                                    onclick="deleteCategory(${element.ID})"
                                />
                            </div>
                        </div>`;
        });
        document.getElementById("editCategoriesList").innerHTML = html;

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
        result.forEach((element) => {
            html += `<option value="${element.ID}">${element.Name}</option>`;
        });
        document.getElementById("task_type").innerHTML = html;

        html = "";
        typeFilterIDs = [];
        result.forEach((element) => {
            html += `<div
                                class="filter-item"
                                onclick="todo_set_type_filter(this)"
                                id="type-${element.ID}"
                            >
                                ${element.Name}
                            </div>`;
            typeFilterIDs.push(`type-${element.ID}`);
        });
        document.getElementById("type-filter-list").innerHTML = html;

        html = "";
        result.forEach((element) => {
            html += `<div class="listEntry">
                            <p>${element.Name}</p>
                            <div class="actions">
                                <img
                                    src="/assets/icons/edit_white_24dp.svg"
                                    alt=""
                                    class="pointer"
                                    onclick="editType(${element.ID})"
                                />
                                <img
                                    src="/assets/icons/delete_white_24dp.svg"
                                    alt=""
                                    class="pointer"
                                    onclick="deleteType(${element.ID})"
                                />
                            </div>
                        </div>`;
        });
        document.getElementById("editTypesList").innerHTML = html;

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
        result = result.sort(function (a, b) {
            return _reorderDate(a.Date) - _reorderDate(b.Date);
        });
        tasks = result;

        todo_update_tasks();
        if (callback) callback();
    });
}
function _reorderDate(date) {
    date = date.split(".")[2] + date.split(".")[1] + date.split(".")[0];
    return date;
}
function todo_update_tasks() {
    var html = testForFilters();
    if (html == "") {
        document.getElementById("notfound_message").style.display = "initial";
    } else {
        document.getElementById("notfound_message").style.display = "none";
    }
    document.getElementById("tasks").innerHTML = html;
}
function testForFilters() {
    var html = "";
    tasks.forEach((element, index) => {
        element.Description = element.Description.toString().replaceAll(
            "\n",
            "<br>"
        );
        boldFound = [...element.Description.toString().matchAll(/\*.*\*/g)];
        if (boldFound) {
            boldFound.forEach((boldString) => {
                element.Description = element.Description.replace(
                    boldString.toString(),
                    "<b>" + boldString.toString().replaceAll("*", "") + "</b>"
                );
            });
        }
        italicFound = [...element.Description.toString().matchAll(/_.*_/g)];
        if (italicFound) {
            italicFound.forEach((italicString) => {
                element.Description = element.Description.replace(
                    italicString.toString(),
                    "<i>" + italicString.toString().replaceAll("_", "") + "</i>"
                );
            });
        }
        monospaceFound = [...element.Description.toString().matchAll(/`.*`/g)];
        if (monospaceFound) {
            monospaceFound.forEach((monospaceString) => {
                element.Description = element.Description.replace(
                    monospaceString.toString(),
                    "<code>" +
                        monospaceString.toString().replaceAll("`", "") +
                        "</code>"
                );
            });
        }
        if (typeFilter !== -1 && parseInt(element.TypeID) !== typeFilter) {
            return;
        }
        if (
            categoryFilter !== -1 &&
            parseInt(element.CategoryID) !== categoryFilter
        ) {
            return;
        }
        if (stateFilter !== -1 && parseInt(element.StateID) !== stateFilter) {
            return;
        }
        if (element.StateID == 0) {
            state = `<img class="todo_state_symbol" src="/assets/icons/pending_darkred_24dp.svg" onclick="todo_toggle_state(${element.ID}, 1)" title="{label29}">`;
        }
        if (element.StateID == 1) {
            state = `<img  class="todo_state_symbol" src="/assets/icons/done_green_24dp.svg" onclick="todo_toggle_state(${element.ID}, 0)" title="{label30}">`;
        }
        searchRegex = new RegExp(searchFilter, "ig");
        if (
            searchFilter !== "" &&
            (element.Description.toString().match(searchRegex) ||
                element.Date.toString().match(searchRegex))
        ) {
            var desc = element.Description.replaceAll(
                searchRegex,
                function (str) {
                    return "<b>" + str + "</b>";
                }
            );
            var date = element.Date.replaceAll(searchRegex, function (str) {
                return "<b>" + str + "</b>";
            });
            elementHTML = `<tr>
                            <td>${state}</td>
                            <td>${typeIDs[element.TypeID]}</td>
                            <td>${categoryIDs[element.CategoryID]}</td>
                            <td>${desc}</td>
                            <td>${date}</td>
                        </tr>`;
            html += elementHTML;
        } else if (searchFilter == "") {
            elementHTML = `<tr>
                            <td>${state}</td>
                            <td>${typeIDs[element.TypeID]}</td>
                            <td>${categoryIDs[element.CategoryID]}</td>
                            <td>${element.Description}</td>
                            <td>${element.Date}</td>
                        </tr>`;
            html += elementHTML;
        }
    });
    return html;
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
function _addType(type_name, callback) {
    socket.send(`ADD-TYPE=${type_name}`);
    addTypeHandleAnswer = function () {
        if (callback) callback();
    };
}
function _addCategory(category_name, callback) {
    socket.send(`ADD-CATEGORY=${category_name}`);
    addCategoryHandleAnswer = function () {
        if (callback) callback();
    };
}
function todo_toggle_state(id, state) {
    socket.send(`TOGGLE_STATE=${id},${state}`);
}
function todo_add_type() {
    showLoader();
    const type_name = document.getElementById("type_name").value;
    _addType(type_name, function () {
        hideLoader();
        hideOverlay("createTypeOverlay");
        todo_get_types();
    });
}
function todo_add_category() {
    showLoader();
    const type_name = document.getElementById("category_name").value;
    _addCategory(type_name, function () {
        hideLoader();
        hideOverlay("createCategoryOverlay");
        todo_get_categories();
    });
}
function todo_set_search_filter() {
    searchFilter = document.getElementById("search").value;
    todo_update_tasks();
}
function todo_set_state_filter(element) {
    const selected = element.classList.contains("selected");
    const id = element.id;
    const SQLID = id.replace("state-", "");
    stateFilterIDs.forEach((filterID) => {
        document.getElementById(filterID).classList.remove("selected");
    });
    if (!selected) {
        element.classList.add("selected");
        stateFilter = parseInt(SQLID);
    }
    if (selected) {
        stateFilter = -1;
    }
    todo_update_tasks();
}
function todo_set_type_filter(element) {
    const selected = element.classList.contains("selected");
    const id = element.id;
    const SQLID = id.replace("type-", "");
    typeFilterIDs.forEach((filterID) => {
        document.getElementById(filterID).classList.remove("selected");
    });
    if (!selected) {
        element.classList.add("selected");
        typeFilter = parseInt(SQLID);
    }
    if (selected) {
        typeFilter = -1;
    }
    todo_update_tasks();
}
function todo_set_category_filter(element) {
    const selected = element.classList.contains("selected");
    const id = element.id;
    const SQLID = id.replace("category-", "");
    categoryFilterIDs.forEach((filterID) => {
        document.getElementById(filterID).classList.remove("selected");
    });
    if (!selected) {
        element.classList.add("selected");
        categoryFilter = parseInt(SQLID);
    }
    if (selected) {
        categoryFilter = -1;
    }
    todo_update_tasks();
}
function editCategory(id) {
    document.getElementById("editCategoryID").value = id;
    document.getElementById("category_edit_name").value = categoryIDs[id];
    document.getElementById("editCategoriesForm").classList.remove("hidden");
}
function editType(id) {
    document.getElementById("editTypeID").value = id;
    document.getElementById("type_edit_name").value = typeIDs[id];
    document.getElementById("editTypesForm").classList.remove("hidden");
}
function todo_edit_category() {
    var category_id = document.getElementById("editCategoryID").value;
    var category_name = document.getElementById("category_edit_name").value;
    document.getElementById("editCategoriesForm").classList.add("hidden");

    if (category_name !== "" && category_id !== -1) {
        if (categoryIDs[category_id] == undefined) {
            showErrorOverlay("{label35}");
        } else {
            const data = {
                id: category_id,
                new: category_name,
            };
            const jsondata = JSON.stringify(data);
            socket.send("EDIT-CATEGORY=" + jsondata);
        }
    } else {
        showErrorOverlay("{label35}");
    }
}
function todo_edit_type() {
    var type_id = document.getElementById("editTypeID").value;
    var type_name = document.getElementById("type_edit_name").value;
    document.getElementById("editTypesForm").classList.add("hidden");

    if (type_name !== "" && type_id !== -1) {
        if (typeIDs[type_id] == undefined) {
            showErrorOverlay("{label35}");
        } else {
            const data = {
                id: type_id,
                new: type_name,
            };
            const jsondata = JSON.stringify(data);
            socket.send("EDIT-TYPE=" + jsondata);
        }
    } else {
        showErrorOverlay("{label35}");
    }
}
function deleteType(id) {
    socket.send("DELETE-TYPE=" + id);
}
function deleteCategory(id) {
    socket.send("DELETE-CATEGORY=" + id);
}
function showMessage(msg) {
    var msgbox = document.createElement("div");
    var child = document.createTextNode(msg);
    msgbox.appendChild(child);
    msgbox.classList.add("msg");
    document.getElementById("messagecenter").appendChild(msgbox);
}
