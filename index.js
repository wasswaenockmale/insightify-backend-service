const express = require('express');
const { createServer} = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(express.json());


app.get('/', (req, res) => {
  console.log("It works");
  res.json({
    'success': 200
  });
})
io.on('connection', () => {
  console.log('user connected');
});

app.get('/hooks', (req, res) => {
  // const payload = req.body;
  console.log("No, error occuring");
  // io.emit('notification', { payload });
  res.json({
    'success': 'ok',
    'hooks':'yes'
  });
})

app.get('/tech-tips', (req, res) => {
  // const payload = req.body;
  // io.emit('tech-tips', { payload });
  res.json({
    'success': 'ok',
    'tech-tips':'ok'
  });
})


server.listen(3000, () => {
  console.log('server running');
})