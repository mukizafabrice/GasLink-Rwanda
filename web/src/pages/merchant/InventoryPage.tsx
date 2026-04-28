import React from "react";
import toast from "react-hot-toast";
import MerchantLayout from "@/components/layouts/MerchantLayout";
import ProductCard from "@/components/shared/ProductCard";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { merchantService, productService } from "@/services/platform.service";
import {
  StockMovementType,
  type Product,
  type ProductCatalogItem,
} from "@/types";
import { formatCurrency } from "@/utils/format";

const defaultForm = {
  cylinderType: "",
  productName: "",
  sizeKg: "",
  pricePerKg: 0,
  stockQuantity: 0,
};

const InventoryPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [catalogItems, setCatalogItems] = React.useState<ProductCatalogItem[]>([]);
  const [form, setForm] = React.useState(defaultForm);
  const [movementType, setMovementType] = React.useState<StockMovementType>(
    StockMovementType.STOCK_IN
  );

  const loadInventory = React.useCallback(async () => {
    setLoading(true);
    const [inventoryResponse, catalogResponse] = await Promise.all([
      merchantService.getInventory(search ? { search } : undefined),
      productService.listCatalog(true),
    ]);

    if (inventoryResponse.success && inventoryResponse.data) {
      setProducts(inventoryResponse.data);
    }

    if (catalogResponse.success && catalogResponse.data) {
      setCatalogItems(catalogResponse.data);
    }

    setLoading(false);
  }, [search]);

  React.useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const filteredByCylinderType = catalogItems.filter(
    (item) => !form.cylinderType || item.cylinderType === form.cylinderType
  );

  const availableProductNames = Array.from(
    new Set(filteredByCylinderType.map((item) => item.productName))
  );

  const availableSizes = filteredByCylinderType.filter(
    (item) => !form.productName || item.productName === form.productName
  );

  const selectedCatalogItem = catalogItems.find(
    (item) =>
      item.cylinderType === form.cylinderType &&
      item.productName === form.productName &&
      String(item.sizeKg) === form.sizeKg
  );

  const selectedInventoryProduct = selectedCatalogItem
    ? products.find((product) => {
        const catalogItemId =
          typeof product.catalogItem === "string"
            ? product.catalogItem
            : product.catalogItem?._id;

        return catalogItemId === selectedCatalogItem._id;
      })
    : null;

  const prefillInventoryForm = (
    product: Product,
    nextMovementType: StockMovementType = StockMovementType.STOCK_IN
  ) => {
    setMovementType(nextMovementType);
    setForm({
      cylinderType: product.cylinderType || "",
      productName: product.productName || product.name || "",
      sizeKg: product.sizeKg !== undefined ? String(product.sizeKg) : "",
      pricePerKg:
        typeof product.pricePerKg === "number"
          ? product.pricePerKg
          : typeof product.sizeKg === "number" && product.sizeKg > 0
            ? Number((product.price / product.sizeKg).toFixed(2))
            : 0,
      stockQuantity: 0,
    });
  };

  const selectNewInventoryFlow = () => {
    setMovementType(StockMovementType.STOCK_IN);
    setForm(defaultForm);
  };

  const handleRestock = (product: Product) => {
    prefillInventoryForm(product, StockMovementType.STOCK_IN);
  };

  const handleStockOut = (product: Product) => {
    prefillInventoryForm(product, StockMovementType.STOCK_OUT);
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    const quantity = Number(form.stockQuantity);

    if (!selectedCatalogItem) {
      toast.error("Select an admin-approved gas product and cylinder size");
      return;
    }

    if (quantity < 1) {
      toast.error("Enter at least 1 cylinder");
      return;
    }

    if (movementType === StockMovementType.STOCK_OUT && !selectedInventoryProduct) {
      toast.error("Choose an existing inventory item before recording stock-out");
      return;
    }

    if (
      movementType === StockMovementType.STOCK_OUT &&
      selectedInventoryProduct &&
      quantity > selectedInventoryProduct.currentStock
    ) {
      toast.error(`Only ${selectedInventoryProduct.currentStock} cylinders are currently in stock`);
      return;
    }

    setSaving(true);

    const response = selectedInventoryProduct
      ? await productService.adjustStock(selectedInventoryProduct._id, {
          movementType,
          quantity,
          pricePerKg: Number(form.pricePerKg),
        })
      : await productService.create({
          catalogItemId: selectedCatalogItem._id,
          pricePerKg: Number(form.pricePerKg),
          stockQuantity: quantity,
        });

    setSaving(false);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    const currentStock = selectedInventoryProduct?.currentStock || 0;
    const newStockLevel =
      movementType === StockMovementType.STOCK_OUT
        ? currentStock - quantity
        : currentStock + quantity;

    toast.success(
      movementType === StockMovementType.STOCK_OUT
        ? `Stock-out recorded. ${newStockLevel} cylinders now remain in stock.`
        : selectedInventoryProduct
          ? `Inventory updated. ${newStockLevel} cylinders now in stock.`
          : "Inventory line created successfully"
    );

    if (selectedInventoryProduct) {
      setForm((current) => ({
        ...current,
        stockQuantity: 0,
      }));
    } else {
      selectNewInventoryFlow();
    }

    void loadInventory();
  };

  const handleDelete = async (productId: string) => {
    const response = await productService.remove(productId);
    if (response.success) {
      toast.success("Inventory item deleted");
      void loadInventory();
      return;
    }

    toast.error(response.message);
  };

  const isStockOut = movementType === StockMovementType.STOCK_OUT;
  const projectedStock = selectedInventoryProduct
    ? isStockOut
      ? selectedInventoryProduct.currentStock - Number(form.stockQuantity || 0)
      : selectedInventoryProduct.currentStock + Number(form.stockQuantity || 0)
    : Number(form.stockQuantity || 0);

  const submitButtonLabel = isStockOut
    ? "Record stock-out sale"
    : selectedInventoryProduct
      ? "Add cylinders to stock"
      : "Create inventory item";

  const movementLabel = isStockOut
    ? "Number of cylinders sold out"
    : "Number of cylinders to add";

  const movementHelpText = isStockOut
    ? "Enter how many cylinders are leaving stock because of direct shop sales."
    : "Enter how many cylinders you are adding to this inventory item.";

  return (
    <MerchantLayout pageTitle="Inventory" breadcrumbs={[{ label: "Inventory" }]}>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px,1fr]">
        <form
          onSubmit={submitForm}
          className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isStockOut ? "Record stock-out" : "Add or restock inventory"}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {isStockOut
                  ? "Reduce cylinder stock for direct walk-in sales without creating a delivery order."
                  : "Choose a gas brand and size from the admin catalog, set your shop price per kilogram, and add the number of cylinders you are putting into stock."}
              </p>
            </div>
            <button
              type="button"
              onClick={selectNewInventoryFlow}
              className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-xl hover:bg-orange-200"
            >
              New stock-in
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Inventory action
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                value={movementType}
                onChange={(event) => setMovementType(event.target.value as StockMovementType)}
              >
                <option value={StockMovementType.STOCK_IN}>Stock in / restock</option>
                <option value={StockMovementType.STOCK_OUT}>Stock out / direct sale</option>
              </select>
              <p className="mt-2 text-xs text-gray-500">
                {isStockOut
                  ? "Use this when gas is sold directly in the shop and cylinder stock must go down."
                  : "Use this to add new cylinders into stock or restock an existing gas item."}
              </p>
            </div>

            <select
              className="px-4 py-3 border border-gray-200 rounded-xl"
              value={form.cylinderType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  cylinderType: event.target.value,
                  productName: "",
                  sizeKg: "",
                }))
              }
              required
            >
              <option value="">Select cylinder type</option>
              {Array.from(new Set(catalogItems.map((item) => item.cylinderType))).map((cylinderType) => (
                <option key={cylinderType} value={cylinderType}>
                  {cylinderType.replaceAll("_", " ")}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-3 border border-gray-200 rounded-xl"
              value={form.productName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  productName: event.target.value,
                  sizeKg: "",
                }))
              }
              required
            >
              <option value="">Select product name</option>
              {availableProductNames.map((productName) => (
                <option key={productName} value={productName}>
                  {productName}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-3 border border-gray-200 rounded-xl"
              value={form.sizeKg}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sizeKg: event.target.value,
                }))
              }
              required
            >
              <option value="">Select cylinder size</option>
              {availableSizes.map((item) => (
                <option key={item._id} value={item.sizeKg}>
                  {item.sizeKg} kg
                </option>
              ))}
            </select>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Price per kilogram (RWF)
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                placeholder="Example: 2000"
                type="number"
                min="0"
                step="0.01"
                value={form.pricePerKg}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    pricePerKg: Number(event.target.value),
                  }))
                }
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                This is your selling price for 1 kg of this gas brand.
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {movementLabel}
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                placeholder={isStockOut ? "Example: 5" : "Example: 50"}
                type="number"
                min="0"
                step="1"
                value={form.stockQuantity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    stockQuantity: Number(event.target.value),
                  }))
                }
                required
              />
              <p className="mt-2 text-xs text-gray-500">{movementHelpText}</p>
            </div>

            {selectedCatalogItem && (
              <div className="p-4 text-sm text-gray-600 border border-orange-200 rounded-xl bg-orange-50">
                <div>
                  Cylinder value:
                  <span className="ml-2 font-semibold text-gray-900">
                    {(Number(form.pricePerKg) * Number(selectedCatalogItem.sizeKg)).toFixed(2)} RWF
                  </span>
                </div>
                {selectedInventoryProduct ? (
                  <div className="mt-2">
                    Current stock:
                    <span className="ml-2 font-semibold text-gray-900">
                      {selectedInventoryProduct.currentStock} cylinders
                    </span>
                    <span className="ml-2 text-gray-500">
                      {" -> "}{isStockOut ? "After stock-out" : "After restock"}:{" "}
                      {Math.max(projectedStock, 0)} cylinders
                    </span>
                  </div>
                ) : isStockOut ? (
                  <div className="mt-2 text-rose-600">
                    You can only record stock-out for a product that already exists in your inventory.
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500">
                    This brand and size will be added to your inventory as a new item.
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-3 font-semibold text-white rounded-xl ${
                isStockOut
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {saving ? "Saving..." : submitButtonLabel}
            </button>
          </div>
        </form>

        <div>
          <div className="flex items-center justify-between gap-4 mb-5">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search inventory"
            />
            <button
              onClick={() => void loadInventory()}
              className="px-4 py-2.5 font-medium text-orange-700 bg-orange-100 rounded-xl hover:bg-orange-200"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading inventory..." />
          ) : (
            <div className="space-y-6">
              <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Product list and price per kg
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Every gas item in your shop with its current cylinder stock and selling price per kilogram.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                          Product name
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                          Size
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                          Price per kg
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                          Cylinders
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {products.map((product) => {
                        const pricePerKg =
                          typeof product.pricePerKg === "number" && product.pricePerKg > 0
                            ? product.pricePerKg
                            : typeof product.sizeKg === "number" && product.sizeKg > 0
                              ? product.price / product.sizeKg
                              : product.price;

                        return (
                          <tr key={`row-${product._id}`}>
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {product.productName || product.name}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {typeof product.sizeKg === "number" ? `${product.sizeKg} kg` : product.unit}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {formatCurrency(pricePerKg)}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {product.currentStock}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleRestock(product)}
                                  className="px-4 py-2 text-sm font-semibold text-orange-700 bg-orange-100 rounded-xl hover:bg-orange-200"
                                >
                                  Restock
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStockOut(product)}
                                  className="px-4 py-2 text-sm font-semibold rounded-xl text-rose-700 bg-rose-100 hover:bg-rose-200"
                                >
                                  Stock out
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleDelete(product._id)}
                                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {!products.length && (
                        <tr>
                          <td colSpan={5} className="px-6 py-6 text-sm text-center text-gray-500">
                            No products in inventory yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    actionLabel="Restock"
                    onAction={() => handleRestock(product)}
                    secondaryActionLabel="Stock out"
                    onSecondaryAction={() => handleStockOut(product)}
                    tertiaryActionLabel="Delete"
                    onTertiaryAction={() => void handleDelete(product._id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MerchantLayout>
  );
};

export default InventoryPage;
