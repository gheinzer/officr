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
const path = require("path");
var console_log = console.log;
console.log = function (msg, color = colors.Foreground.Green) {
    if (color === null) {
        console_log(`[${path.basename(_getCallerFile())}]: ${msg}`);
    } else {
        console_log(
            `[${path.basename(_getCallerFile())}]: ${color}${msg}${
                colors.Reset
            }`
        );
    }
};
var console_warn = console.warn;
console.warn = function (msg, color = colors.Foreground.Yellow) {
    console_warn(
        `[${path.basename(_getCallerFile())}]: ${color}${msg}${colors.Reset}`
    );
};
