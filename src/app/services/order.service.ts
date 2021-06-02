import axios from "axios";
import ApiService from "./api.service";

export default class OrderService extends ApiService {
  /**
   * Send a request to place order to the server
   * @param address Address to place order on
   * @param userId Id of the user placing the order
   * @param products Products to include in the order
   * @returns An object containing the order details
   */
  placeOrder(address: string, userId: number, products: [{ id: number, quantity: number }]) {
    const url = `${this.domain}/orders`;
    return axios.put(url, { address, user: userId, products }, { headers: { "Content-type": "application/json" } });
  }
}