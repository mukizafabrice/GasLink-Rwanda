import React from "react";
import ClientLayout from "@/components/client/ClientLayout";
import OrderCard from "@/components/shared/OrderCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { clientService } from "@/services/platform.service";
import type { Order } from "@/types";

const OrderHistoryPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const response = await clientService.getOrderHistory();
      if (response.success && response.data) {
        setOrders(response.data);
      }
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <ClientLayout pageTitle="Order History" breadcrumbs={[{ label: "Orders" }]}>
      {loading ? (
        <LoadingSpinner label="Loading order history..." />
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
          {!orders.length && (
            <div className="p-10 text-center bg-white border border-dashed border-gray-300 rounded-2xl text-gray-500">
              No orders yet. Your deliveries will appear here.
            </div>
          )}
        </div>
      )}
    </ClientLayout>
  );
};

export default OrderHistoryPage;
