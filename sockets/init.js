const socketIO = require("socket.io");

const Server = socketIO.Server;

const init = (httpServer, app) => {
  const io = new Server(httpServer);
  io.on("connection", (socket) => {
    console.log("Connection established");
  })

  app.io = io;
}

module.exports = init;