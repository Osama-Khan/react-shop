import axios from "axios";
import Criteria from "../models/criteria";
import ApiService from "./api.service";

export default class AddressService extends ApiService {
  endpoint = `${this.domain}/addresses`;
  /**
   * Fetches addresses of the user provided
   * @param id Id of the user to fetch addresses of
   * @param criteria filters for the addresses
   * @returns A list of addresses
   */
  async getAddresses(id: number, criteria?: Criteria<any>) {
    if (!criteria) {
      criteria = new Criteria();
      criteria.addFilter("user", id);
      criteria.addRelation("city");
    }
    const ret = await axios.get(this.endpoint + criteria.getUrlParameters());
    return ret.data;
  }

  /**
   * Fetches address with given id
   * @param id Id of the address to fetch
   * @returns Address object
   */
  async getAddress(id: number) {
    const ret = await axios.get(`${this.endpoint}/${id}`);
    return ret.data;
  }

  /**
   * Adds address of the user provided
   * @param address The address to add
   * @returns A list of addresses
   */
  async addAddress(address: {
    user: number;
    tag: string;
    address: string;
    city: number;
  }) {
    const ret = await axios.put(`${this.endpoint}`, address);
    return ret.data;
  }

  /**
   * Adds address of the user provided
   * @param address The address to add
   * @returns A list of addresses
   */
  async deleteAddress(addressId: number) {
    const ret = await axios.delete(`${this.endpoint}/${addressId}`);
    return ret;
  }
}
