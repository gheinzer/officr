/*const http = require("http");

function HTTPMakeGETRequest(url, callback = function (statuscode, data) {}) {
    http.get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            callback(res.statusCode, data);
        });
    }).on("error", (err) => {
        callback(-1);
    });
}*/
const axios = require("axios").default;
async function HTTPMakeGETRequest(
    url,
    callback = function (statuscode, data) {}
) {
    try {
        var response = await axios.get(url);
        callback(response.status, response);
        return response;
    } catch (error) {
        callback(-1, error);
        return error;
    }
}
async function HTTPMakePOSTRequest(
    url,
    data,
    callback = function (statuscode, data) {}
) {
    try {
        var response = await axios.post(url, data);
        callback(response.status, response);
        return response;
    } catch (error) {
        callback(-1, error);
        return error;
    }
}
module.exports = { HTTPMakeGETRequest, HTTPMakePOSTRequest };
