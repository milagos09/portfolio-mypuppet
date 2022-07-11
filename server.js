const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors");
const PORT = process.env.PORT || 3333;

app.use(express.static(__dirname + "/public"));

const corsOptions = {
    origin: [`http://localhost:${PORT}`, "https://agitated-goldwasser-4eebd5.netlify.app"],
    optionsSuccessStatus: 200,
};

server.listen(PORT, () => console.log(`express server started on http://localhost:${PORT}`));

require("./sockets-server")(io, app);
