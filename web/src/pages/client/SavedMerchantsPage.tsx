import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ClientLayout from "@/components/client/ClientLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { clientService } from "@/services/platform.service";
import type { MerchantShop } from "@/types";

const SavedMerchantsPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [merchants, setMerchants] = React.useState<MerchantShop[]>([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    const response = await clientService.getSavedMerchants();
    if (response.success && response.data) {
      setMerchants(response.data);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const removeMerchant = async (merchantId: string) => {
    const response = await clientService.removeSavedMerchant(merchantId);
    if (response.success) {
      toast.success("Removed from saved merchants");
      void load();
    }
  };

  return (
    <ClientLayout pageTitle="Saved Merchants" breadcrumbs={[{ label: "Saved" }]}>
      {loading ? (
        <LoadingSpinner label="Loading saved merchants..." />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {merchants.map((merchant) => {
            const ownerId = typeof merchant.owner === "string" ? merchant.owner : merchant.owner.id || (merchant.owner as any)._id;
            return (
              <div key={merchant._id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">{merchant.shopName}</h2>
                <p className="mt-2 text-sm text-gray-500">{merchant.address.district}, {merchant.address.sector}</p>
                <div className="flex gap-3 mt-5">
                  <Link to={`/client/shops/${ownerId}`} className="flex-1 px-4 py-3 font-semibold text-center text-white bg-orange-500 rounded-xl hover:bg-orange-600">
                    Visit shop
                  </Link>
                  <button onClick={() => void removeMerchant(ownerId)} className="px-4 py-3 font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          {!merchants.length && (
            <div className="p-10 text-center bg-white border border-dashed border-gray-300 rounded-2xl text-gray-500 xl:col-span-2">
              You have not saved any merchants yet.
            </div>
          )}
        </div>
      )}
    </ClientLayout>
  );
};

export default SavedMerchantsPage;
