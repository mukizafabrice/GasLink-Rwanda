import React from "react";
import toast from "react-hot-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { adminService } from "@/services/platform.service";
import { VerificationStatus, type MerchantShop } from "@/types";

const MerchantVerificationPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [shops, setShops] = React.useState<MerchantShop[]>([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    const response = await adminService.getMerchantVerifications();
    if (response.success && response.data) {
      setShops(response.data);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (shopId: string, verificationStatus: VerificationStatus) => {
    const response = await adminService.updateMerchantVerification(shopId, { verificationStatus });
    if (response.success) {
      toast.success("Verification updated");
      void load();
    }
  };

  return (
    <AdminLayout
      pageTitle="Merchant Verification"
      breadcrumbs={[{ label: "Merchant Verification" }]}
    >
      {loading ? (
        <LoadingSpinner label="Loading merchant verifications..." />
      ) : (
        <div className="space-y-5">
          {shops.map((shop) => (
            <div key={shop._id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs font-semibold tracking-wide text-orange-700 uppercase">
                    {shop.verificationStatus}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900">{shop.shopName}</h2>
                  <p className="mt-2 text-sm text-gray-500">{shop.description}</p>
                  <div className="mt-3 text-sm text-gray-600">
                    {shop.address.province}, {shop.address.district}, {shop.address.sector}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => void updateStatus(shop._id, VerificationStatus.APPROVED)} className="px-4 py-2.5 font-semibold text-emerald-700 bg-emerald-100 rounded-xl hover:bg-emerald-200">
                    Approve
                  </button>
                  <button onClick={() => void updateStatus(shop._id, VerificationStatus.REJECTED)} className="px-4 py-2.5 font-semibold text-rose-700 bg-rose-100 rounded-xl hover:bg-rose-200">
                    Reject
                  </button>
                  <button onClick={() => void updateStatus(shop._id, VerificationStatus.PENDING)} className="px-4 py-2.5 font-semibold text-amber-700 bg-amber-100 rounded-xl hover:bg-amber-200">
                    Mark pending
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default MerchantVerificationPage;
