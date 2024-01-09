const express = require('express');
const { createServer} = require('node:http');
const { Server } = require('socket.io');
const { Expo } = require('expo-server-sdk');

const getTokens = require('./src/getTokens');
const whichCollectionPublished = require('./src/middleware/index')

const port = process.env.PORT || 8080;

const app = express();
const server = createServer(app);

const io = new Server(server);
let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

app.use(express.json());

io.on('connection', (socket) => {
  console.log('user connected');
});

app.post('/hooks', whichCollectionPublished, async (req, res) => {

  const pushTokens = await getTokens();
  
  const payload = req.body;
  let messageBody = payload.model == 'tech-tips' ?
    'Discover the newest programming techniques and tech wonders.'
    : 'Explore the latest opportunity! Don\'t miss out on this exciting opportunity. Tap to view details';
      
  let title = payload.model == 'tech-tips' ?
    'Stay Ahead: Dive into Tech Tips!' :
    'New Opportunity Available!'
  
  let messages = [];
  for (let pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.log(`Invalid token: ${pushToken}`);
      continue
    }

    messages.push({
      to: pushToken,
      sound: 'default',
      title: title,
      body: messageBody,
      data: { notificationData: payload }
    })
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];

  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        
      }
    }
  })();

  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  (async () => {
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];

          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            console.error(`There was an error sending a notification: ${message}`);

            if (details && details.error) {
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();

  
  res.json({
    'success': 'ok',
    'hooks': 'it works'
  });
  io.emit('notifications', {'data': payload ?? 'not valid'})
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
})