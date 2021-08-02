/**
 * Note: This is from stackoverflow: https://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function
 */
function _getCallerFile() {
    var filename;

    var _pst = Error.prepareStackTrace;
    Error.prepareStackTrace = function (err, stack) {
        return stack;
    };
    try {
        var err = new Error();
        var callerfile;
        var currentfile;

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if (currentfile !== callerfile) {
                filename = callerfile;
                break;
            }
        }
    } catch (err) {}
    Error.prepareStackTrace = _pst;

    return filename;
}

const path = require("path");
var console_log = console.log;
console.log = function (msg) {
    console_log(`[${path.basename(_getCallerFile())}]: ${msg}`);
};
var console_warn = console.warn;
console.warn = function (msg) {
    console_warn(`[${path.basename(_getCallerFile())}]: ${msg}`);
};
