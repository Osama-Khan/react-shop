import Categories from './categories/categories';
import ProductList from './product/product-list';
import Home from './home/Home';
import User from './user/user';
import RegisterForm from './user/register-form';
import Checkout from './order/checkout';
import Orders from './order/orders';
import UserEdit from './user/user-edit';
import AddressBook from './user/addresses/address';
import AddAddress from './user/addresses/add-address';
import UserProducts from './user/user-products';
import UserFavorites from './user/user-favorites';
import ProductDetail from './product/product-detail';

export const homeUrl = '/';
export const productsUrl = '/products';
export const categoriesUrl = `/categories`;
export const userUrl = '/user';
export const editUserUrl = userUrl + '/edit';
export const userProductsUrl = userUrl + '/:id/products';
export const userFavoritesUrl = userUrl + '/favorites';
export const addressesUrl = userUrl + '/addresses';
export const addAddressUrl = addressesUrl + '/add';
export const registerUrl = '/register';
export const checkoutUrl = '/checkout';
export const ordersUrl = '/orders';

export const routes = [
  { path: homeUrl, component: Home },
  { path: productsUrl, component: ProductList },
  { path: productsUrl + '/:id', component: ProductDetail },
  { path: categoriesUrl, component: Categories },
  { path: categoriesUrl + '/:name', component: Categories },
  { path: userUrl, component: User },
  { path: addressesUrl, component: AddressBook },
  { path: editUserUrl, component: UserEdit },
  { path: userFavoritesUrl, component: UserFavorites },
  { path: userUrl + '/:id', component: User },
  { path: userProductsUrl, component: UserProducts },
  { path: addAddressUrl, component: AddAddress },
  { path: registerUrl, component: RegisterForm },
  { path: checkoutUrl, component: Checkout },
  { path: ordersUrl, component: Orders },
];
