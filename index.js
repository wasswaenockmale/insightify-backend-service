const express = require('express');
const { createServer} = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(express.json());

io.on('connection', () => {
  console.log('user connected');
});

app.get('/opportunities', (req, res) => {
  const payload = req.body;
  io.emit('opportunites', { payload });
  res.json({
    'success': 'ok',
  });
})

app.get('/tech-tips', (req, res) => {
  const payload = req.body;
  io.emit('tech-tips', { payload });
  res.json({
    'success': 'ok'
  });
})


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
})