import Product from "./product";

export default class CartProduct {
  id: number;
  title: string;
  description: string;
  quantity: number;
  price: number;
  img: string;

  constructor(p: Product, quantity = 1) {
    this.id = p.id;
    this.title = p.title;
    this.description = p.description;
    this.quantity = quantity;
    this.price = p.price;
    this.img = p.img;
  }
}