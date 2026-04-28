import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search",
}) => {
  return (
    <div className="relative">
      <Search className="absolute w-4 h-4 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full py-2.5 pl-10 pr-10 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute text-gray-400 right-3 top-1/2 -translate-y-1/2 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
