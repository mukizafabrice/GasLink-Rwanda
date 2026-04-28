import React from "react";
import { Link } from "react-router-dom";
import ClientLayout from "@/components/client/ClientLayout";
import FilterSidebar from "@/components/shared/FilterSidebar";
import LocationSelector from "@/components/shared/LocationSelector";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { clientService } from "@/services/platform.service";
import type { MerchantShop } from "@/types";

const BrowseMerchantsPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState({
    province: "",
    district: "",
    sector: "",
  });
  const [merchants, setMerchants] = React.useState<MerchantShop[]>([]);

  const loadMerchants = React.useCallback(async () => {
    setLoading(true);
    const response = await clientService.browseMerchants({
      search: search || undefined,
      province: filters.province || undefined,
      district: filters.district || undefined,
      sector: filters.sector || undefined,
    });
    if (response.success && response.data) {
      setMerchants(response.data);
    }
    setLoading(false);
  }, [filters, search]);

  React.useEffect(() => {
    void loadMerchants();
  }, [loadMerchants]);

  return (
    <ClientLayout pageTitle="Browse Merchants" breadcrumbs={[{ label: "Marketplace" }]}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px,1fr]">
        <FilterSidebar title="Search area">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by merchant name" />
          <LocationSelector value={filters} onChange={(value) => setFilters((current) => ({ ...current, ...value }))} />
          <button onClick={() => void loadMerchants()} className="w-full px-4 py-3 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600">
            Apply filters
          </button>
        </FilterSidebar>

        {loading ? (
          <LoadingSpinner label="Loading merchants..." />
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {merchants.map((merchant) => {
              const ownerId = typeof merchant.owner === "string" ? merchant.owner : merchant.owner.id || (merchant.owner as any)._id;
              return (
                <div key={merchant._id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold tracking-wide text-orange-700 uppercase">
                        {merchant.verificationStatus}
                      </div>
                      <h2 className="mt-2 text-xl font-semibold text-gray-900">
                        {merchant.shopName}
                      </h2>
                      <p className="mt-2 text-sm text-gray-500">
                        {merchant.description || "Trusted LPG seller serving local households and businesses."}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {merchant.averageRating.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {merchant.totalReviews} reviews
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-gray-500">Location</div>
                      <div className="mt-1 font-medium text-gray-900">
                        {merchant.address.district}, {merchant.address.sector}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-gray-500">Delivery fee</div>
                      <div className="mt-1 font-medium text-gray-900">
                        {merchant.deliveryFee} RWF
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <Link to={`/client/shops/${ownerId}`} className="flex-1 px-4 py-3 font-semibold text-center text-white bg-orange-500 rounded-xl hover:bg-orange-600">
                      View shop
                    </Link>
                    <Link to="/client/saved" className="px-4 py-3 font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">
                      Saved list
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default BrowseMerchantsPage;
