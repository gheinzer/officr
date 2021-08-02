const readline = require("readline");
const httpd_config = require("./config");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log(`
        @@@@@@@@@@@@@@@@@@@@@@
       @@@@@@@@@@@@@@@@@@@@@@ 
      @@@@@    @@@@     @@@@  
     @@@@@    @@@@     @@@@   
    @@@@@    @@@@     @@@@    
   @@@@@    @@@@     @@@@     
  @@@@@    @@@@     @@@@      
 @@@@@    @@@@     @@@@       
`);
console.log("Welcome to MySQLOffice.");
console.log("\n******************************\n");
console.log(
    "It is strongly recommended to use the builtin server for serving the software. The next questions will be about this server.\n"
);
rl.question(
    "\tOn which port do you want the server to listen on? Please make sure to choose a port, that is not used by an other application.",
    function (answer) {
        try {
            httpd_config.port = parseInt(answer);
        } catch {
            console.log("Could not save the configuration");
        }
    }
);
