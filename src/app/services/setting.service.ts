import axios from "axios";
import ApiService from "./api.service";

export default class SettingService extends ApiService {
  endpoint = this.domain + "/settings";

  /**
   * Gets default address of user
   * @param userId ID of the user to fetch address of
   */
  async getDefaultAddress(userId: string) {
    const endpoint = `${this.endpoint}/${userId}`;
    const res = await axios.get(endpoint);
    return res.data ? res.data.defaultAddress : undefined;
  }


  /**
   * Sets an address as default for user
   * @param addressId ID of the address to set as default
   * @param userId User for which to set the address as default
   * @returns The new setting
   */
  async setDefaultAddress(userId: number, addressId: number) {
    const res = await axios.patch(`${this.endpoint}/${userId}`, { defaultAddress: addressId });
    return res.data.defaultAddress;
  }
}