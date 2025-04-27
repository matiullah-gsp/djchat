import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const socketUrl = "ws://127.0.0.1:8003/ws/chat/";

export default function Server() {
  const [newMessages, setNewMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");


  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: (data) => {
      console.log("Connected to server");
      console.log("On Open:", data);
    },
    onClose: (data) => {
      console.log("Disconnected from server");
      console.log("On Close:", data);
    },
    onError: (event) => {
      console.log("On Error:", event);
    },
    onMessage: (event) => {
      console.log("On Message:", event);
      const parsedData = JSON.parse(event.data);
      setNewMessages((prev) => [...prev, parsedData.message]);
    },
  });

  useEffect(() => {
    if (lastMessage !== null) {
      console.log("Last Message:", lastMessage);
    }
  }, [lastMessage]);

  const sendInputMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendJsonMessage({ message: inputMessage });
    setInputMessage("");
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>Server</h1>
      <form
        onSubmit={sendInputMessage}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <input
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </form>

      {newMessages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
}
