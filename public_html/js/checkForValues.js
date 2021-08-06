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
