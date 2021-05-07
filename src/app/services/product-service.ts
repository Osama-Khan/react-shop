import Service from "./service";

export default class ProductService extends Service {
  async fetchProducts() {
    const url = `https://api.ghostware.xyz/test/products.php?key=${this.accessKey}`;
    let p = await fetch(url).then((r) => {
      return r.json();
    })
    return p;
  }
}
