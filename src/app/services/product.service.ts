import ApiService from "./api.service";

export default class ProductService extends ApiService {
  private url = `${this.domain}/products`

  /**
   * Gets a list of all the products
   * @returns A list of products
   */
  async fetchProducts() {
    let p = await fetch(this.url)
      .then(async (r) => await r.json());
    return p;
  }

  /**
   * Fetches a product matching the given id
   * @param id of the product to fetch
   * @returns Product with the provided id
   */
  async fetchProduct(id: number) {
    const endPoint = `/${id}`;
    let p = await fetch(this.url + endPoint)
      .then(async (r) => await r.json());
    return p;
  }
}
