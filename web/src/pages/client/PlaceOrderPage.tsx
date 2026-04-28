import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ClientLayout from "@/components/client/ClientLayout";
import LocationSelector from "@/components/shared/LocationSelector";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { clientService } from "@/services/platform.service";
import type { LocationAddress, Product } from "@/types";
import { formatCurrency } from "@/utils/format";

const PlaceOrderPage: React.FC = () => {
  const { merchantId = "" } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});
  const [deliveryAddress, setDeliveryAddress] = React.useState<Partial<LocationAddress>>({
    province: "",
    district: "",
    sector: "",
  });
  const [clientNote, setClientNote] = React.useState("");

  React.useEffect(() => {
    const load = async () => {
      const response = await clientService.getMerchantStorefront(merchantId);
      if (response.success && response.data) {
        setProducts(response.data.products);
      }
      setLoading(false);
    };

    void load();
  }, [merchantId]);

  const total = products.reduce(
    (sum, product) => sum + product.price * (quantities[product._id] || 0),
    0
  );

  const submitOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    const items = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    if (!items.length) {
      toast.error("Select at least one item");
      return;
    }

    const response = await clientService.placeOrder({
      merchantId,
      items,
      deliveryAddress: deliveryAddress as LocationAddress,
      clientNote,
    });

    if (response.success) {
      toast.success("Order placed successfully");
      navigate("/client/orders/history");
    } else {
      toast.error(response.message);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading ordering form..." />;
  }

  return (
    <ClientLayout
      pageTitle="Place Order"
      breadcrumbs={[
        { label: "Marketplace", path: "/client/browse" },
        { label: "Order" },
      ]}
    >
      <form onSubmit={submitOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr,420px]">
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Choose products</h2>
          <div className="mt-6 space-y-4">
            {products.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl">
                <div>
                  <div className="font-semibold text-gray-900">{product.productName || product.name}</div>
                  <div className="text-sm text-gray-500">
                    {typeof product.sizeKg === "number" ? `${product.sizeKg} kg` : product.unit}
                    {" • "}
                    {formatCurrency(product.price)} per {product.unit || "item"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatCurrency(
                      typeof product.pricePerKg === "number" && product.pricePerKg > 0
                        ? product.pricePerKg
                        : typeof product.sizeKg === "number" && product.sizeKg > 0
                          ? product.price / product.sizeKg
                          : product.price
                    )}{" "}
                    {typeof product.sizeKg === "number" ? "per kg" : "per item"}
                  </div>
                </div>
                <input
                  type="number"
                  min={0}
                  max={product.currentStock}
                  value={quantities[product._id] || 0}
                  onChange={(event) =>
                    setQuantities((current) => ({
                      ...current,
                      [product._id]: Number(event.target.value),
                    }))
                  }
                  className="w-24 px-4 py-2 text-center border border-gray-200 rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Delivery address</h2>
            <div className="mt-5">
              <LocationSelector
                value={deliveryAddress}
                includeOptional
                onChange={(value) => setDeliveryAddress((current) => ({ ...current, ...value }))}
              />
            </div>
            <textarea
              className="w-full px-4 py-3 mt-5 border border-gray-200 rounded-xl"
              rows={4}
              placeholder="Delivery notes"
              value={clientNote}
              onChange={(event) => setClientNote(event.target.value)}
            />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Order total</span>
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
            </div>
            <button type="submit" className="w-full px-4 py-3 mt-5 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600">
              Submit order
            </button>
          </div>
        </div>
      </form>
    </ClientLayout>
  );
};

export default PlaceOrderPage;
