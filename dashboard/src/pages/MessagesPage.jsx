import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Send, Loader2, MessageSquare, User } from "lucide-react";
import toast from "react-hot-toast";
import {
  getConversations,
  getConversation,
  sendMessage,
} from "../services/api";

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
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  // Fetch selected conversation messages
  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ["conversation", selectedClient?.clientId],
    queryFn: async () => {
      const response = await getConversation(selectedClient.clientId);
      return response.data;
    },
    enabled: !!selectedClient,
    refetchInterval: 3000, // Auto-refresh every 3 seconds
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

  const handleSendMessage = (e) => {
    e.preventDefault();
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
      {/* Conversations List (Left Sidebar) */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500">
            {conversations.length} conversations
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedClient(conv)}
              className={`w-full p-4 border-b text-left hover:bg-gray-50 transition-colors ${
                selectedClient?.id === conv.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conv.client?.name || "Unknown"}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conv.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {conv.client?.phone}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Thread (Right Panel) */}
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
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedClient.client?.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedClient.client?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : messages && messages.length > 0 ? (
                messages.reverse().map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.direction === "OUTBOUND"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.direction === "OUTBOUND"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-900 border"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.direction === "OUTBOUND"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">No messages yet</div>
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t bg-white"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  disabled={sendMutation.isPending}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || sendMutation.isPending}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {sendMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
