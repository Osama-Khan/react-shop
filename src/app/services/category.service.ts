import axios from "axios";
import ApiService from "./api.service";

export default class CategoryService extends ApiService {
  endpoint = this.domain + "/categories";

  async fetchCategories() {
    const url = this.endpoint;
    return await axios.get(url).then(async (r) => await r.data);
  }

  async fetchParentsOf(id: number) {
    const url = `${this.endpoint}/parents/${id}`;
    return await axios.get(url).then(async (r) => await r.data);
  }

  async fetchRootCategories() {
    const url = this.endpoint + "/root";
    return await axios.get(url).then(async (r) => await r.data);
  }
}
