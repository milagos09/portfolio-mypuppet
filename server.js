const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 3333;

app.use(express.static(__dirname + "/public"));

server.listen(PORT, () => console.log(`express server started on http://localhost:${PORT}`));

require("./sockets-server")(io, app);
