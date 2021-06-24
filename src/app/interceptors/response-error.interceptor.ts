/**
 * @param context Object used to get UIService instance
 * @returns an interceptor that shows the error from the server in an error toast
 */
export default function responseErrorInterceptor(context: any) {
  return (error: any) => {
    const { status, statusText } = error.response;
    const message = error.response.data.message;
    if (status >= 400) {
      context.services.uiService.errorToast(`${message || statusText}`);
    }
    return Promise.reject(error);
  };
}
