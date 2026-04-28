import React from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ClientLayout from "@/components/client/ClientLayout";
import ProductCard from "@/components/shared/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { clientService } from "@/services/platform.service";
import type { MerchantShop, Product, Review } from "@/types";

const ShopPage: React.FC = () => {
  const { merchantId = "" } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [shop, setShop] = React.useState<MerchantShop | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const response = await clientService.getMerchantStorefront(merchantId);
      if (response.success && response.data) {
        setShop(response.data.shop);
        setProducts(response.data.products);
        setReviews(response.data.reviews);
      }
      setLoading(false);
    };

    void load();
  }, [merchantId]);

  const saveMerchant = async () => {
    const response = await clientService.saveMerchant(merchantId);
    if (response.success) {
      toast.success("Merchant added to saved list");
    }
  };

  if (loading || !shop) {
    return <LoadingSpinner fullScreen label="Loading merchant shop..." />;
  }

  return (
    <ClientLayout
      pageTitle={shop.shopName}
      breadcrumbs={[{ label: "Marketplace", path: "/client/browse" }, { label: shop.shopName }]}
    >
      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex px-3 py-1 text-xs font-semibold tracking-wide text-orange-700 uppercase bg-orange-100 rounded-full">
              {shop.verificationStatus}
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">{shop.shopName}</h2>
            <p className="mt-3 text-gray-600">{shop.description}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => void saveMerchant()} className="px-4 py-3 font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">
              Save merchant
            </button>
            <Link to={`/client/orders/new/${merchantId}`} className="px-4 py-3 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600">
              Place order
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-[1.6fr,1fr]">
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">Products</h3>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Shop details</h3>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div>{shop.address.province}</div>
              <div>{shop.address.district}, {shop.address.sector}</div>
              <div>Delivery fee: {shop.deliveryFee} RWF</div>
              <div>Minimum order: {shop.minimumOrderAmount} RWF</div>
            </div>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Recent reviews</h3>
            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="font-medium text-gray-900">{review.rating}/5</div>
                  <p className="mt-1 text-sm text-gray-600">{review.comment || "No written comment."}</p>
                </div>
              ))}
              {!reviews.length && <p className="text-sm text-gray-500">No reviews yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ShopPage;
