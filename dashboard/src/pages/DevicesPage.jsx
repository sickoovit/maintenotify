import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getDevices, createDevice, updateDeviceStatus } from "../services/api";

const STATUS_COLORS = {
  RECEIVED: "bg-blue-100 text-blue-800",
  WORKING: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-800",
  DELIVERED: "bg-gray-100 text-gray-800",
};

const STATUSES = ["RECEIVED", "WORKING", "DONE", "DELIVERED"];

export default function DevicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    clientPhone: "",
  });

  const queryClient = useQueryClient();

  // Fetch devices
  const { data: devices, isLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const response = await getDevices();
      return response.data;
    },
  });

  // Create device mutation
  const createMutation = useMutation({
    mutationFn: createDevice,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["devices"]);
      setShowForm(false);
      setFormData({ name: "", clientName: "", clientPhone: "" });

      const deviceName = response?.data?.name || "Device";
      const clientName = response?.data?.client?.name || "customer";

      toast.success(`Device "${deviceName}" created successfully! 📱`);
      toast.success(`WhatsApp notification sent to ${clientName}`);
    },
    onError: (error) => {
      console.error("Create device error:", error);
      toast.error(
        `Failed to create device: ${
          error.response?.data?.error || error.message
        }`
      );
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateDeviceStatus(id, status),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries(["devices"]);
      const statusEmojis = {
        RECEIVED: "📥",
        WORKING: "🔧",
        DONE: "✅",
        DELIVERED: "🎉",
      };
      toast.success(
        `Status updated to ${variables.status} ${
          statusEmojis[variables.status]
        }`
      );
      toast.success("Customer notified via WhatsApp");
    },
    onError: (error) => {
      toast.error(
        `Failed to update status: ${
          error.response?.data?.error || error.message
        }`
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleStatusChange = (deviceId, newStatus) => {
    updateStatusMutation.mutate({ id: deviceId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Devices</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Device</span>
        </button>
      </div>

      {/* Add Device Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Add New Device</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="e.g., iPhone 12 Pro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Phone
              </label>
              <input
                type="tel"
                required
                value={formData.clientPhone}
                onChange={(e) =>
                  setFormData({ ...formData, clientPhone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="e.g., 201234567890"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createMutation.isPending ? "Creating..." : "Create Device"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Devices List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {devices?.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No devices yet. Add your first device to get started!
                  </td>
                </tr>
              ) : (
                devices?.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{device.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.client?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.client?.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={device.status}
                        onChange={(e) =>
                          handleStatusChange(device.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[device.status]
                        } border-0 focus:ring-2 focus:ring-blue-500`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(device.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
