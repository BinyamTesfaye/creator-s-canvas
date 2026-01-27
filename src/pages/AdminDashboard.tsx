import { motion } from "framer-motion";
import { Package, Image, ShoppingCart, TrendingUp } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useOrders } from "@/hooks/useOrders";

const AdminDashboard = () => {
  const { data: products } = useProducts();
  const { data: portfolio } = usePortfolio();
  const { data: orders } = useOrders();

  const stats = [
    {
      name: "Total Products",
      value: products?.length || 0,
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      name: "Portfolio Items",
      value: portfolio?.length || 0,
      icon: Image,
      color: "bg-accent/20 text-accent-foreground",
    },
    {
      name: "Total Orders",
      value: orders?.length || 0,
      icon: ShoppingCart,
      color: "bg-secondary text-secondary-foreground",
    },
    {
      name: "Pending Orders",
      value: orders?.filter((o) => o.status === "pending").length || 0,
      icon: TrendingUp,
      color: "bg-destructive/10 text-destructive",
    },
  ];

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your store.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl border border-border p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-3xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-xl border border-border shadow-soft"
      >
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="divide-y divide-border">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 md:p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.product_name} × {order.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${order.total_price?.toFixed(2) || "0.00"}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No orders yet. They'll appear here when customers place orders.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
