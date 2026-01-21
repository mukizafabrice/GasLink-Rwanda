import React, { useState, useRef, useEffect } from "react";
import { LucideIcon } from "lucide-react";

interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  success?: boolean;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  icon: Icon,
  error,
  success,
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current?.value) {
      setHasValue(true);
    }
  }, []);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="relative w-full">
      <div
        className={`
          relative border-2 rounded-xl transition-all duration-300
          ${
            error
              ? "border-red-500"
              : success
              ? "border-green-500"
              : isFocused
              ? "border-primary-500 border-opacity-100"
              : "border-gray-300 border-opacity-50"
          }
          ${isFocused ? "ring-2 ring-primary-500 ring-opacity-20" : ""}
          overflow-hidden
        `}
      >
        {/* Background gradient effect */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-primary-50 to-transparent
          transition-transform duration-500
          ${isFocused ? "translate-x-0" : "-translate-x-full"}
        `}
        />

        <div className="relative flex items-center">
          {Icon && (
            <div
              className={`
              pl-4 pr-3 transition-colors duration-300
              ${
                error
                  ? "text-red-500"
                  : success
                  ? "text-green-500"
                  : isFocused
                  ? "text-primary-500"
                  : "text-gray-400"
              }
            `}
            >
              <Icon size={20} />
            </div>
          )}

          <div className="relative flex-1">
            <label
              className={`
                absolute left-0 transition-all duration-300 cursor-text
                ${
                  isFocused || hasValue
                    ? "top-1 text-sm text-primary-600"
                    : "top-4 text-base text-gray-500"
                }
                ${Icon ? "pl-0" : "pl-4"}
              `}
              onClick={() => inputRef.current?.focus()}
            >
              {label}
            </label>

            <input
              ref={inputRef}
              {...props}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              className={`
                w-full pt-6 pb-2 bg-transparent outline-none
                text-gray-900 placeholder-transparent
                ${Icon ? "pr-4" : "px-4"}
                ${className}
              `}
            />
          </div>
        </div>
      </div>

      {/* Error message with animation */}
      {error && (
        <div className="flex items-center mt-2 ml-1 space-x-2 animate-slideDown">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-red-500">{error}</span>
        </div>
      )}

      {/* Success indicator */}
      {success && !error && (
        <div className="flex items-center mt-2 ml-1 space-x-2 animate-slideDown">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm font-medium text-green-500">Valid</span>
        </div>
      )}
    </div>
  );
};

export default AnimatedInput;
