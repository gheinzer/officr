// This script is responsible serving the files in public_html via http.
const { readFileSync, existsSync, lstatSync } = require("fs");
const http = require("http");
const { exit } = require("process");
const { httpd_config } = require("../config");
const { handleFormInput } = require("./handleFormInput");
const { session_verify } = require("./user_management");

console.log("httpd.js started");

const server = http.createServer((req, res) => {}).listen(httpd_config.port);
server.on("request", (req, res) => {
    req.url = req.url.toString().split("?")[0];
    if (req.url.toString().charAt(0) !== "/") {
        res.statusCode = 300;
        res.setHeader("Location", "/");
        res.end("300 - Moved permanently");
    }
    let labels = require("./lang-specific-content");
    req.on("data", (data) => {
        handleFormInput(data, req, res);
    });
    const { method } = req;
    if (method === "POST") {
        return;
    }
    const { headers } = req;
    var sessionID = headers.cookie
        .toString()
        .match(/officr-user-session-id=[A-Za-z0-9]{32}/);
    if (sessionID !== null) {
        sessionID = sessionID[0].toString().split("=")[1];
        console.log(sessionID);
    }
    /*
    const { headers } = req; 
    console.warn(headers.cookie);
    res.setHeader(
        "Set-Cookie",
        "testtest=testonlyonetimevalue; HttpOnly; SameSite=Lax"
    ); */ // This is for setting and getting cookies
    var remote_lang = httpd_config.lang;
    const url = req.url;
    if (httpd_config.lang == null) {
        remote_lang =
            req.headers["accept-language"][0] +
            req.headers["accept-language"][1];
        if (labels[remote_lang] == undefined) {
            remote_lang = "en";
        }

        if (httpd_config.logging.remote_lang) {
            console.log(
                `Detected language of the remote browser: ${remote_lang}`
            );
        }
    }
    if (labels[remote_lang] == undefined) {
        remote_lang = "en";
    }
    if (
        (existsSync(`public_html/${url}`) &&
            lstatSync(`public_html/${url}`).isDirectory() === false) ||
        (existsSync(`public_html/${url}/index.html`) &&
            lstatSync(`public_html/${url}/index.html`).isDirectory() === false)
    ) {
        var path = "none";
        if (
            existsSync(`public_html/${url}`) &&
            lstatSync(`public_html/${url}`).isDirectory() === false
        ) {
            path = `public_html/${url}`;
        }
        if (
            existsSync(`public_html/${url}/index.html`) &&
            lstatSync(`public_html/${url}/index.html`).isDirectory() === false
        ) {
            path = `public_html/${url}/index.html`;
        }
        if (httpd_config.logging.requested_path) {
            console.log("Requested Path: " + path);
        }
        var htmlContent = readFileSync(path);
        var regexForLabels = /{label[0-9]+}/;
        var originalHtmlContent = htmlContent;
        htmlContent = htmlContent.toString();
        var element = htmlContent.match(regexForLabels);
        if (element !== null) {
            element = element[0].toString();
            while (element !== null) {
                var labelID = element.match(/[0-9]+/)[0].toString();
                //                console.log(labelID);
                if (labels[remote_lang][labelID] != undefined) {
                    htmlContent = htmlContent.replace(
                        `{label${labelID}}`,
                        labels[remote_lang][labelID]
                    );
                } else {
                    if (labels[remote_lang] != undefined) {
                        htmlContent = htmlContent.replace(
                            `{label${labelID}}`,
                            labels["en"][labelID]
                        );
                    } else {
                        htmlContent = htmlContent.replace(
                            `{label${labelID}}`,
                            "Invalid Label ID"
                        );
                    }
                }
                if (htmlContent.match(regexForLabels) !== null) {
                    element = htmlContent.match(regexForLabels)[0].toString();
                } else {
                    element = null;
                }
            }
            originalHtmlContent = htmlContent;
        }
        res.write(originalHtmlContent);
    } else {
        if (httpd_config.logging.requested_path) {
            console.log("Requested Path: " + req.url);
        }
        res.statusCode = 404;
        res.write("404 - page not found");
    }
    res.end();
});
server.on("error", (err) => {
    console.warn(err);
});
