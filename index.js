const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.get("/", (req, res) => {
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (client) => {
  const rm =
    client.handshake.headers["x-forwarded-for"] ||
    client.handshake.address.address;

  client.on("room", (r) => {
    client.leave(client.room);
    client.join(r);
    client.room = r;
    console.log(`xconnection from ${r}`);
  });
  console.log(`connection from ${rm}`);
  client.on("bzzz", (msg) => {
    client.broadcast.emit(client.room, { ...msg });
  });
});

http.listen(port, () => {
  console.log(`bug.chat running at http://localhost:${port}/`);
});
