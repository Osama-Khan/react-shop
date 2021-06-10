import Categories from "./categories/categories";
import Products from "./products/products";
import Home from "./home/Home";
import User from "./user/user";
import Register from "./user/register";
import Order from "./order/order";
import OrderList from "./order/order-list";
import UserEdit from "./user/user-edit";
import AddressBook from "./user/addresses/address";
import AddAddress from "./user/addresses/add-address";
import UserProducts from "./user/user-products";

export const homeUrl = "/";
export const productsUrl = "/products";
export const categoriesUrl = `/categories`;
export const userUrl = "/user";
export const editUserUrl = userUrl + "/edit";
export const userProductsUrl = userUrl + "/:id/products";
export const addressesUrl = userUrl + "/addresses";
export const addAddressUrl = addressesUrl + "/add";
export const registerUrl = "/register";
export const orderUrl = "/order";
export const ordersUrl = "/orders";

export const routes = [
  { path: homeUrl, component: Home },
  { path: productsUrl, component: Products },
  { path: productsUrl + "/:id", component: Products },
  { path: categoriesUrl, component: Categories },
  { path: categoriesUrl + "/:name", component: Categories },
  { path: userUrl, component: User },
  { path: addressesUrl, component: AddressBook },
  { path: editUserUrl, component: UserEdit },
  { path: userUrl + "/:id", component: User },
  { path: userProductsUrl, component: UserProducts },
  { path: addAddressUrl, component: AddAddress },
  { path: registerUrl, component: Register },
  { path: orderUrl, component: Order },
  { path: ordersUrl, component: OrderList },
];
