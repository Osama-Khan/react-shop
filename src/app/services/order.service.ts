import axios from 'axios';
import { OrderStateEnum } from '../../data/order-state.enum';
import Criteria from '../models/criteria';
import ApiService from './api.service';

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
    products: [{ id: number; quantity: number }],
  ) {
    const url = this.endpoint;
    const ret = await axios.put(
      url,
      { address, user: userId, products },
      { headers: { 'Content-type': 'application/json' } },
    );
    return ret;
  }

  /**
   * Sends a request to get orders
   * @param criteria filters for the orders
   * @returns A list of orders
   */
  async getOrders(criteria?: Criteria<any>) {
    const url = this.endpoint + (criteria?.getUrlParameters() || '');
    const res = await axios.get(url);
    return res;
  }

  /**
   * Sends a request to get the orders of the given user
   * @param userId ID of the user to fetch orders of
   * @param criteria filters for the orders
   * @returns A list of orders
   */
  async getOrdersByUser(userId: number, criteria?: Criteria<any>) {
    if (!criteria) {
      criteria = new Criteria();
    }
    criteria.addRelation('orderProducts');
    criteria.addRelation('orderState');
    criteria.addFilter('user', userId);
    const url = this.endpoint + criteria.getUrlParameters();
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

  /**
   * Sends a request to get the OrderStates list
   * @returns list of OrderState objects
   */
  async getOrderStates() {
    const url = `${this.endpoint}/states`;
    const res = await axios.get(url);
    return res;
  }

  /**
   * Marks an order as delivered
   * @param orderId ID of the order to mark delivered
   * @returns the order marked as delivered
   */
  async deliverOrder(orderId: number) {
    const o = { orderState: OrderStateEnum.Delivered };
    const url = `${this.endpoint}/${orderId}`;
    const res = await axios.patch(url, o);
    return res;
  }

  /**
   * Marks an order as shipped
   * @param orderId ID of the order to mark shipped
   * @returns the order marked as shipped
   */
  async shipOrder(orderId: number) {
    const o = { orderState: OrderStateEnum.Shipped };
    const url = `${this.endpoint}/${orderId}`;
    const res = await axios.patch(url, o);
    return res;
  }

  /**
   * Marks an order as canceled
   * @param orderId ID of the order to mark canceled
   * @returns the order marked as canceled
   */
  async cancelOrder(orderId: number) {
    const o = { orderState: OrderStateEnum.Cancelled };
    const url = `${this.endpoint}/${orderId}`;
    const res = await axios.patch(url, o);
    return res;
  }

  /**
   * Gets one of user product orders prioritized by state: Delivered > Shipped > Processing > Canceled
   * @param uid ID of the user to fetch order of
   * @param pid ID of the product the order is placed for
   * @returns a response object containing order details and state as data if an order exists
   */
  async getUserProduct(uid: number, pid: number) {
    const url = `${this.endpoint}/user/${uid}/product/${pid}`;
    const res = await axios.get(url);
    return res;
  }
}
