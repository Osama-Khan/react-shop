import axios from 'axios';
import ApiService from './api.service';

export default class AddressService extends ApiService {
  endpoint = `${this.domain}/addresses`
  /**
   * Fetches addresses of the user provided
   * @param id Id of the user to fetch addresses of
   * @returns A list of addresses
   */
  async getAddresses(id: number) {
    const ret = await axios.get(`${this.endpoint}?filters=user=${id}&include=city`);
    return ret.data;
  }

  /**
   * Fetches default address of a user
   * @param id Id of the user to fetch address of
   * @returns The default address of user
   */
  async getDefaultAddress(id: number) {
    const ret = await axios.get(`${this.endpoint}/default/${id}`)
    return ret.data;
  }
}