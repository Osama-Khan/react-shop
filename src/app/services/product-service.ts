import { products } from "../../data/products";
import Product from "../models/product"
import Service from "./service";

export default class ProductService extends Service {
  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async fetchProducts(): Promise<Product[]> {
    await this.sleep(2000);
    return products;
  }
}
