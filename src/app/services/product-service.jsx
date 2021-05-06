import { products } from "../../data/products";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class ProductService {
  async fetchProducts() {
    await sleep(2000);
    return products;
  }
}
