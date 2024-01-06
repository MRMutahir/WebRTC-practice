import React, { useCallback, useState } from "react";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  // const  soket  =  uses

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log({
        email,
        room,
      });
      // Here, you might perform additional actions like sending the form data to an API
    },
    [email, room]
  );

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
