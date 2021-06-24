import { AxiosRequestConfig } from "axios";

/**
 * Attaches a Bearer token to the Authorization header of the request
 * @param token The token to attach (without 'Bearer ')
 * @returns Interceptor that attaches the token
 */
export default function attachTokenInterceptor(token: string) {
  return (request: AxiosRequestConfig) => {
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  };
}
