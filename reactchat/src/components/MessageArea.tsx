import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import type { Message } from "../types/interfaces";
import { WS_URL } from "../config";

const MessageArea = ({ selectedChannel }: { selectedChannel: number }) => {
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const socketUrl = `${WS_URL}/${selectedChannel}/`;

  const { sendJsonMessage, lastMessage } = useWebSocket(socketUrl, {
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
      setNewMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: parsedData.message,
          author: parsedData.author || "Anonymous",
          channel: parsedData.channel || selectedChannel,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        },
      ]);
    },
  });

  useEffect(() => {
    if (lastMessage !== null) {
      console.log("Last Message:", lastMessage);
    }
  }, [lastMessage]);

  return (
    <>
      <MessageList messages={newMessages.filter((msg) => msg.channel === selectedChannel)} />
      <MessageInput
        onSendMessage={(msg) => {
          sendJsonMessage({ message: msg, channel: selectedChannel });
        }}
      />
    </>
  );
};

export default MessageArea;
