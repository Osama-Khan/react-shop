import axios from 'axios';
import Criteria from '../models/criteria';
import { User } from '../models/user';
import ApiService from './api.service';

export default class UserService extends ApiService {
  /**
   * Logs in the user with given parameters
   * @param username The username of the login user
   * @param password The password of the login user
   * @param context The context object containing user state
   * @returns An object with user data along with token
   */
  async login(username: string, password: string, context?: any) {
    const obj = { username, password };
    const res = await axios.post(`${this.domain}/login`, obj, {
      headers: { 'Content-type': 'application/json' },
    });
    if (context) {
      const user = res.data;
      context.setState({ ...context.state, user });
      context.services.storageService.saveUserToken(user.token);
    }
    return res;
  }

  /**
   * Logs in the user using the jwt token in storage
   * @param token The token to use for login
   * @returns Response of the request
   */
  async loginWithToken(token: string) {
    const res = await axios.post(`${this.domain}/login/token`, undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  }

  /**
   * Registers a new user with the given parameters
   * @returns An object with user data
   */
  async register(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    dateOfBirth: Date,
  ) {
    const obj = { username, password, firstName, lastName, email, dateOfBirth };
    const res = await axios.post(`${this.domain}/register`, obj, {
      headers: { 'Content-type': 'application/json' },
    });
    return res;
  }

  /**
   * Gets all users
   * @param criteria Criteria object to filter the results
   * @returns object with user data and meta
   */
  async getUsers(criteria?: Criteria<User>) {
    const params = criteria?.getUrlParameters() || '';
    const res = await axios.get(`${this.domain}/users${params}`);
    return res;
  }
  /**
   * Gets the user with given id
   * @param id of the user to get
   * @returns user with given id
   */
  async getUser(id: number) {
    const res = await axios.get(`${this.domain}/users/${id}`);
    return res;
  }

  /**
   * Fetches data containing details of the most recently added product by the given user
   * @param id of the user to fetch product of
   * @returns An object with product data
   */
  async fetchMostRecentProduct(id: number) {
    const endPoint = `${id}/products/recent`;
    const res = await axios.get(`${this.domain}/users/${endPoint}`);
    if (res.status === 404) {
      return undefined;
    }
    return res;
  }

  /**
   * Fetches data containing products of the user provided
   * @param id of the user to fetch products of
   * @param criteria filters for the products
   * @returns An object with products data
   */
  async fetchProducts(id: number, criteria?: Criteria<any>) {
    if (!criteria) {
      criteria = new Criteria();
    }
    criteria.addFilter('user', id);
    const endPoint = `products${criteria.getUrlParameters()}`;
    const res = await axios.get(`${this.domain}/${endPoint}`);
    return res;
  }

  /**
   * Sends an update request to the server
   * @param id Id of the user to update
   * @param data object with properties of user
   * @returns The new user, after updation
   */
  async update(id: number, data: Partial<User>) {
    const res = await axios.patch(`${this.domain}/users/${id}`, data);
    return res;
  }

  /**
   * Sends a delete request to the server
   * @param id ID of the user to delete
   */
  async delete(id: number) {
    const res = await axios.delete(`${this.domain}/users/${id}`);
    return res;
  }
}
