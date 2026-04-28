import React from "react";
import toast from "react-hot-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { adminService } from "@/services/platform.service";
import { CylinderType, type ProductCatalogItem } from "@/types";

const defaultForm = {
  productName: "Kigali Gas",
  cylinderType: CylinderType.STANDARD,
  sizeKg: 3,
};

const GasCatalogPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [catalogItems, setCatalogItems] = React.useState<ProductCatalogItem[]>([]);
  const [editingItem, setEditingItem] = React.useState<ProductCatalogItem | null>(null);
  const [catalogForm, setCatalogForm] = React.useState(defaultForm);

  const loadCatalog = React.useCallback(async () => {
    setLoading(true);
    const response = await adminService.getProductCatalog();

    if (response.success && response.data) {
      setCatalogItems(response.data.entries);
    }

    setLoading(false);
  }, []);

  React.useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  React.useEffect(() => {
    if (!editingItem) {
      setCatalogForm(defaultForm);
      return;
    }

    setCatalogForm({
      productName: editingItem.productName,
      cylinderType: editingItem.cylinderType,
      sizeKg: editingItem.sizeKg,
    });
  }, [editingItem]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const response = editingItem
      ? await adminService.updateProductCatalogEntry(editingItem._id, catalogForm)
      : await adminService.createProductCatalogEntry(catalogForm);

    setSaving(false);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success(editingItem ? "Gas catalog entry updated" : "Gas catalog entry created");
    setEditingItem(null);
    setCatalogForm(defaultForm);
    await loadCatalog();
  };

  const toggleCatalogEntry = async (entry: ProductCatalogItem) => {
    const response = await adminService.updateProductCatalogEntry(entry._id, {
      isActive: !entry.isActive,
    });

    if (response.success) {
      toast.success(entry.isActive ? "Catalog entry disabled" : "Catalog entry activated");
      await loadCatalog();
      return;
    }

    toast.error(response.message);
  };

  const deleteCatalogEntry = async (entry: ProductCatalogItem) => {
    const response = await adminService.deleteProductCatalogEntry(entry._id);

    if (response.success) {
      toast.success("Catalog entry removed");
      if (editingItem?._id === entry._id) {
        setEditingItem(null);
        setCatalogForm(defaultForm);
      }
      await loadCatalog();
      return;
    }

    toast.error(response.message);
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading gas catalog..." />;
  }

  return (
    <AdminLayout
      pageTitle="Gas Catalog"
      breadcrumbs={[{ label: "Gas Catalog" }]}
    >
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px,1fr]">
        <form onSubmit={handleSubmit} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingItem ? "Edit gas option" : "Add gas option"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Administrators define every allowed gas product name, cylinder type, and size here.
            Merchants can only choose from this list and enter price per kilogram.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Product name
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                value={catalogForm.productName}
                onChange={(event) =>
                  setCatalogForm((current) => ({
                    ...current,
                    productName: event.target.value,
                  }))
                }
                placeholder="Example: Kigali Gas"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Cylinder type
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                value={catalogForm.cylinderType}
                onChange={(event) =>
                  setCatalogForm((current) => ({
                    ...current,
                    cylinderType: event.target.value as CylinderType,
                  }))
                }
              >
                <option value={CylinderType.STANDARD}>Standard</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Cylinder size
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                type="number"
                min="1"
                step="1"
                value={catalogForm.sizeKg}
                onChange={(event) =>
                  setCatalogForm((current) => ({
                    ...current,
                    sizeKg: Number(event.target.value),
                  }))
                }
                placeholder="Example: 3"
                required
              />
            </div>

            <div className="p-4 text-sm border border-orange-200 rounded-xl bg-orange-50 text-orange-900">
              Example workflow: create brands like Kigali Gas or Meru Gas, then define each
              cylinder size that merchants are allowed to stock.
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-5 py-3 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 disabled:opacity-60"
              >
                {saving ? "Saving..." : editingItem ? "Update option" : "Add option"}
              </button>
              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setCatalogForm(defaultForm);
                  }}
                  className="px-5 py-3 font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Approved gas options</h2>
            <p className="mt-2 text-sm text-gray-500">
              These are the only gas brands and cylinder sizes merchants can select in inventory.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="space-y-4">
              {catalogItems.map((entry) => (
                <div key={entry._id} className="p-4 border border-gray-200 rounded-2xl">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{entry.productName}</div>
                      <div className="mt-1 text-sm text-gray-500">
                        {entry.cylinderType.replaceAll("_", " ")} • {entry.sizeKg} kg
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          entry.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-200 text-gray-700"
                        }`}>
                          {entry.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingItem(entry)}
                        className="px-4 py-2 text-sm font-semibold text-orange-700 bg-orange-100 rounded-xl hover:bg-orange-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void toggleCatalogEntry(entry)}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
                      >
                        {entry.isActive ? "Disable" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteCatalogEntry(entry)}
                        className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-xl hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!catalogItems.length && (
                <p className="text-sm text-gray-500">
                  No gas catalog entries yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GasCatalogPage;
