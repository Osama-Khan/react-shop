export default class StorageService {
  userTokenKey = "user-token";

  /**
   * Saves the given token in localStorage
   * @param token The token to save
   */
  saveUserToken = (token: string) =>
    localStorage.setItem(this.userTokenKey, token);

  /**
   * Gets the user token from localStorage
   */
  loadUserToken = () => localStorage.getItem(this.userTokenKey);

  /**
   * Removes the user-token from storage
   */
  clearUserToken = () => localStorage.removeItem(this.userTokenKey);
}
