const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
app.use(express.static("public"))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (client) => {
  client.on('group', function (new_room) {
    client.leave(client.room);
    client.join(new_room)
    client.room = new_room;
  });

  client.on("bzzz", msg => {
    console.log(client, msg)
    client.broadcast.emit(client.room, msg);
  });
});

http.listen(port, () => {
  console.log(`bug.chat running at http://localhost:${port}/`);
});
