import React from "react";
import {
  DISTRICTS_BY_PROVINCE,
  RWANDA_PROVINCES,
  SECTORS_BY_DISTRICT,
} from "@/constants/provinces";
import type { LocationAddress } from "@/types";

interface LocationSelectorProps {
  value: Partial<LocationAddress>;
  onChange: (nextValue: Partial<LocationAddress>) => void;
  includeOptional?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  includeOptional = false,
}) => {
  const districts = value.province
    ? DISTRICTS_BY_PROVINCE[value.province] ?? []
    : [];
  const sectors = value.district
    ? SECTORS_BY_DISTRICT[value.district] ?? []
    : [];

  const updateField = (field: keyof LocationAddress, fieldValue: string) => {
    const nextValue: Partial<LocationAddress> = {
      ...value,
      [field]: fieldValue,
    };

    if (field === "province") {
      nextValue.district = "";
      nextValue.sector = "";
    }

    if (field === "district") {
      nextValue.sector = "";
    }

    onChange(nextValue);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <label className="text-sm text-gray-700">
        <span className="block mb-2 font-medium">Province</span>
        <select
          value={value.province || ""}
          onChange={(event) => updateField("province", event.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select province</option>
          {RWANDA_PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-gray-700">
        <span className="block mb-2 font-medium">District</span>
        <select
          value={value.district || ""}
          onChange={(event) => updateField("district", event.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={!value.province}
        >
          <option value="">Select district</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-gray-700">
        <span className="block mb-2 font-medium">Sector</span>
        <select
          value={value.sector || ""}
          onChange={(event) => updateField("sector", event.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={!value.district}
        >
          <option value="">Select sector</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </label>

      {includeOptional && (
        <>
          <label className="text-sm text-gray-700">
            <span className="block mb-2 font-medium">Cell</span>
            <input
              value={value.cell || ""}
              onChange={(event) => updateField("cell", event.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Cell"
            />
          </label>
          <label className="text-sm text-gray-700">
            <span className="block mb-2 font-medium">Village</span>
            <input
              value={value.village || ""}
              onChange={(event) => updateField("village", event.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Village"
            />
          </label>
          <label className="text-sm text-gray-700 md:col-span-3">
            <span className="block mb-2 font-medium">Street Address</span>
            <input
              value={value.streetAddress || ""}
              onChange={(event) =>
                updateField("streetAddress", event.target.value)
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Street address"
            />
          </label>
        </>
      )}
    </div>
  );
};

export default LocationSelector;
