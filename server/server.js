const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from public
app.use(express.static(path.join(__dirname, '..', 'public')));

io.on('connection', (socket) => {
  console.log('Novo usuário conectado:', socket.id);

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);
  });

  socket.on('typing', (payload) => {
    io.emit('typing', payload);
  });

  socket.on('newMember', (payload) => {
    io.emit('newMember', payload);
  });

  // Receive image uploads (as data URL) and broadcast to all clients
  socket.on('image', (payload) => {
    // payload: { author, dataUrl, time }
    io.emit('image', payload);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
