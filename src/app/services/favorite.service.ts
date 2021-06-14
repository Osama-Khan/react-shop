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
    const res = axios.get(url);
    return res;
  }

  /**
   * Checks if a product is favorite of user
   * @param productId ID of the product
   * @param userId ID of the user
   * @returns Response with favorite data
   */
  isProductFavoriteOfUser(productId: number, userId: number) {
    const url = `${this.endpoint}?filters=user=${userId};product=${productId}&include=product;user`;
    const res = axios.get(url);
    return res;
  }

  /**
   * Adds a product in the favorites list of a user
   * @param userId ID of the user adding favorite
   * @param productId ID of the product being added
   * @returns Response with Favorite data
   */
  async setFavorite(userId: number, productId: number) {
    const fav = await this.isProductFavoriteOfUser(productId, userId);
    if (fav.data.length > 0) {
      throw new Error("Product already favorited");
    }
    const res = axios.put(this.endpoint, { user: userId, product: productId });
    return res;
  }

  /**
   * Removes a product from the favorites list of a user
   * @param userId ID of the user removing the favorite
   * @param productId ID of the product being removed
   * @returns Response with Favorite data
   */
  async unsetFavorite(userId: number, productId: number) {
    const fav = await this.isProductFavoriteOfUser(productId, userId);
    if (fav.data.length === 0) {
      throw new Error("Product not favorited");
    }
    const res = axios.delete(`${this.endpoint}/${fav.data[0].id}`);
    return res;
  }
}
