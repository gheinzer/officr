/**
 * This is the configuration for the server that servers the files in public_html.
 */
const httpd_config = {
    public_html: "public_html", // Sets the path to the public_html directory. Default is public_html.
    port: "80", // Sets the port for the server. Default: 80
    lang: null, // Sets the language for the documents. When set to null, the default language of the client is used. Default: null
    hostname: "", // Sets the hostname to redirect to when redirections are required.
    logging: {
        // Configures, what is logged by the server.
        remote_lang: true, // Configures, whether the client language is logged or not. Default: true
        requested_path: true, // Configures, whether the requested path is logged or not. Default: true
    },
    ssl: {
        active: false, // Sets, whether the https server should run or not. Default: false
        port: "443", // Sets the port for the https server. Default: 443
        options: {
            cert: "somecert.cert",
            key: "somkey.pem",
        },
        auto_redirect: true, // Auto-redirect to HTTPS when the server is contacted on HTTP. Default is true.
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
    authentication_required: [/todo(?!(abc|def))/, /admin/], // Sets the pages, that require authentication. Use JS regex. Default: [/todo(?!(abc|def))/, /admin/]
    redirect_when_authenticated: [/login/, /signup/], // Sets the pages, that should not be visited when authenticated. Use JS regex. Default: [/login/, /signup/]
    redirect_root_when_authenticated: true,
};

const mail = {
    // This is the mail configuration.
    username: "", // The username to log in to the mailserver.
    password: "", // The password to log in to the mailserver.
    smtp_server: "", // The address of the mailserver
    emailaddress: "", // The emailaddress that is used in the name
    host: "", // The hostname to be sent with mails (in links)
};
(mail["name"] = `officr <${mail.emailaddress}>`), // The name that is shown in the clients inbox. Default: `officr <${mail.emailaddress}>`
    (module.exports = { httpd_config, mysql_config, pages, mail });
