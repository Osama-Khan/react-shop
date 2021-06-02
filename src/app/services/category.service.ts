import axios from "axios";
import ApiService from "./api.service";

export default class CategoryService extends ApiService {
  private endpoint = this.domain + "/categories";

  /**
   * Get a list of all categories
   * @returns All categories
   */
  async fetchCategories() {
    const url = this.endpoint;
    return await axios.get(url).then(async (r) => await r.data);
  }

  /**
   * Gets a list of parent categories
   * @param id of the category to fetch parents of
   * @returns Parent categories of the category matching provided ID
   */
  async fetchParentsOf(id: number) {
    const url = `${this.endpoint}/parents/${id}`;
    return await axios.get(url).then(async (r) => await r.data);
  }

  /**
   * Gets a list of child categories
   * @param id of the category to fetch children of
   * @returns Child categories of the category matching provided ID
   */
  async fetchChildrenOf(id: number) {
    const url = `${this.endpoint}/children/${id}`;
    return await axios.get(url).then(async (r) => await r.data);
  }

  /**
   * Gets a list of categories with no parents
   * @returns List of categories
   */
  async fetchRootCategories() {
    const url = this.endpoint + "/root";
    return await axios.get(url).then(async (r) => await r.data);
  }

  /**
   * Gets a list of products matching the given category
   * @param id of the category to fetch products of
   * @returns List of products that have the provided category
   */
  async fetchProductsByCategory(name: string) {
    const endPoint = `/products/${name}`;
    let p = await fetch(this.endpoint + endPoint)
      .then(async (r) => await r.json());
    return p;
  }
}
