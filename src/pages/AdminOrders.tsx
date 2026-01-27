import { motion } from "framer-motion";
import { Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrders, useUpdateOrder, Order } from "@/hooks/useOrders";
import { toast } from "sonner";
import { format } from "date-fns";

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const AdminOrders = () => {
  const { data: orders, isLoading } = useOrders();
  const updateOrder = useUpdateOrder();

  const handleStatusChange = async (orderId: string, status: Order["status"]) => {
    try {
      await updateOrder.mutateAsync({ id: orderId, status });
      toast.success("Order status updated!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update order");
    }
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          View and manage customer orders
        </p>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border p-6 shadow-soft"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">
                      {order.customer_name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {order.telegram_sent && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        Telegram sent
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{order.product_name}</span> × {order.quantity}
                    {" • "}
                    <span className="font-semibold text-primary">
                      ${order.total_price?.toFixed(2) || "0.00"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Contact: {order.customer_contact}
                  </p>
                  {order.message && (
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      "{order.message}"
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Select
                    value={order.status}
                    onValueChange={(v) => handleStatusChange(order.id, v as Order["status"])}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">
            No orders yet. They'll appear here when customers place orders.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
