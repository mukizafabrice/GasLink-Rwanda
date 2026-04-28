import React from "react";
import toast from "react-hot-toast";
import MerchantLayout from "@/components/layouts/MerchantLayout";
import LocationSelector from "@/components/shared/LocationSelector";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { merchantService } from "@/services/platform.service";
import type { MerchantShop } from "@/types";

const ShopSettingsPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [shop, setShop] = React.useState<MerchantShop | null>(null);

  React.useEffect(() => {
    const load = async () => {
      const response = await merchantService.getShop();
      if (response.success && response.data) {
        setShop(response.data);
      }
      setLoading(false);
    };

    void load();
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!shop) return;

    const response = await merchantService.updateShop(shop);
    if (response.success && response.data) {
      setShop(response.data);
      toast.success("Shop settings updated");
    } else {
      toast.error(response.message);
    }
  };

  if (loading || !shop) {
    return <LoadingSpinner fullScreen label="Loading shop settings..." />;
  }

  return (
    <MerchantLayout
      pageTitle="Shop Settings"
      breadcrumbs={[{ label: "Shop Settings" }]}
    >
      <form onSubmit={save} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input className="px-4 py-3 border border-gray-200 rounded-xl" value={shop.shopName} onChange={(e) => setShop((current) => current ? { ...current, shopName: e.target.value } : current)} placeholder="Shop name" />
          <input className="px-4 py-3 border border-gray-200 rounded-xl" value={shop.businessPhone} onChange={(e) => setShop((current) => current ? { ...current, businessPhone: e.target.value } : current)} placeholder="Business phone" />
          <input className="px-4 py-3 border border-gray-200 rounded-xl md:col-span-2" value={shop.businessEmail || ""} onChange={(e) => setShop((current) => current ? { ...current, businessEmail: e.target.value } : current)} placeholder="Business email" />
          <textarea className="px-4 py-3 border border-gray-200 rounded-xl md:col-span-2" rows={4} value={shop.description || ""} onChange={(e) => setShop((current) => current ? { ...current, description: e.target.value } : current)} placeholder="Shop description" />
        </div>

        <div className="mt-6">
          <LocationSelector
            value={shop.address}
            includeOptional
            onChange={(nextAddress) =>
              setShop((current) =>
                current
                  ? { ...current, address: { ...current.address, ...nextAddress } }
                  : current
              )
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
          <input className="px-4 py-3 border border-gray-200 rounded-xl" type="number" value={shop.deliveryFee} onChange={(e) => setShop((current) => current ? { ...current, deliveryFee: Number(e.target.value) } : current)} placeholder="Delivery fee" />
          <input className="px-4 py-3 border border-gray-200 rounded-xl" type="number" value={shop.minimumOrderAmount} onChange={(e) => setShop((current) => current ? { ...current, minimumOrderAmount: Number(e.target.value) } : current)} placeholder="Minimum order amount" />
          <label className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl">
            <input type="checkbox" checked={shop.isOpen} onChange={(e) => setShop((current) => current ? { ...current, isOpen: e.target.checked } : current)} />
            Open for orders
          </label>
        </div>

        <button type="submit" className="px-5 py-3 mt-6 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600">
          Save settings
        </button>
      </form>
    </MerchantLayout>
  );
};

export default ShopSettingsPage;
