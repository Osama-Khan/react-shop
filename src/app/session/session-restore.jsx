import { useContext } from "react";
import { AppContext } from "../context/app.provider";
import CartState from "../state/cart-state";

let restoreDone = false;

export default function SessionRestore() {
  const context = useContext(AppContext);
  if (restoreDone) return <></>;
  const promises = [];
  let user, cart;
  const userP = restoreUser(context)?.then((u) => (user = u));
  const cartP = restoreCart(context)?.then((c) => (cart = c));
  promises.push(userP);
  promises.push(cartP);
  Promise.all(promises)
    .then(() => {
      console.log(userP, cartP);
      if (user && cart) {
        context.setState({ user, cart });
      } else if (user) {
        context.setState({ ...context.state, user });
      } else if (cart) {
        context.setState({ ...context.state, cart });
      }
    })
    .catch(() => {});
  restoreDone = true;
  return <></>;
}

function restoreUser(context) {
  const svc = context.services;
  const token = svc.storageService.loadUserToken();
  if (token) {
    const promise = svc.userService.loginWithToken(token);
    const messages = {
      loading: "Restoring session...",
      success: "Session restored! You are now logged in.",
      error: "Could not restore session!",
    };
    return svc.uiService
      .promiseToast(promise, messages)
      .then((res) => {
        const user = res.data;
        user.token = token;
        return user;
      })
      .catch(() => {});
  }
}

function restoreCart(context) {
  const stg = context.services.storageService;
  const prd = context.services.productService;
  const ui = context.services.uiService;
  const promises = [];
  const oldCartItems = stg.loadCart();
  if (!oldCartItems) return;
  const cart = new CartState();
  const toastPromise = new Promise(
    (res) => res(),
    (rej) => rej()
  );
  ui.promiseToast(toastPromise, {
    loading: "Restoring cart...",
    success: "Cart restored successfully!",
    error: "Could not restore cart!",
  });
  oldCartItems.forEach((cp) => {
    promises.push(
      prd
        .fetchProduct(cp.id)
        .then((res) => cart.addProduct(res.data, cp.quantity))
    );
  });
  return Promise.all(promises)
    .then(() => {
      Promise.resolve(toastPromise);
      return cart;
    })
    .catch((err) => {
      Promise.reject(toastPromise);
    });
}
