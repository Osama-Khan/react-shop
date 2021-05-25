import { IUser, User } from "../models/user";

export default class UserState {
  /** Data of logged in user */
  user: User | undefined;


  setUser(object: IUser) {
    this.user = new User(object);
  }
}