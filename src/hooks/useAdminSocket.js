import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useAdminSocket() {
  const socketRef = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    // Init sound
    soundRef.current = new Audio("/sounds/sound.aac");
    soundRef.current.volume = 0;

    const unlock = () => {
      soundRef.current.play().catch(() => {});
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);

    // Init socket
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Global socket connected");
    });

    socketRef.current.on("new-order", () => {
  if (document.visibilityState === "hidden") {
    // keep volume higher for background tab
    soundRef.current.volume = 1;
  } else {
    soundRef.current.volume = 0.7;
  }

  soundRef.current.currentTime = 0;
  soundRef.current.play();
});


    return () => {
         window.removeEventListener("click", unlock);
      socketRef.current.disconnect();
    };
  }, []);
}
