import React from "react";

interface LoadingSpinnerProps {
  label?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Loading...",
  fullScreen = false,
}) => {
  const content = (
    <div className="text-center">
      <div className="w-12 h-12 mx-auto border-4 border-orange-200 rounded-full border-t-orange-500 animate-spin" />
      <p className="mt-4 text-sm text-gray-600">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-10">{content}</div>;
};

export default LoadingSpinner;
