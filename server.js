require("./server/console");
console.log("Starting httpd.js...");
require("./server/httpd"); // This script is responsible for serving the files in public_html via http.
console.log("Starting ws.js...");
require("./server/ws"); // This script is responsible for creating a websocket for communication with the front end.
