import axios from "axios";
import Criteria from "../models/criteria";
import ApiService from "./api.service";

export default class CategoryService extends ApiService {
  private endpoint = this.domain + "/categories";

  /**
   * Get a list of all categories
   * @returns All categories
   */
  async fetchCategories(criteria?: Criteria<{ id: number; name: string }>) {
    if (!criteria) criteria = new Criteria();
    const url = this.endpoint + criteria.getUrlParameters();
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
    const url = `${this.endpoint}/root`;
    return await axios.get(url).then(async (r) => await r.data);
  }
}
