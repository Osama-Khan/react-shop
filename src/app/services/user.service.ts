import axios from 'axios';
import ApiService from './api.service';

export default class UserService extends ApiService {
  /**
   * Logs in the user with given parameters
   * @returns An object with user data along with token
   */
  async login(username: string, password: string) {
    const obj = { username, password };
    const ret = await axios.post(`${this.domain}/login`, obj, { headers: { "Content-type": "application/json" } });
    return ret.data;
  }

  /**
   * Registers a new user with the given parameters
   * @returns An object with user data
   */
  async register(username: string, password: string, firstName: string, lastName: string, email: string, dateOfBirth: Date) {
    const obj = { username, password, firstName, lastName, email, dateOfBirth };
    const ret = await axios.post(`${this.domain}/register`, obj, { headers: { "Content-type": "application/json" } });
    return ret.data;
  }

  /**
   * Gets the user with given id
   * @param id of the user to get
   * @returns user with given id
   */
  async getUser(id: number) {
    const ret = await axios.get(`${this.domain}/users/${id}`);
    return ret.data;
  }

  /**
   * Fetches data containing details of the most recently added product by the given user
   * @param id of the user to fetch product of
   * @returns An object with product data
   */
  async fetchMostRecentProduct(id: number) {
    const endPoint = `${id}/products/recent`;
    const ret = await axios.get(`${this.domain}/users/${endPoint}`);
    return ret.data;
  }
}