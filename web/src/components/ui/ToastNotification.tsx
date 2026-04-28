import React from "react";
import { Toaster } from "react-hot-toast";

const ToastNotification: React.FC = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      style: {
        borderRadius: "16px",
        padding: "14px 16px",
        border: "1px solid #fed7aa",
      },
      success: {
        style: {
          background: "#fff7ed",
          color: "#9a3412",
        },
      },
      error: {
        style: {
          background: "#fff1f2",
          color: "#9f1239",
        },
      },
    }}
  />
);

export default ToastNotification;
