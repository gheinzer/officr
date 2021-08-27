function checkForValuesInCreateTaskOverlay() {
    var values = 0;
    if (document.getElementById("task_description").value !== "") {
        values += 1;
    }
    if (document.getElementById("task_date").value !== "") {
        values += 1;
    }
    if (values > 1) {
        document.getElementById("task_submit").disabled = false;
    } else {
        document.getElementById("task_submit").disabled = true;
    }
}
function checkForValuesInCreateCategoryOverlay() {
    var values = 0;
    if (document.getElementById("category_name").value !== "") {
        values += 1;
    }
    if (values > 0) {
        document.getElementById("category_submit").disabled = false;
    } else {
        document.getElementById("category_submit").disabled = true;
    }
}
function checkForValuesInCreateTypeOverlay() {
    var values = 0;
    if (document.getElementById("type_name").value !== "") {
        values += 1;
    }
    if (values > 0) {
        document.getElementById("type_submit").disabled = false;
    } else {
        document.getElementById("type_submit").disabled = true;
    }
}
