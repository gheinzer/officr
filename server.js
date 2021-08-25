var cluster = require("cluster");
if (cluster.isMaster) {
    cluster.fork();

    cluster.on("exit", function (worker, code, signal) {
        cluster.fork();
    });
}

if (cluster.isWorker) {
    start();
}
function start() {
    const officr_logo = `
                                                                                
                                                                                
                                             ,@@@                               
                       @@@@@@@    @@@@@@@*  @@@@@@@                             
                     @@@@@@@@*  @@@@@@@@@     #@,                               
     @@@@@@@@@     @@@@@@@@@@@@@@@@@@@@@@    @@@@@       @@@@@@@@     @@@@@ @@@@
  @@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@    @@@@@    @@@@@@@@@@@@@@  @@@@@@@@@@
 @@@@@@     @@@@@@   @@@@@      @@@@@        @@@@@   @@@@@            @@@@@@    
 @@@@@(      @@@@@   @@@@@      @@@@@        @@@@@  #@@@@@            @@@@@     
  @@@@@@   @@@@@@    @@@@@      @@@@@        @@@@@   @@@@@@.  @@@@@   @@@@@     
    @@@@@@@@@@@.     @@@@@      @@@@@        @@@@@     @@@@@@@@@@@@   @@@@@     
                                                                                
                                                                                
                                                                                `;
    console.log("Welcome to officr.");
    console.log(officr_logo);
    require("./server/console");
    console.log("Starting httpd.js...");
    require("./server/httpd"); // This script is responsible for serving the files in public_html via http.
    console.log("Starting ws.js...");
    require("./server/ws"); // This script is responsible for creating a websocket for communication with the front end.
}
