import CartState from "./cart-state";
import UserState from "./user-state";

export default class State {
  cart: CartState = new CartState();
  user: UserState = new UserState();
}