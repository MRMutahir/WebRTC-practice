import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SokitProvider";
import ReactPlayer from "react-player";
import PeerService from "../service/peer.js";

const Room = () => {
  const socket = useSocket();
  const [remotSocketId, setRemotSocketId] = useState(null);
  const [myStream, setmyStream] = useState(null);
  const [remoteStream, setremoteStreamm] = useState("");

  const handelUserJoined = useCallback(({ email, id }) => {
    console.log(`email ${email}  join room`);
    setRemotSocketId(id);
  }, []);
  const handelincommingCall = useCallback(
    async (from, offer) => {
      setRemotSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      // console.log(`  handelincommingCall  ${offer} ${from}`);
      const answer = await PeerService.getAnswer(offer);
      socket.emit("call:accepted", { to: from, answer });
      setmyStream(stream);
    },
    [socket]
  );

  const sendStrem = useCallback(() => {
    for (const track of myStream.getTracks()) {
      PeerService.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  // const sendStrem = useCallback(() => {
  //   if (myStream && PeerService.peer) {
  //     PeerService.peer.getSenders().forEach((sender) => {
  //       myStream.getTracks().forEach((track) => {
  //         if (sender.track && sender.track.kind === track.kind) {
  //           PeerService.peer.removeTrack(sender);
  //         }
  //       });
  //     });
  //     myStream.getTracks().forEach((track) => {
  //       PeerService.peer.addTrack(track, myStream);
  //     });
  //   }
  // }, [myStream]);
  const handelacceptedCall = useCallback(
    ({ from, answer }) => {
      PeerService.setLocalDescription(answer);
      console.log("Call accepted");
      sendStrem();
    },
    [sendStrem]
  );
  const handelNegoNeedFinal = useCallback(async ({ ans }) => {
    await PeerService.setLocalDescription(ans);
  }, []);

  const handelNegoNeedIncomming = useCallback(
    async (from, offer) => {
      const answer = await PeerService.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, answer });
    },
    [socket]
  );
  useEffect(() => {
    PeerService.peer.addEventListener("track", async (ev) => {
      const remoteStrem = ev.streams;
      console.log("GOT TRACKS!!");
      setremoteStreamm(remoteStrem[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handelUserJoined);
    socket.on("incomming:call", handelincommingCall);
    socket.on("call:accepted", handelacceptedCall);
    socket.on("peer:nego:needed", handelNegoNeedIncomming);
    socket.on("peer:nego:final", handelNegoNeedFinal);

    return () => {
      socket.off("user:joined", handelUserJoined);
      socket.off("incomming:call", handelincommingCall);
      socket.off("call:accepted", handelacceptedCall);
      socket.off("peer:nego:needed", handelNegoNeedIncomming);
      socket.off("peer:nego:final", handelNegoNeedFinal);
    };
  }, [
    socket,
    handelUserJoined,
    handelincommingCall,
    handelacceptedCall,
    handelNegoNeedIncomming,
    handelNegoNeedFinal,
  ]);

  const handelCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await PeerService.getOffer();
    socket.emit("call:user", {
      to: remotSocketId,
      offer,
    });
    setmyStream(stream);
  }, [remotSocketId, socket]);

  const handleNogoNeeded = useCallback(async () => {
    const offer = await PeerService.getOffer();
    socket.emit("peer:nego:needed", {
      offer,
      to: remotSocketId,
    });
  }, [remotSocketId, socket]);
  useEffect(() => {
    PeerService.peer.addEventListener("negotiationneeded", handleNogoNeeded);
    return () => {
      PeerService.peer.removeEventListener(
        "negotiationneeded",
        handleNogoNeeded
      );
    };
  }, [handleNogoNeeded]);
  return (
    <div>
      <h4>{remotSocketId ? "Connected" : "no one in Room "}</h4>
      {remotSocketId && <button onClick={handelCallUser}>Call</button>}
      {myStream && <button onClick={sendStrem}>send Stream</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer playing muted width={100} height={100} url={myStream} />
        </>
      )}

      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            width={100}
            height={100}
            url={remoteStream}
          />
        </>
      )}
    </div>
  );
};

export default Room;
