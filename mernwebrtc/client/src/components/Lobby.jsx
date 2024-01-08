import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SokitProvider";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );
  const handleJoinRoom = useCallback((data) => {
    const { email, room } = data;
    console.log(email, room, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>.emal room");
    navigate(`/room/:${room}`);
  }, []);
  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="emailInput">Email:</label>
          <input
            type="text"
            value={email}
            id="emailInput"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="roomInput">Room:</label>
          <input
            type="text"
            value={room}
            id="roomInput"
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

export default Lobby;
