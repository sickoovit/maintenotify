import { User } from "lucide-react";

export default function ConversationList({
  conversations,
  selectedClient,
  onSelectClient,
}) {
  return (
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
            onClick={() => onSelectClient(conv)}
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
  );
}
