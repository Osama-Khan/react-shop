import axios from "axios";
import ApiService from "./api.service";

export default class OrderService extends ApiService {
  endpoint = `${this.domain}/orders`;

  /**
   * Send a request to place order to the server
   * @param address Address to place order on
   * @param userId Id of the user placing the order
   * @param products Products to include in the order
   * @returns An object containing the order details
   */
  async placeOrder(
    address: string,
    userId: number,
    products: [{ id: number; quantity: number }]
  ) {
    const url = this.endpoint;
    const ret = await axios.put(
      url,
      { address, user: userId, products },
      { headers: { "Content-type": "application/json" } }
    );
    return ret.data;
  }

  /**
   * Sends a request to get the orders of the given user
   * @param userId ID of the user to fetch orders of
   * @returns A list of orders
   */
  async getOrders(userId: number) {
    const url = `${this.endpoint}?include=orderProducts;orderState&filters=user=${userId}`;
    const res = await axios.get(url);
    return res;
  }

  /**
   * Sends a request to get the OrderProduct list of the given user
   * @param orderId ID of the order to fetch detail of
   * @returns a list containing order products along with price and quantity
   */
  async getOrderDetail(orderId: number) {
    const url = `${this.endpoint}/detail/${orderId}`;
    const res = await axios.get(url);
    return res;
  }
}
