import { useContext } from 'react';
import { AppContext } from '../context/app.provider';
import { productsUrl } from '../routes';
import CartState from '../state/cart-state';

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
      loading: 'Restoring session...',
      success: 'Session restored! You are now logged in.',
      error: 'Could not restore session!',
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
  const removedProducts = [];
  const readjustedProducts = [];

  const oldCartItems = stg.loadCart();
  if (!oldCartItems) return;
  const cart = new CartState();
  const toastPromise = new Promise(
    (res) => res(),
    (rej) => rej(),
  );
  ui.promiseToast(toastPromise, {
    loading: 'Restoring cart...',
    success: 'Cart restored successfully!',
    error: 'Could not restore cart!',
  });
  oldCartItems.forEach((cp) => {
    promises.push(
      prd.fetchProduct(cp.id).then((res) => {
        const product = res.data;
        if (product.stock === 0) {
          removedProducts.push(product);
          return;
        }
        if (product.stock < cp.quantity) {
          readjustedProducts.push(product);
          cp.quantity = product.stock;
        }
        cart.addProduct(product, cp.quantity);
      }),
    );
  });
  return Promise.all(promises)
    .then(() => {
      Promise.resolve(toastPromise);
      if (removedProducts.length > 0 || readjustedProducts.length > 0) {
        showCartReadjustmentModal(
          ui.htmlModal,
          readjustedProducts,
          removedProducts,
        );
      }
      return cart;
    })
    .catch((err) => {
      Promise.reject(toastPromise);
    });
}

const showCartReadjustmentModal = (htmlModal, adjusted, removed) => {
  const elFromProduct = (p) => (
    <div>
      <a href={`${productsUrl}/${p.id}`}>{p.title}</a>
    </div>
  );
  const adjustedEls = adjusted.map(elFromProduct);
  const removedEls = removed.map(elFromProduct);
  const [showAdj, showRmv] = [adjusted.length > 0, removed.length > 0];
  htmlModal(
    'Cart Readjustment',
    <div>
      {showAdj ? (
        <>
          <p>
            The quantity has been reduced for the following products due to
            stock changes.
          </p>
          <>{adjustedEls}</>
        </>
      ) : (
        ''
      )}
      {showRmv && showAdj ? <hr /> : ''}
      {showRmv ? (
        <>
          <p>
            The following products have been removed from the cart because they
            are no longer available.
          </p>
          <>{removedEls}</>
        </>
      ) : (
        ''
      )}
    </div>,
    'warning',
    false,
    'Okay',
  );
};
