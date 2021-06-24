import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/app.provider";
import attachTokenInterceptor from "./attach-token.interceptor";
import responseErrorInterceptor from "./response-error.interceptor";

let requestInterceptors = [];
let responseInterceptors = [];

/**
 * Adds the interceptors for axios request and response
 */
export default function InterceptorInitializer() {
  const context = useContext(AppContext);

  // Remove previous interceptors before re-adding
  if (requestInterceptors.length > 0) {
    requestInterceptors.forEach((i) => axios.interceptors.request.eject(i));
    requestInterceptors = [];
  }
  if (responseInterceptors.length > 0) {
    responseInterceptors.forEach((i) => axios.interceptors.response.eject(i));
    responseInterceptors = [];
  }

  requestInterceptors.push(
    axios.interceptors.request.use(
      attachTokenInterceptor(context.state.user?.token)
    )
  );

  responseInterceptors.push(
    axios.interceptors.response.use(
      undefined,
      responseErrorInterceptor(context)
    )
  );

  return <></>;
}
