import Product from './product';

export default class CartProduct {
  id: number;
  title: string;
  description: string;
  quantity: number;
  price: number;
  img: string;
  stock: number;

  constructor(p: Product, quantity = 1) {
    this.id = p.id;
    this.title = p.title;
    this.description = p.description;
    this.quantity = quantity;
    this.price = p.price;
    this.img = p.images[0].image;
    this.stock = p.stock;
  }

  /**
   * Validates quantity of a product
   * @param qty Quantity to validate
   * @param max Maximum quantity to allow
   * @returns A message with error or false if quantity is valid
   */
  static isQuantityInvalid(qty: number, max: number): string | false {
    if (max === 0) {
      return 'This product is not available anymore!';
    }
    if (qty !== 0 && !qty) {
      return 'Quantity must be a number!';
    }
    if (qty <= 0) {
      return 'Quantity must be above 0!';
    }
    if (qty > max) {
      return `Max quantity available is ${max}!`;
    }
    return false;
  }
}
