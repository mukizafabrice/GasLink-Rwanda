import React from "react";
import MerchantLayout from "@/components/layouts/MerchantLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { merchantService } from "@/services/platform.service";
import { formatCurrency } from "@/utils/format";

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [analytics, setAnalytics] = React.useState<any>(null);

  React.useEffect(() => {
    const load = async () => {
      const response = await merchantService.getAnalytics();
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
      setLoading(false);
    };

    void load();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading analytics..." />;
  }

  return (
    <MerchantLayout
      pageTitle="Analytics"
      breadcrumbs={[{ label: "Analytics" }]}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">Revenue by month</h2>
          <div className="mt-6 space-y-4">
            {(analytics?.monthlySales || []).map((entry: any) => (
              <div key={`${entry._id.year}-${entry._id.month}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {entry._id.month}/{entry._id.year}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(entry.revenue)}
                  </span>
                </div>
                <div className="w-full h-3 mt-2 bg-gray-100 rounded-full">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                    style={{ width: `${Math.min(100, entry.revenue / 1000)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Order status</h2>
            <div className="mt-4 space-y-3">
              {(analytics?.salesByStatus || []).map((entry: any) => (
                <div key={entry._id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{entry._id}</span>
                  <span className="font-semibold text-gray-900">{entry.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Product mix</h2>
            <div className="mt-4 space-y-3">
              {(analytics?.productMix || []).map((entry: any) => (
                <div key={entry._id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{entry._id}</span>
                  <span className="font-semibold text-gray-900">{entry.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default AnalyticsPage;
