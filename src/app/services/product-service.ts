import Service from "./service";

export default class ProductService extends Service {
  url = `https://api.ghostware.xyz/test/products.php?key=${this.accessKey}`;
  
  async fetchProducts() {
    let p = await fetch(this.url).then((r) => {
      return r.json();
    })
    return p;
  }

  async fetchProduct(id: number) {
    const params = `&id=${id}`;
    let p = await fetch(this.url + params).then((r) => {
      return r.json();
    })
    return p;
  }
}
