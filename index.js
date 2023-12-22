const express = require('express');
const { createServer} = require('node:http');
const { Server } = require('socket.io');

const port = process.env.PORT || 8080;

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(express.json());

app.get('/hooks', (req, res) => {
  const payload = req.body;
  console.log("No, error occuring");
  io.on('connection', (socket) => {
    console.log('user connected', socket);
    socket.emit('notifications', {'data': payload ?? 'not valid'})
  });
  res.json({
    'success': 'ok',
    'hooks':'yes'
  });
})


server.listen(port, () => {
  console.log(`Listening on port ${port}`);
})