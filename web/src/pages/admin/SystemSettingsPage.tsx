import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { adminService } from "@/services/platform.service";

const SystemSettingsPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [settings, setSettings] = React.useState<Record<string, any>>({});

  const load = React.useCallback(async () => {
    const settingsResponse = await adminService.getSettings();

    if (settingsResponse.success && settingsResponse.data) {
      setSettings(settingsResponse.data);
    }

    setLoading(false);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await adminService.updateSettings(settings);
    if (response.success) {
      toast.success("Settings updated");
      return;
    }

    toast.error(response.message);
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading system settings..." />;
  }

  return (
    <AdminLayout pageTitle="System Settings" breadcrumbs={[{ label: "System Settings" }]}>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr,0.9fr]">
        <form onSubmit={save} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="space-y-5">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl">
              <div>
                <div className="font-semibold text-gray-900">Maintenance mode</div>
                <div className="text-sm text-gray-500">Temporarily pause platform activity.</div>
              </div>
              <input
                type="checkbox"
                checked={!!settings.maintenanceMode}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    maintenanceMode: event.target.checked,
                  }))
                }
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl">
              <div>
                <div className="font-semibold text-gray-900">Open registration</div>
                <div className="text-sm text-gray-500">Allow new merchants and clients to onboard.</div>
              </div>
              <input
                type="checkbox"
                checked={!!settings.registrationOpen}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    registrationOpen: event.target.checked,
                  }))
                }
              />
            </label>

            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              value={settings.supportEmail || ""}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  supportEmail: event.target.value,
                }))
              }
              placeholder="Support email"
            />
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              type="number"
              value={settings.maxFeaturedMerchants || 0}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  maxFeaturedMerchants: Number(event.target.value),
                }))
              }
              placeholder="Max featured merchants"
            />

            <button type="submit" className="px-5 py-3 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600">
              Save settings
            </button>
          </div>
        </form>

        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Gas inventory setup</h2>
          <p className="mt-2 text-sm text-gray-500">
            Product names and cylinder sizes are managed on the dedicated gas catalog page.
            Merchants use that catalog when adding stock to their shops.
          </p>

          <div className="p-4 mt-5 text-sm border border-orange-200 rounded-xl bg-orange-50 text-orange-900">
            Workflow:
            Admin creates the gas brand and size.
            Merchant selects that brand and size, sets price per kilogram, and adds the number of cylinders in stock.
          </div>

          <Link
            to="/admin/gas-catalog"
            className="inline-flex items-center justify-center px-5 py-3 mt-5 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600"
          >
            Open gas catalog
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemSettingsPage;
