import toast from "react-hot-toast";
import {
  DefaultToastOptions,
  IconTheme,
} from "react-hot-toast/dist/core/types";

interface ToastOptions {
  id?: string;
  icon?: string;
  duration?: number;
  role?: "status" | "alert";
  ariaLive?: "assertive" | "off" | "polite" | undefined;
  className?: string | undefined;
  style?: any;
  iconTheme?: IconTheme | undefined;
}

const defaultStyle = {
  backgroundColor: "#222",
  color: "#fff",
}

/**
 * Service that provides methods related to UI feedback
 */
export default class UiService {
  /**
   * Creates a toast with the given parameters
   * @param text The text to show in the toast
   * @param options Options for the toast
   * @returns Count of the total toasts shown
   */
  toast = (text: string, options?: ToastOptions) => toast(text, { style: defaultStyle, ...options });

  /**
   * Creates a success toast with the given parameters
   * @param text The text to show in the toast
   * @param options Options for the toast
   * @returns Count of the total toasts shown
   */
  successToast = (text: string, options?: ToastOptions) =>
    toast.success(text, { style: defaultStyle, ...options });

  /**
   * Creates an error toast with the given parameters
   * @param text The text to show in the toast
   * @param options Options for the toast
   * @returns Count of the total toasts shown
   */
  errorToast = (text: string, options?: ToastOptions) =>
    toast.error(text, { style: defaultStyle, ...options });

  /**
   * Creates a promise toast with the given parameters
   * @param promise The promise used for loading, failed and success events
   * @param msgs The messages to show for loading, success and error
   * @param options Options for the toast
   * @returns Promise object
   */
  promiseToast = (
    promise: Promise<any>,
    msgs: { loading: any; success: any; error: any },
    options?: DefaultToastOptions
  ): Promise<any> => toast.promise(promise, msgs, { style: defaultStyle, ...options });
}
