import React from "react";

interface FilterSidebarProps {
  title?: string;
  children: React.ReactNode;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  title = "Filters",
  children,
}) => {
  return (
    <aside className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">
          Refine what you want to see.
        </p>
      </div>
      <div className="space-y-4">{children}</div>
    </aside>
  );
};

export default FilterSidebar;
