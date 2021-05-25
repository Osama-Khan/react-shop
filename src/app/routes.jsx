import Categories from "./categories/categories";
import Products from "./products/products";
import Home from "./home/Home";
import User from "./user/user";
import Register from "./user/register";

export const homeUrl = "/";
export const productsUrl = "/products";
export const categoriesUrl = `/categories`;
export const userUrl = "/user";
export const registerUrl = "/register";

export const routes = [
  { path: homeUrl, component: Home },
  { path: productsUrl, component: Products },
  { path: productsUrl + "/:id", component: Products },
  { path: categoriesUrl, component: Categories },
  { path: categoriesUrl + "/:id", component: Categories },
  { path: userUrl, component: User },
  { path: registerUrl, component: Register },
];
