import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Messages Coming Soon
      </h3>
      <p className="text-gray-500">
        The messaging interface will be built next!
      </p>
    </div>
  );
}
