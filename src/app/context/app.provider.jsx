import { useState, createContext } from "react";
import CategoryService from "../services/category.service";
import OrderService from "../services/order.service";
import ProductService from "../services/product.service";
import UiService from "../services/ui.service";
import UserService from "../services/user.service";
import State from "../state/state";

export const AppContext = createContext();

export const AppProvider = (props) => {
  const [state, setState] = useState(new State());
  const context = {
    services: {
      categoryService: new CategoryService(),
      orderService: new OrderService(),
      productService: new ProductService(),
      uiService: new UiService(),
      userService: new UserService(),
    },
    state,
    setState,
  };
  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};
