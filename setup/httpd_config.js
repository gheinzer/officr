"use strict";
const path = require("path");
const fs = require("fs");
const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    Foreground: {
        Black: "\x1b[30m",
        Red: "\x1b[31m",
        Green: "\x1b[32m",
        Yellow: "\x1b[33m",
        Blue: "\x1b[34m",
        Magenta: "\x1b[35m",
        Cyan: "\x1b[36m",
        White: "\x1b[37m",
    },
    Background: {
        Black: "\x1b[40m",
        Red: "\x1b[41m",
        Green: "\x1b[42m",
        Yellow: "\x1b[43m",
        Blue: "\x1b[44m",
        Magenta: "\x1b[45m",
        Cyan: "\x1b[46m",
        White: "\x1b[47m",
    },
};
const labels = require("../server/lang-specific-content");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log(
    colors.Foreground.Red +
        "It is strongly recommended to use the builtin server for serving the software. " +
        colors.Reset +
        "The next questions will be about this server.\n"
);

let config_input = {
    port: 80,
    lang: null,
    logging: {
        remote_lang: true,
        requested_path: true,
    },
};

const portQuestion = () => {
    return new Promise((resolve, reject) => {
        rl.question(
            colors.Foreground.Cyan +
                "\n\tOn which port do you want the server to listen on? (Please make sure to choose a port, that is not used by an other application) " +
                colors.Reset,
            (answer) => {
                config_input.port = parseInt(answer);
                resolve();
            }
        );
    });
};
const langQuestion = () => {
    return new Promise((resolve, reject) => {
        console.log(
            "\n\tThe following languages are available: " + Object.keys(labels)
        );
        rl.question(
            colors.Foreground.Cyan +
                "\n\tWhich language do you want the server to insert? (Leave empty to use the clients default language) " +
                colors.Reset,
            (answer) => {
                if (answer === "") {
                    config_input.lang = null;
                } else {
                    config_input.lang = answer;
                }
                resolve();
            }
        );
    });
};
const main = async () => {
    await portQuestion();
    await langQuestion();
    var rootDirPath = module.filename.toString().split(path.sep);
    rootDirPath.pop();
    rootDirPath.pop();
    rootDirPath = rootDirPath.join(path.sep);
    rl.close();
    console.log(
        "\n\tNote: You can configure the logging of the server in the config.js files."
    );
    console.log("\n\tReading configuration template...");
    const config_template = fs.readFileSync(
        rootDirPath + "/templates/config/config.template.js"
    );
    var new_config = config_template
        .toString()
        .replace("{httpd_port}", config_input.port);
    new_config = new_config.replace('"{httpd_lang}"', config_input.lang);
    console.log("\n\tWriting configuration...");
    fs.writeFile(rootDirPath + "/config.js", new_config, function (err) {
        if (err) throw err;
        console.log("\n\tConfiguration written successfully.");
    });
};
main();
