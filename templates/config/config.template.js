/**
 * This is the configuration for the server that servers the files in public_html.
 */
const httpd_config = {
    port: "{httpd_port}", // Sets the port for the server. Default: 80
    lang: "{httpd_lang}", // Sets the language for the documents. When set to null, the default language of the client is used. Default: undefined
    logging: {
        // Configures, what is logged by the server.
        remote_lang: "true", // Configures, wheter the client language is logged or not. Default: true
        requested_path: "true", // Configures, wheter the requested path is logged or not. Default: true
    },
};

module.exports = httpd_config;
