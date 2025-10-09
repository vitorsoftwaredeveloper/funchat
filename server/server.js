import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);

  socket.on("chatMessage", (msg) => {
    // Envia a mensagem para todos os usuários conectados
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
