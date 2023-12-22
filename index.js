const express = require('express');
const { createServer} = require('node:http');
const { Server } = require('socket.io');

const port = process.env.PORT || 8080;

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(express.json());

io.on('connection', (socket) => {
  console.log('user connected', socket);
});

app.post('/hooks', (req, res) => {
  const payload = req.body;
  console.log("No, error occuring", payload);
  res.json({
    'success': 'ok',
    'hooks':'it works'
  });
  io.emit('notifications', { 'data': payload ?? 'not valid' });
})


server.listen(port, () => {
  console.log(`Listening on port ${port}`);
})