/**
 * This is the configuration for the server that servers the files in public_html.
 */
const httpd_config = {
    public_html: "public_html", // Sets the path to the public_html directory. Default is public_html.
    port: "8001", // Sets the port for the server. Default: 80
    lang: null, // Sets the language for the documents. When set to null, the default language of the client is used. Default: undefined
    logging: {
        // Configures, what is logged by the server.
        remote_lang: true, // Configures, wheter the client language is logged or not. Default: true
        requested_path: true, // Configures, wheter the requested path is logged or not. Default: true
    },
    ssl: {
        active: false, // Sets, wheter the https server should run or not. Default: false
        port: "443", // Sets the port for the https server. Default: 443
        options: {
            cert: "somecert.cert",
            key: "somkey.pem",
        },
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
        database: "officr", // Default: "officr"
        debug: false, // Default: false
    },
};

const pages = {
    authentication_required: [/todo?!(svg|png)/], // Sets the pages, that require authentication. Use JS regex. Default: [/todo?!(svg|png)/]
    redirect_when_authenticated: [/login/, /signup/], // Sets the pages, that should not be visited when authenticated. Use JS regex. Default: [/login/, /signup/]
};

const ws_config = {
    port: "8001", // Sets the port for the websocket. Default: 3000
};

module.exports = { httpd_config, mysql_config, pages, ws_config };
