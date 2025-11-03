import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import {
  getConversations,
  getConversation,
  sendMessage,
} from "../services/api";
import ConversationList from "../components/messages/ConversationList";
import MessageThread from "../components/messages/MessageThread";
import MessageInput from "../components/messages/MessageInput";

export default function MessagesPage() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [messageText, setMessageText] = useState("");
  const queryClient = useQueryClient();

  // Fetch all conversations
  const { data: conversations, isLoading: loadingConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await getConversations();
      return response.data;
    },
    refetchInterval: 5000,
  });

  // Fetch selected conversation messages
  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ["conversation", selectedClient?.clientId],
    queryFn: async () => {
      const response = await getConversation(selectedClient.clientId);
      // Sort messages by createdAt ascending (oldest first, newest last)
      return response.data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    },
    enabled: !!selectedClient,
    refetchInterval: 3000,
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(["conversation", selectedClient?.clientId]);
      queryClient.invalidateQueries(["conversations"]);
      setMessageText("");
      toast.success("Message sent! 📤");
    },
    onError: (error) => {
      toast.error(
        `Failed to send: ${error.response?.data?.error || error.message}`
      );
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedClient) return;

    sendMutation.mutate({
      clientPhone: selectedClient.client.phone,
      content: messageText,
      deviceId: selectedClient.deviceId || null,
    });
  };

  if (loadingConversations) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No conversations yet
        </h3>
        <p className="text-gray-500">
          Conversations will appear here when customers reply to notifications
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-250px)] bg-white rounded-lg shadow-sm border overflow-hidden">
      <ConversationList
        conversations={conversations}
        selectedClient={selectedClient}
        onSelectClient={setSelectedClient}
      />

      <div className="flex-1 flex flex-col">
        {!selectedClient ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Select a conversation to view messages</p>
            </div>
          </div>
        ) : (
          <>
            <MessageThread
              selectedClient={selectedClient}
              messages={messages}
              isLoading={loadingMessages}
            />
            <MessageInput
              messageText={messageText}
              setMessageText={setMessageText}
              onSend={handleSendMessage}
              isSending={sendMutation.isPending}
            />
          </>
        )}
      </div>
    </div>
  );
}
