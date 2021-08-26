const {
    user_verify,
    user_create_session,
    createAccount,
    getUserByID,
    getUserByName,
} = require("./user_management");

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
                res.end("Bad request");
                return;
            }
            const username = data.username.toString();
            const password = data.password.toString();
            res.statusCode = 302;
            user_verify(username, password, function (result) {
                if (result) {
                    let publicSessionID = user_create_session(username).public;
                    if (
                        data.keepmeloggedin === undefined ||
                        data.keepmeloggedin === "off"
                    ) {
                        res.setHeader(
                            "Set-Cookie",
                            `officr-user-session-id=${publicSessionID}; HttpOnly; Path=/`
                        );
                    } else {
                        var date = new Date();
                        date.setDate(date.getDate() + 7);
                        res.setHeader(
                            "Set-Cookie",
                            `officr-user-session-id=${publicSessionID}; HttpOnly; Path=/; expires=${date.toUTCString()}`
                        );
                    }
                    res.setHeader("Location", "/");
                    setTimeout(function () {
                        res.end("Authentication successful");
                    }, 500); // This is delayed because of some speed issues with the MySQL Server.
                } else {
                    res.setHeader(
                        "Location",
                        "/login?showUsernamePasswordError"
                    );
                    res.end("Authentication failed.");
                }
            });
            break;
        case "/signup/submit":
            var datachunks = body.toString().split("&");
            var data = {};
            datachunks.forEach((element) => {
                var key = element.split("=")[0];
                var value = element.split("=")[1];
                data[key] = value;
            });
            if (
                data.username === undefined ||
                data.password === undefined ||
                data.email === undefined
            ) {
                res.statusCode = 400;
                res.end("Bad request");
                return;
            }
            const username_to_register = data.username.toString();
            const password_to_register = data.password.toString();
            const email = data.email.toString();
            res.statusCode = 302;
            getUserByName(username_to_register, function (result) {
                console.log(result);
                if (!result) {
                    createAccount(
                        username_to_register,
                        password_to_register,
                        email
                    );

                    res.setHeader("Location", "/login");
                    res.end("Registration succesful.");
                } else {
                    res.setHeader("Location", "/signup?alreadyTakenUsername");
                    res.end("Username already registered");
                }
            });
            break;
        default:
            res.statusCode = 404;
            res.end("404 - Not found");
    }
}

module.exports = { handleFormInput };
