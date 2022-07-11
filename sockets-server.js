const puppeteer = require("./puppeteer");
const path = require("path");
module.exports = function (io, app) {
    io.on("connection", (socket) => {
        console.log(`client ${socket.id} has connected`);
        socket.on("start", async (data) => {
            console.log(data);
            const { url, headless, iterations } = data;
            try {
                const result = await puppeteer(url, headless, iterations, socket);
            } catch (error) {
                console.log(error);
                socket.emit("logs", "encountered an error! ❌");
            }
        });
    });
};
