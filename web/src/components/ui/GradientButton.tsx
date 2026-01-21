import React from "react";
import { LucideIcon } from "lucide-react";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  gradientDirection?: "left" | "right" | "top" | "bottom";
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  gradientDirection = "right",
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "relative overflow-hidden rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: `
      text-white
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-primary-500 before:via-primary-600 before:to-primary-500
      before:transition-transform before:duration-500
      hover:before:scale-110
      active:scale-95
      focus:ring-primary-500
      after:absolute after:inset-0 after:bg-gradient-to-r 
      after:from-white after:via-white/20 after:to-white
      after:opacity-0 hover:after:opacity-10
    `,
    secondary: `
      bg-white text-primary-600 border-2 border-primary-200
      hover:bg-primary-50 hover:border-primary-300
      active:scale-95
      focus:ring-primary-500
    `,
    glass: `
      bg-white/10 backdrop-blur-md text-white border border-white/20
      hover:bg-white/20 hover:border-white/30
      active:scale-95
      focus:ring-white/50
    `,
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const getGradientClass = () => {
    switch (gradientDirection) {
      case "left":
        return "before:bg-gradient-to-l after:bg-gradient-to-l";
      case "top":
        return "before:bg-gradient-to-t after:bg-gradient-to-t";
      case "bottom":
        return "before:bg-gradient-to-b after:bg-gradient-to-b";
      default:
        return "before:bg-gradient-to-r after:bg-gradient-to-r";
    }
  };

  const buttonClass = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${getGradientClass()}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  return (
    <button className={buttonClass} disabled={disabled || loading} {...props}>
      <span className="relative z-10 flex items-center justify-center">
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          <>
            {Icon && iconPosition === "left" && (
              <Icon className="w-5 h-5 mr-2" />
            )}
            {children}
            {Icon && iconPosition === "right" && (
              <Icon className="w-5 h-5 ml-2" />
            )}
          </>
        )}
      </span>
    </button>
  );
};

export default GradientButton;
