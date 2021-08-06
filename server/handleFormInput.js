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
            console.table(data);
            res.statusCode = 303;
            res.setHeader("Location", "/todo");
            res.end("ok");
            break;
        default:
            res.statusCode = 404;
            res.end("404 - Not found");
    }
}

module.exports = handleFormInput;
