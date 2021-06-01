import ApiService from "./api.service";

export default class ProductService extends ApiService {
  url = `${this.domain}/products`

  async fetchProducts() {
    let p = await fetch(this.url)
      .then(async (r) => await r.json());
    return p;
  }

  async fetchProduct(id: number) {
    const endPoint = `/${id}`;
    let p = await fetch(this.url + endPoint)
      .then(async (r) => await r.json());
    return p;
  }
}
