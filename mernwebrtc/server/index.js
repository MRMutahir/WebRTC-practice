import express from "express";
import { Server } from "socket.io";

const server = express();
const port = 8000;
const io = new Server(port, {
  cors: true,
});
const emailToSocketIDMap = new Map();
const socketIdemailToMap = new Map();
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("room:join", (data) => {
    console.log(data);
    const { email, room } = data;
    emailToSocketIDMap.set(email, socket.id);
    socketIdemailToMap.set(socket.id, email);
    io.to(room).emit("user:joined", {
      email,
      id: socket.id,
    });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("call:user", ({ to, offer }) => {
    io.to(to).emit("incomming:call", {
      from: socket.id,
      offer,
    });
  });
  socket.on("call:accepted", ({ to, answer }) => {
    io.to(to).emit("call:accepted", { from: socket.id, answer });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", (to, ans) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});

server.listen(() => {
  console.log("server is running");
});
