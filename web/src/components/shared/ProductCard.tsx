import React from "react";
import { Package, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  tertiaryActionLabel?: string;
  onTertiaryAction?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  tertiaryActionLabel,
  onTertiaryAction,
}) => {
  const lowStock = product.currentStock <= product.minStockLevel;
  const displayCylinderType = product.cylinderType
    ? product.cylinderType.replaceAll("_", " ")
    : "Standard";
  const displayName = product.productName || product.name || "Gas product";
  const displaySize = typeof product.sizeKg === "number" ? `${product.sizeKg} kg` : product.unit || "cylinder";
  const computedPricePerKg =
    typeof product.pricePerKg === "number"
      ? product.pricePerKg
      : typeof product.sizeKg === "number" && product.sizeKg > 0
        ? product.price / product.sizeKg
        : null;

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wide text-orange-700 uppercase bg-orange-100 rounded-full">
            <Package className="w-3.5 h-3.5" />
            {displayCylinderType} {displaySize}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {displayName}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Gas only. This brand and size are managed by the admin gas catalog.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </div>
          <div className="text-xs text-gray-500">
            {computedPricePerKg !== null ? `${formatCurrency(computedPricePerKg)} per kg` : "Per-cylinder pricing"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 text-sm">
        <div className="text-gray-600">
          Cylinders in stock:{" "}
          <span className={lowStock ? "font-semibold text-rose-600" : "font-semibold text-emerald-600"}>
            {product.currentStock}
          </span>
        </div>
        <div className="text-gray-500">
          Min: <span className="font-medium text-gray-700">{product.minStockLevel}</span>
        </div>
      </div>

      {(actionLabel || secondaryActionLabel || tertiaryActionLabel) && (
        <div className="flex gap-3 mt-5">
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-rose-700 bg-rose-100 rounded-xl hover:bg-rose-200"
            >
              {secondaryActionLabel}
            </button>
          )}
          {tertiaryActionLabel && (
            <button
              type="button"
              onClick={onTertiaryAction}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              {tertiaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
