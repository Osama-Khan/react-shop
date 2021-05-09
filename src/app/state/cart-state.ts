import CartProduct from "../models/cart-product";
import Product from "../models/product";

export default class CartState {
  /** The list of items in the cart */
  products: CartProduct[] = [];

  /**
   * Adds a product to the cart
   * @param p The product to add
   * @param q Number of products to add
   */
  addProduct(p: Product, q = 1): void {
    let exists = false
    this.products = this.products.map((prd) => {
      if (prd.id === p.id) {
        exists = true;
        prd.quantity += q;
      }
      return prd;
    });
    if (!exists) {
      this.products.push(new CartProduct(p, q));
    }
    // Should inform the user
  }

  /**
   * Removes a product from the cart
   * @param id ID of the product to remove
   */
  removeProduct(id: number): void {
    const p = this.products.filter((p) => p.id !== id);
    if (p.length !== this.products.length) {
      // Inform the user that product was removed
    } else {
      // There is no such product in cart
    }
  }

  /**
   * Checks if product exists in the cart
   * @param id ID of the product to look for
   * @returns True or false, depending on if the product is present or not respectively
   */
  hasProduct(id: number): boolean {
    return (this.products.some((p) => p.id === id));
  }
}