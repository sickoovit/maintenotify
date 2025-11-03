import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getDevices, createDevice, updateDeviceStatus } from "../services/api";
import DeviceForm from "../components/devices/DeviceForm";
import DeviceTable from "../components/devices/DeviceTable";

export default function DevicesPage() {
  const [showForm, setShowForm] = useState(false);
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

  const handleCreateDevice = (formData) => {
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
        <DeviceForm
          onSubmit={handleCreateDevice}
          onCancel={() => setShowForm(false)}
          isSubmitting={createMutation.isPending}
        />
      )}

      {/* Devices Table */}
      <DeviceTable devices={devices} onStatusChange={handleStatusChange} />
    </div>
  );
}
