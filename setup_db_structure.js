const { exec } = require("child_process"); // Responsible for executing shell commands

exec("mysql < officr_db_structure.sql", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log("Finished.");
    console.log(`stdout: ${stdout}`);
});
