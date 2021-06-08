import { useState, createContext } from "react";
import AddressService from "../services/address.service";
import CategoryService from "../services/category.service";
import LocationService from "../services/location.service";
import OrderService from "../services/order.service";
import ProductService from "../services/product.service";
import SettingService from "../services/setting.service";
import UiService from "../services/ui.service";
import UserService from "../services/user.service";
import State from "../state/state";

export const AppContext = createContext();

export const AppProvider = (props) => {
  const [state, setState] = useState(new State());
  const context = {
    services: {
      addressService: new AddressService(),
      categoryService: new CategoryService(),
      locationService: new LocationService(),
      orderService: new OrderService(),
      productService: new ProductService(),
      settingService: new SettingService(),
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
