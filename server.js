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
    console.log("Starting ws.js...");
    require("./server/ws"); // This script is responsible for creating a websocket for communication with the front end.
    console.log("Starting expired-remover.js...");
    require("./server/expired-remover"); // This script is responsible for removing all expired sessions
}
