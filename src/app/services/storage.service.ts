import CartState from '../state/cart-state';

export default class StorageService {
  userTokenKey = 'user-token';
  cartKey = 'cart';

  /**
   * Saves the given token in localStorage
   * @param token The token to save
   */
  saveUserToken = (token: string) =>
    localStorage.setItem(this.userTokenKey, token);

  /**
   * Gets the user token from localStorage
   */
  loadUserToken = () => localStorage.getItem(this.userTokenKey);

  /**
   * Removes the user-token from storage
   */
  clearUserToken = () => localStorage.removeItem(this.userTokenKey);

  /**
   * Saves cart product IDs and Quantities in localStorage
   * @param cart The state of the cart
   */
  updateCart = (cart: CartState) => {
    if (cart.products?.length > 0)
      localStorage.setItem(
        this.cartKey,
        cart.products.map((p) => p.id + ':' + p.quantity).join(';'),
      );
    else this.clearCart();
  };

  /** Removes cart data from localStorage */
  clearCart = () => localStorage.removeItem(this.cartKey);

  /**
   * Loads cart product IDs and Quantities saved on last session
   * @returns list of objects containing product id and quantity
   */
  loadCart = () => {
    const items = localStorage.getItem(this.cartKey)?.split(';');
    return items?.map((i) => {
      const data = i.split(':').map((n) => parseInt(n));
      return { id: data[0], quantity: data[1] };
    });
  };
}
