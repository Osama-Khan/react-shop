import axios from "axios";
import ApiService from "./api.service";

export default class OrderService extends ApiService {
  placeOrder(address: string, userId: number, products: [{ id: number, quantity: number }]) {
    const url = `${this.domain}/orders`;
    return axios.put(url, { address, user: userId, products }, { headers: { "Content-type": "application/json" } });
  }
}