import { useState, useEffect, createContext } from 'react';
import AddressService from '../services/address.service';
import CategoryService from '../services/category.service';
import FavoriteService from '../services/favorite.service';
import LocationService from '../services/location.service';
import OrderService from '../services/order.service';
import ProductService from '../services/product.service';
import SettingService from '../services/setting.service';
import StorageService from '../services/storage.service';
import UiService from '../services/ui.service';
import UserService from '../services/user.service';
import State from '../state/state';

export const AppContext = createContext();

export const AppProvider = (props) => {
  const [state, setState] = useState(new State());
  const services = {
    addressService: new AddressService(),
    categoryService: new CategoryService(),
    favoriteService: new FavoriteService(),
    locationService: new LocationService(),
    orderService: new OrderService(),
    productService: new ProductService(),
    settingService: new SettingService(),
    storageService: new StorageService(),
    uiService: new UiService(),
    userService: new UserService(),
  };

  useEffect(() => {
    if (state.cart?.products.length > 0) {
      services.storageService.updateCart(state.cart);
    } else {
      services.storageService.clearCart();
    }
  }, [state, services.storageService]);
  const context = {
    services,
    state,
    setState,
  };
  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};
