// src/utils/toastService.js
import { toast } from "react-toastify";

/**
 * Show toast notification anywhere in your app
 * @param {string} message - The message to display
 * @param {"success" | "error" | "info" | "warn"} type - Toast type
 */
export const showToast = (message, type = "info") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warn":
      toast.warn(message);
      break;
    default:
      toast.info(message);
  }
};
