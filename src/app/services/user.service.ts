import axios from 'axios';
import ApiService from './api.service';

export default class UserService extends ApiService {
  async login(username: string, password: string) {
    const obj = { username, password };
    const ret = await axios.post(`${this.domain}/login`, obj, { headers: { "Content-type": "application/json" } });
    return ret.data;
  }

  async register(username: string, password: string, firstName: string, lastName: string, email: string, dateOfBirth: Date) {
    const obj = { username, password, firstName, lastName, email, dateOfBirth };
    const ret = await axios.post(`${this.domain}/register`, obj, { headers: { "Content-type": "application/json" } });
    return ret.data;
  }
}