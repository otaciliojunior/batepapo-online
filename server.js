const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', function connection(ws) {
  clients.add(ws);

  ws.on('message', function incoming(message) {
    broadcast(message, ws);
  });

  ws.on('close', function () {
    clients.delete(ws);
  });
});

function broadcast(message, sender) {
  clients.forEach(function each(client) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log(`Servidor WebSocket em execução na porta ${port}`);
});
