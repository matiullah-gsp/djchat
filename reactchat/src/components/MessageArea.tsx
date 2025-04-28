import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useState, useEffect, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import type { Message } from "../types/interfaces";
import { WS_URL } from "../config";
import useCrud from "../hook/useCrud";

const MessageArea = ({ selectedChannelId }: { selectedChannelId: string }) => {
  const socketUrl = `${WS_URL}/${selectedChannelId}/`;
  const [messages, setMessages] = useState<Message[]>([]);

  // Track previous channel for clean transitions
  const [prevChannelId, setPrevChannelId] = useState<string | null>(null);

  const { getAll: fetchMessages } = useCrud<Message[]>({
    apiPath: `messages/?channel_id=${selectedChannelId}`,
    initialData: [],
  });

  // Reset messages when changing channels
  useEffect(() => {
    if (prevChannelId !== selectedChannelId) {
      setMessages([]);
      setPrevChannelId(selectedChannelId);
    }
  }, [selectedChannelId, prevChannelId]);

  // Memoize the fetch function to avoid unnecessary re-renders
  const loadMessages = useCallback(async () => {
    try {
      const messageData = await fetchMessages();
      if (messageData) {
        // Add a small delay to ensure proper animation
        setTimeout(() => {
          setMessages(messageData);
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [fetchMessages]);

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: (data) => {
      console.info("onOpen:", data);
      loadMessages();
    },
    onClose: (data) => {
      console.info("onClose:", data);
    },
    onError: (event) => {
      console.info("onError:", event);
    },
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    },
    // Reconnect automatically and handle channel changes
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    sendJsonMessage({
      content: content,
      conversation: selectedChannelId,
    });
  };

  return (
    <>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </>
  );
};

export default MessageArea;
