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

export default class UiService {
  toast = (text: string, options?: ToastOptions) => toast(text, { style: defaultStyle, ...options });

  successToast = (text: string, options?: ToastOptions) =>
    toast.success(text, { style: defaultStyle, ...options });

  errorToast = (text: string, options?: ToastOptions) =>
    toast.error(text, { style: defaultStyle, ...options });

  promiseToast = (
    promise: Promise<any>,
    msgs: { loading: any; success: any; error: any },
    options?: DefaultToastOptions
  ): Promise<any> => toast.promise(promise, msgs, { style: defaultStyle, ...options });
}
