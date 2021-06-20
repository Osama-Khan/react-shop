import axios from "axios";
import Criteria from "../models/criteria";
import Product from "../models/product/product";
import ApiService from "./api.service";

export default class ProductService extends ApiService {
  private endpoint = `${this.domain}/products`;

  /**
   * Gets a list of all the products
   * @returns A list of products
   */
  async fetchProducts(criteria?: Criteria<Product>) {
    const critStr = criteria?.getUrlParameters() || "";
    const ret = await axios.get(this.endpoint + critStr);
    return ret;
  }

  /**
   * Fetches a product matching the given id
   * @param id of the product to fetch
   * @returns Product with the provided id
   */
  async fetchProduct(id: number) {
    const url = `${this.endpoint}/${id}`;
    const ret = await axios.get(url);
    return ret;
  }
}
