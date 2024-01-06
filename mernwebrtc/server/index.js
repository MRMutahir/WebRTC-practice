import express from "express";
import { Server } from "socket.io";

const server = express();
const port = 8000;
const io = new Server(port, {
  cors: true,
});
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});

server.listen(() => {
  console.log("server is running");
});
