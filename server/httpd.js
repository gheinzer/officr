// This script is responsible serving the files in public_html via http.
const { readFileSync, existsSync, lstatSync } = require("fs");
const http = require("http");
const https = require("https");
const { httpd_config, pages, ws_config } = require("../config");
const { handleFormInput } = require("./handleFormInput");
const {
    session_verify,
    getUserByID,
    sessionDestroy,
} = require("./user_management");
const labels = require("./lang-specific-content");
const { exec } = require("child_process");
var sslserver = undefined;
const mime = require("mime");

let version;
exec("git describe --tags", function (error, stdout, stderr) {
    if (error) throw error;
    version = stdout;
});

console.log("httpd.js started");

const httpserver = http
    .createServer((req, res) => {})
    .listen(httpd_config.port);

httpserver.on("request", (req, res) => {
    serverOnRequest(req, res, false);
});
httpserver.on("error", (err) => {
    console.warn(err);
});

if (httpd_config.ssl.active) {
    const options = {
        key: readFileSync(httpd_config.ssl.options.key),
        cert: readFileSync(httpd_config.ssl.options.cert),
    };
    const sslserver = https
        .createServer(options, (req, res) => {})
        .listen(httpd_config.ssl.port);
    sslserver.on("request", (req, res) => {
        serverOnRequest(req, res, true);
    });
    sslserver.on("error", (err) => {
        console.warn(err);
    });
}

function serverOnRequest(req, res, ssl) {
    req.url = req.url.toString().split("?")[0];
    const { headers } = req;
    res.setHeader("Server", `officr HTTPD`);
    if (headers.cookie !== undefined) {
        var sessionID = headers.cookie
            .toString()
            .match(/officr-user-session-id=[A-Za-z0-9]{32}/);
        if (sessionID !== null) {
            sessionID = sessionID[0]
                .toString()
                .replace("officr-user-session-id=", "");
            session_verify(sessionID, function (result, publicSessionID) {
                if (!result || req.url == "/logout") {
                    sessionDestroy(sessionID);
                    res.setHeader(
                        "Set-Cookie",
                        `officr-user-session-id=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
                    );
                    res.setHeader("Location", "/");
                    res.statusCode = 302;
                    res.end("302 - You should be redirected to the home page.");
                    return;
                    6;
                }
                getUserByID(result, function (result) {
                    if (
                        checkForAuthenticatedRedirect(req, res, result.isAdmin)
                    ) {
                        handleNormalRequest(
                            ssl,
                            req,
                            res,
                            result.Username,
                            publicSessionID
                        );
                        return;
                    }
                });
            });
        } else {
            if (checkForNoAuthenticationRedirect(req, res)) {
                handleNormalRequest(ssl, req, res);
            }
        }
    } else {
        if (checkForNoAuthenticationRedirect(req, res)) {
            handleNormalRequest(ssl, req, res);
        }
    }
}
function checkForAuthenticatedRedirect(req, res, isAdmin) {
    var matched = false;
    pages.redirect_when_authenticated.forEach((regex) => {
        if (req.url.match(regex) !== null) {
            matched = true;
        }
    });
    if (req.url.match(/admin/) && isAdmin == 0) {
        matched = true;
    }
    if (matched) {
        res.statusCode = 302;
        res.setHeader("Location", "/todo");
        res.end("302 - You will be redirected to /todo");
        return false;
    } else {
        return true;
    }
}
function checkForNoAuthenticationRedirect(req, res) {
    var matched = false;
    pages.authentication_required.forEach((regex) => {
        if (req.url.match(regex) !== null) {
            matched = true;
        }
    });
    if (matched) {
        res.statusCode = 302;
        res.setHeader("Location", "/login");
        res.end("302 - You will be redirected to /login");
        return false;
    } else {
        return true;
    }
}
function handleNormalRequest(
    ssl,
    req,
    res,
    username = undefined,
    publicSessionID = undefined
) {
    if (req.url === "/logout") {
        res.setHeader("Location", "/");
        res.statusCode = 302;
        res.end(
            "302 - Want to logout but was not logged in. Redirecting to root."
        );
        return;
    }
    req.on("data", (data) => {
        handleFormInput(data, req, res);
    });
    const { method } = req;
    if (method === "POST") {
        return;
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
        try {
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
        } catch {
            remote_lang = "en";
        }
    }
    if (labels[remote_lang] == undefined) {
        remote_lang = "en";
    }
    if (
        (existsSync(`${httpd_config.public_html}/${url}`) &&
            lstatSync(`${httpd_config.public_html}/${url}`).isDirectory() ===
                false) ||
        (existsSync(`${httpd_config.public_html}/${url}/index.html`) &&
            lstatSync(
                `${httpd_config.public_html}/${url}/index.html`
            ).isDirectory() === false)
    ) {
        var path = "none";
        if (
            existsSync(`${httpd_config.public_html}/${url}`) &&
            lstatSync(`${httpd_config.public_html}/${url}`).isDirectory() ===
                false
        ) {
            path = `${httpd_config.public_html}/${url}`;
        }
        if (
            existsSync(`${httpd_config.public_html}/${url}/index.html`) &&
            lstatSync(
                `${httpd_config.public_html}/${url}/index.html`
            ).isDirectory() === false
        ) {
            path = `${httpd_config.public_html}/${url}/index.html`;
        }
        if (httpd_config.logging.requested_path) {
            console.log("Requested Path: " + path);
        }
        var mimeType = mime.getType(path);
        res.setHeader("Content-Type", mimeType);
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
        htmlContent = originalHtmlContent.toString();
        regexForLabels = /{rawCodeLabel<.*>}/;
        element = htmlContent.match(regexForLabels);
        if (element !== null) {
            element = element[0].toString();
            while (element !== null) {
                var code = element.match(/<.*>/)[0].toString();
                code = "(" + code.replace("<", "").replace(">", "") + ")";
                try {
                    var result = eval(code);
                } catch {
                    var result = "";
                }
                htmlContent = htmlContent.replace(element, result);
                if (htmlContent.match(regexForLabels) !== null) {
                    element = htmlContent.match(regexForLabels)[0].toString();
                } else {
                    element = null;
                }
            }
            originalHtmlContent = htmlContent;
        }
        if (
            originalHtmlContent.toString().match(/{USERNAME}/) !== null &&
            username !== undefined
        ) {
            originalHtmlContent = originalHtmlContent.toString();
            originalHtmlContent = originalHtmlContent.replace(
                "{USERNAME}",
                username
            );
        }
        if (originalHtmlContent.toString().match(/{WS_PORT}/)) {
            let port;
            if (ssl) {
                port = httpd_config.ssl.port;
            } else {
                port = httpd_config.port;
            }
            originalHtmlContent = originalHtmlContent.toString();
            originalHtmlContent = originalHtmlContent.replace(
                "{WS_PORT}",
                port
            );
        }
        if (originalHtmlContent.toString().match(/{WS_PROTOCOL}/)) {
            let protocol;
            if (ssl) {
                protocol = "wss";
            } else {
                protocol = "ws";
            }
            originalHtmlContent = originalHtmlContent.toString();
            originalHtmlContent = originalHtmlContent.replace(
                "{WS_PROTOCOL}",
                protocol
            );
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
}

module.exports = {
    httpserver,
    sslserver,
};
