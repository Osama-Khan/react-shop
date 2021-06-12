import axios from "axios";
import ApiService from "./api.service";

export default class FavoriteService extends ApiService {
  endpoint = this.domain + "/favorites";

  /**
   * Checks how many users have favorited a product
   * @param productId ID of the product
   */
  productFavoriteOfUsers(productId: number) {
    const url = `${this.endpoint}/product-count/${productId}`;
    const res = axios.get(url);
    return res;
  }

  /**
   * Checks how many products are favorited by a user
   * @param userId ID of the user
   */
  productsFavoritedByUser(userId: number) {
    const url = `${this.endpoint}/user-count/${userId}`;
    const res = axios.get(url);
    return res;
  }

  /**
   * Gets the favorites of a user
   * @param userId ID of the user
   */
  getFavoritesOfUser(userId: number) {
    const url = `${this.endpoint}?filters=user=${userId}&include=product`;
  }
}
