const express = require('express')
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('../web'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/index.html'));
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});
