import { useState, useCallback, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../config";
import useCrud from "../hook/useCrud";
import { Message } from "../types/interfaces";
import { useAuthService } from "./auth-service";
import { AxiosError } from "axios";

interface UseChatServiceProps {
  selectedChannelId: string;
}

export const useChatService = ({ selectedChannelId }: UseChatServiceProps) => {
  const { logout, refreshAccessToken } = useAuthService();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [prevChannelId, setPrevChannelId] = useState<string | null>(null);

  const socketUrl = `${WS_URL}/${selectedChannelId}/`;

  const { getAll: fetchMessages } = useCrud<Message[]>({
    apiPath: `messages/?channel_id=${selectedChannelId}`,
  });

  useEffect(() => {
    if (prevChannelId !== selectedChannelId) {
      setMessages([]);
      setPrevChannelId(selectedChannelId);
    }
  }, [selectedChannelId, prevChannelId]);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const messageData = await fetchMessages();
      if (messageData) {
        setTimeout(() => {
          setMessages(messageData);
          setLoading(false);
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  }, [fetchMessages]);

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: (data) => {
      console.info("onOpen:", data);
      loadMessages();
    },
    onClose: (event) => {
      if (event.code === 4001) {
        console.log("Authentication Failed");
        refreshAccessToken().catch(async (error: AxiosError) => {
          if (error.status === 401) {
            await logout();
          }
        });
      }
      console.info("onClose:", event);
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
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    sendJsonMessage({
      content: content,
      conversation: selectedChannelId,
    });
  };

  return {
    messages,
    loading,
    sendMessage,
  };
};
