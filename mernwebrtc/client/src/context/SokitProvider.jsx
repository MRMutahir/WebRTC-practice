import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

const SoketContext = createContext(null);

const socket = io("http://localhost:8000"); // Initialize socket outside useMemo

export const useSocket = () => {
  const socket = useContext(SoketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const memoizedSocket = useMemo(() => socket, []); // Memoize the socket instance

  return (
    <SoketContext.Provider value={memoizedSocket}>
      {props.children}
    </SoketContext.Provider>
  );
};
