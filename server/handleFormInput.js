const { user_verify, user_create_session } = require("./user_management");

function handleFormInput(body, req, res) {
    switch (req.url) {
        case "/login/submit":
            var datachunks = body.toString().split("&");
            var data = {};
            datachunks.forEach((element) => {
                var key = element.split("=")[0];
                var value = element.split("=")[1];
                data[key] = value;
            });
            if (data.username === undefined || data.password === undefined) {
                res.statusCode = 400;
                res.end("Bad requests");
                return;
            }
            const username = data.username.toString();
            const password = data.password.toString();
            user_verify(username, password, function (result) {
                if (result) {
                    const publicSessionID =
                        user_create_session(username).public;
                    res.setHeader(
                        "Set-Cookie",
                        `officr-user-session-id=${publicSessionID}; HttpOnly; Path=/`
                    );
                    res.setHeader("Location", "/");
                    res.end("Authentication successful");
                } else {
                    res.setHeader(
                        "Location",
                        "/login?showUsernamePasswordError"
                    );
                    res.end("Authentication failed.");
                }
            });

            res.statusCode = 303;
            break;
        default:
            res.statusCode = 404;
            res.end("404 - Not found");
    }
}

module.exports = { handleFormInput };
