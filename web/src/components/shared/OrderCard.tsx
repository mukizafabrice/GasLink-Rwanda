import React from "react";
import type { Order, OrderStatus } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";

const statusClasses: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-rose-100 text-rose-800",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-gray-200 text-gray-800",
};

interface OrderCardProps {
  order: Order;
  actions?: React.ReactNode;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, actions }) => {
  return (
    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {order.orderNumber}
            </h3>
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[order.status]}`}
            >
              {order.status.replaceAll("_", " ")}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(order.createdAt)} • {order.items.length} item(s)
          </p>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            {order.items.map((item) => (
              <div key={item._id}>
                {item.productName} x {item.quantity}
              </div>
            ))}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(order.totalAmount)}
          </div>
          <div className="text-sm text-gray-500">
            {order.deliveryAddress.district}, {order.deliveryAddress.sector}
          </div>
        </div>
      </div>

      {actions && <div className="flex flex-wrap gap-3 mt-5">{actions}</div>}
    </div>
  );
};

export default OrderCard;
