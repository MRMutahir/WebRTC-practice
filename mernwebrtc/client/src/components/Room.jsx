import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SokitProvider";
import ReactPlayer from "react-player";

const Room = () => {
  const socket = useSocket();
  const [remotSocketId, setRemotSocketId] = useState(null);
  const [myStream, setmyStream] = useState(null);

  const handelUserJoined = useCallback(({ email, id }) => {
    console.log(`email ${email}  join room`);
    setRemotSocketId(id);
  }, []);
  useEffect(() => {
    socket.on("user:joined", handelUserJoined);
    return () => {
      socket.off("user:joined", handelUserJoined);
    };
  }, [handelUserJoined]);

  const handelCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setmyStream(stream);
  }, []);
  return (
    <div>
      <h4>{remotSocketId ? "Connected" : "no one in Room "}</h4>
      {remotSocketId && <button onClick={handelCallUser}>Call</button>}
      <h1>My Stream</h1>
      {myStream && (
        <ReactPlayer playing muted width={100} height={100} url={myStream} />
      )}
    </div>
  );
};

export default Room;
