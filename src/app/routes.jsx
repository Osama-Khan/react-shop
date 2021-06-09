import Categories from "./categories/categories";
import Products from "./products/products";
import Home from "./home/Home";
import User from "./user/user";
import Register from "./user/register";
import Order from "./order/order";
import UserEdit from "./user/user-edit";
import AddressBook from "./user/addresses/address";
import AddAddress from "./user/addresses/add-address";

export const homeUrl = "/";
export const productsUrl = "/products";
export const categoriesUrl = `/categories`;
export const userUrl = "/user";
export const editUserUrl = userUrl + "/edit";
export const addressesUrl = userUrl + "/addresses";
export const addAddressUrl = addressesUrl + "/add";
export const registerUrl = "/register";
export const orderUrl = "/order";

export const routes = [
  { path: homeUrl, component: Home },
  { path: productsUrl, component: Products },
  { path: productsUrl + "/:id", component: Products },
  { path: categoriesUrl, component: Categories },
  { path: categoriesUrl + "/:name", component: Categories },
  { path: userUrl, component: User },
  { path: editUserUrl, component: UserEdit },
  { path: addressesUrl, component: AddressBook },
  { path: addAddressUrl, component: AddAddress },
  { path: userUrl, component: User },
  { path: registerUrl, component: Register },
  { path: orderUrl, component: Order },
];
