require("./server/console");
console.log("Starting httpd.js...");
require("./server/httpd"); // This script is responsible serving the files in public_html via http.
console.log("Starting mysql.js...");
require("./server/mysql");
