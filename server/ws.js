const WebSocket = require("ws");
const { ws_config } = require("../config");

const server = new WebSocket.Server({ port: parseInt(ws_config.port) });

const messagesFunctions = {
    getSubjects: null,
};

server.on("connection", (socket) => {
    socket.on("message", (message) => {});
});
