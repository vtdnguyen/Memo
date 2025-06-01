import { useState, useEffect, useCallback } from "react";
import { useSocketMessage } from "@/src/contexts/SocketContext";
import { useAppSelector } from "@/src/redux/hooks";
import { API_URL } from "@/src/redux/slices/authSlice";
import { Message } from "@/src/types/message";
import { RootState } from "@/src/redux/store";

export const useMessage = (receiverId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketMessage = useSocketMessage();
  const currentUser = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!socketMessage) return;

    const handleConnect = () => {
      console.log("Socket connected in useMessage");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected in useMessage");
      setIsConnected(false);
    };

    socketMessage.on("connect", handleConnect);
    socketMessage.on("disconnect", handleDisconnect);

    setIsConnected(socketMessage.connected);

    return () => {
      socketMessage.off("connect", handleConnect);
      socketMessage.off("disconnect", handleDisconnect);
    };
  }, [socketMessage]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketMessage || !currentUser || !isConnected) {
        console.error(
          "Cannot send message: Socket not connected or user not logged in"
        );
        return;
      }

      const messageData = {
        receiverId,
        content,
      };

      try {
        socketMessage.emit("send-message", messageData);
      } catch (err) {
        console.error("Error sending message:", err);
        setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
      }
    },
    [socketMessage, receiverId, currentUser, isConnected]
  );

  const fetchMessages = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    console.log('message receiverId', receiverId);
    

    try {
      const response = await fetch(`${API_URL}/message/${receiverId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      console.log("data messages", data);

      const sortedMessages = data.data.sort((a: Message, b: Message) => {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      setMessages(sortedMessages as Message[]);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [receiverId, currentUser]);

  useEffect(() => {
    if (!socketMessage || !isConnected) return;

    const handleReceiveMessage = (message: Message) => {
      console.log("Received new message:", message);
      if (
        message.receiver.id === currentUser?.id ||
        message.sender.id === receiverId
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socketMessage.on("receive-message", handleReceiveMessage);

    return () => {
      socketMessage.off("receive-message", handleReceiveMessage);
    };
  }, [socketMessage, receiverId, isConnected, currentUser?.id]);

  useEffect(() => {
    if (isConnected) {
      fetchMessages();
    }
  }, [fetchMessages, isConnected]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    fetchMessages,
    isConnected,
    setMessages,
  };
};
