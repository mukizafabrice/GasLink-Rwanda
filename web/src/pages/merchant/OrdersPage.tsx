import React from "react";
import toast from "react-hot-toast";
import MerchantLayout from "@/components/layouts/MerchantLayout";
import OrderCard from "@/components/shared/OrderCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { merchantService } from "@/services/platform.service";
import { OrderStatus, type Order } from "@/types";

const statusActions: OrderStatus[] = [
  OrderStatus.APPROVED,
  OrderStatus.REJECTED,
  OrderStatus.IN_TRANSIT,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];

const OrdersPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<Order[]>([]);

  const loadOrders = React.useCallback(async () => {
    setLoading(true);
    const response = await merchantService.getOrders();
    if (response.success && response.data) {
      setOrders(response.data);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const response = await merchantService.updateOrderStatus(orderId, status);
    if (response.success) {
      toast.success(`Order marked ${status.replaceAll("_", " ")}`);
      void loadOrders();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <MerchantLayout pageTitle="Orders" breadcrumbs={[{ label: "Orders" }]}>
      {loading ? (
        <LoadingSpinner label="Loading orders..." />
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              actions={
                <>
                  {statusActions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => void updateStatus(order._id, status)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
                    >
                      {status.replaceAll("_", " ")}
                    </button>
                  ))}
                </>
              }
            />
          ))}
          {!orders.length && (
            <div className="p-10 text-center bg-white border border-dashed border-gray-300 rounded-2xl text-gray-500">
              New client orders will appear here.
            </div>
          )}
        </div>
      )}
    </MerchantLayout>
  );
};

export default OrdersPage;
