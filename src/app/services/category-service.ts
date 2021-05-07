import Service from "./service";

export default class CategoryService extends Service {
  async fetchCategories() {
    const url = `https://api.ghostware.xyz/test/categories.php?key=${this.accessKey}`;
    let p = await fetch(url).then((r) => {
      return r.json();
    })
    return p;
  }
}
