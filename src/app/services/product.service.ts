import axios from 'axios';
import Criteria from '../models/criteria';
import Product from '../models/product/product';
import ApiService from './api.service';

export default class ProductService extends ApiService {
  private endpoint = `${this.domain}/products`;

  /**
   * Gets a list of all the products
   * @param criteria filters for the products
   * @returns A list of products
   */
  async fetchProducts(criteria?: Criteria<Product>) {
    const critStr = criteria?.getUrlParameters() || '';
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

  /**
   * Gets a list of products matching the given category
   * @param name of the category to fetch products of
   * @param criteria filters for the products
   * @returns List of products that have the provided category
   */
  async fetchFromCategory(name: string, criteria?: Criteria<any>) {
    const params = criteria?.getUrlParameters() || '';
    const url = `${this.domain}/categories/products/${name}${params}`;
    const ret = await axios.get(url);
    return ret;
  }

  /**
   * Creates a product with the given data
   * @param data Product data
   * @param userId ID of the user who is creating the product
   * @returns The product created
   */
  async create(data: any, userId: number) {
    const url = this.endpoint;
    data.user = userId;
    const ret = await axios.put(url, data);
    return ret;
  }

  /**
   * Edits a product with the given id
   * @param id Product id
   * @param data Product data
   * @returns The updated product
   */
  async edit(id: number, data: any) {
    const url = `${this.endpoint}/${id}`;
    const ret = await axios.patch(url, data);
    return ret;
  }

  /**
   * Deletes a product matching the given id
   * @param id of the product to delete
   * @returns Deleted product
   */
  async delete(id: number) {
    const url = `${this.endpoint}/${id}`;
    const ret = await axios.delete(url);
    return ret;
  }

  /**
   * Fetches ratings based on the given criteria
   * @param criteria used for filtering ratings
   * @returns list of ratings
   */
  async getRatings(criteria: Criteria<any>) {
    const url = `${this.domain}/ratings${criteria?.getUrlParameters() || ''}`;
    const ret = await axios.get(url);
    return ret;
  }

  /**
   * Adds rating on a product
   * @param rating object containing rating data & product id
   * @returns The rating object created
   */
  async addRating(rating: any) {
    const url = `${this.domain}/ratings`;
    const ret = await axios.put(url, rating);
    return ret;
  }

  /**
   * Edits rating on a product
   * @param id ID of the rating
   * @param rating object containing rating data & product id
   * @returns The rating object after update
   */
  async editRating(id: number, rating: any) {
    const url = `${this.domain}/ratings/${id}`;
    const ret = await axios.patch(url, rating);
    return ret;
  }

  /**
   * Removes rating on a product
   * @param id ID of the rating
   * @returns The rating object
   */
  async removeRating(id: number) {
    const url = `${this.domain}/ratings/${id}`;
    const ret = await axios.delete(url);
    return ret;
  }
}
