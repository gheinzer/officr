const child_process = require("child_process");
const { httpd_config } = require("../config");
const { HTTPMakeGETRequest } = require("./request");

let passed = 1;

server_proc = child_process.spawn("npm", ["run", "start"]);
server_proc.stdout.setEncoding("utf8");
async function testHTTPReachability() {
    console.log("Testing HTTP reachability...");
    var response = await HTTPMakeGETRequest(
        "http://127.0.0.1:" + httpd_config.port
    );
    console.log(response);
    if (response.status == 200) {
        console.log("HTTP reachability: TEST PASSED");
        passed = 0;
    } else {
        passed = 1;
        console.log("HTTP reachability: TEST FAILED");
    }
}
async function testHTTPSReachability() {
    console.log("Testing HTTPS reachability...");
    var response = await HTTPMakeGETRequest(
        "http://127.0.0.1:" + httpd_config.ssl.port
    );
    console.log(response);
    if (response.status == 200) {
        console.log("HTTPS reachability: TEST PASSED");
        passed = 0;
    } else {
        passed = 1;
        console.log("HTTPS reachability: TEST FAILED");
    }
}
server_proc.stdout.on("data", function (data) {
    if (data.toString().match(/Everything should be running now./)) {
        testHTTPReachability().then(function () {
            if (httpd_config.ssl.active) {
                testHTTPSReachability().then(function () {
                    server_proc.kill("SIGINT");
                    process.exit(passed);
                });
            } else {
                server_proc.kill("SIGINT");
                process.exit(passed);
            }
        });
    }
});
