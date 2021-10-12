const {
    user_verify,
    user_create_session,
    createAccount,
    getUserByName,
} = require("./user_management");

/**
 * This handles the input of a POST request.
 * @param {*} body The request body.
 * @param {*} req The request object given by the server.
 * @param {*} res The response object given by the server.
 */
function handleFormInput(body, req, res) {
    switch (req.url) {
        case "/login/submit": // This is the the user data is submit from the sign in form.
            var datachunks = body.toString().split("&");
            /**
             * This is the data submitted by the user.
             */
            var data = {};
            datachunks.forEach((element) => {
                var key = element.split("=")[0];
                var value = element.split("=")[1];
                data[key] = value;
            });
            if (data.username === undefined || data.password === undefined) {
                // Check if all fields are received.
                res.statusCode = 400; // If not, send 400 Bad Request
                res.end("Bad request");
                return;
            }
            const username = data.username.toString();
            const password = data.password.toString();
            res.statusCode = 302; // Default status code is not 302 Found.
            user_verify(username, password, function (result) {
                if (result) {
                    // If result is true, the user is verified.
                    let publicSessionID = user_create_session(username).public; // Creates a session and gets the public session id.
                    if (
                        data.keepmeloggedin === undefined ||
                        data.keepmeloggedin === "off"
                    ) {
                        // If the keepmeloggedin field is not submitted of =off, set the cookie with the default lifetime.
                        res.setHeader(
                            "Set-Cookie",
                            `officr-user-session-id=${publicSessionID}; HttpOnly; Path=/`
                        );
                    } else {
                        // If the keepmeloggedin field is checked, set the cookie with increased lifetime.
                        var date = new Date();
                        date.setDate(date.getDate() + 14);
                        res.setHeader(
                            "Set-Cookie",
                            `officr-user-session-id=${publicSessionID}; HttpOnly; Path=/; expires=${date.toUTCString()}`
                        );
                    }
                    res.setHeader("Location", "/todo"); // Redirect the user to /todo
                    setTimeout(function () {
                        res.end("Authentication successful");
                    }, 500); // This is delayed because of some speed issues with the MySQL Server.
                } else {
                    res.setHeader(
                        "Location",
                        "/login?showUsernamePasswordError"
                    );
                    res.end("Authentication failed."); // Show an error message if the username or the password is invalid.
                }
            });
            break;
        case "/signup/submit": // This is the page for submitting the signup form.
            var datachunks = body.toString().split("&");
            /**
             * This is the data that is submitted by the user.
             */
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
                // Check all submitted fields
                res.statusCode = 400;
                res.end("Bad request");
                return; // Send a 400 Bad request if fields are invalid.
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
                    ); // Create the new account

                    res.setHeader("Location", "/signup/created"); // Redirect the user to the login page.
                    res.end("Registration successful.");
                } else {
                    res.setHeader("Location", "/signup?alreadyTakenUsername");
                    res.end("Username already registered"); // Redirect the user if the username is already taken.
                }
            });
            break;
        default:
            res.statusCode = 404;
            res.end("404 - Not found"); // Return a regular 404 if a POST request is sent to a page where it is not valid.
    }
}

module.exports = { handleFormInput };
