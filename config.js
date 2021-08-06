/**
 * This is the configuration for the server that servers the files in public_html.
 */
const httpd_config = {
    port: "8001", // Sets the port for the server. Default: 80
    lang: null, // Sets the language for the documents. When set to null, the default language of the client is used. Default: undefined
    logging: {
        // Configures, what is logged by the server.
        remote_lang: "true", // Configures, wheter the client language is logged or not. Default: true
        requested_path: "true", // Configures, wheter the requested path is logged or not. Default: true
    },
};
/**
 * This sets up the my sql configuration.
 */
const mysql_config = {
    connection: {
        host: "localhost", // Default: "localhost"
        user: "root", // Default: "root"
        password: "", // Default: ""
        database: "officr_testing", // Default: "officr_testing"
        debug: false, // Default: false
    },
};

module.exports = httpd_config;
module.exports = mysql_config;
