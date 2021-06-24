import { useContext } from "react";
import { AppContext } from "../context/app.provider";

export default function SessionRestore() {
  const context = useContext(AppContext);
  if (!context.state.user?.token) {
    const svc = context.services;
    const token = svc.storageService.loadUserToken();
    if (token) {
      const promise = svc.userService.loginWithToken(token);
      const messages = {
        loading: "Restoring session...",
        success: "Session restored! You are now logged in.",
        error: "Could not restore session!",
      };
      svc.uiService
        .promiseToast(promise, messages)
        .then((res) => {
          const user = res.data;
          user.token = token;
          context.setState({ ...context.state, user });
        })
        .catch(() => {});
    }
  }
  return <></>;
}
