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
import AdminHome from './admin/admin-home';
import AdminUsers from './admin/users/admin-users';
import AdminProducts from './admin/products/admin-products';
import AdminOrders from './admin/orders/admin-orders';
import AdminCategories from './admin/categories/admin-categories';

// Url Constants
export const homeUrl = '/';
// Admin
export const adminUrl = '/admin';
export const adminUsersUrl = adminUrl + '/users';
export const adminProductsUrl = adminUrl + '/products';
export const adminOrdersUrl = adminUrl + '/orders';
export const adminCategoriesUrl = adminUrl + '/categories';
// Categories
export const categoriesUrl = '/categories';
// Orders
export const checkoutUrl = '/checkout';
export const ordersUrl = '/orders';
// Products
export const productsUrl = '/products';
// User
export const userUrl = '/user';
export const editUserUrl = userUrl + '/edit';
export const userProductsUrl = userUrl + '/:id/products';
export const userFavoritesUrl = userUrl + '/favorites';
export const addressesUrl = userUrl + '/addresses';
export const addAddressUrl = addressesUrl + '/add';
export const registerUrl = '/register';

// Route Constants
const adminRoutes = [
  { path: adminUrl, component: AdminHome },
  { path: adminUsersUrl, component: AdminUsers },
  { path: adminProductsUrl, component: AdminProducts },
  { path: adminOrdersUrl, component: AdminOrders },
  { path: adminCategoriesUrl, component: AdminCategories },
];

const categoryRoutes = [
  { path: categoriesUrl, component: Categories },
  { path: categoriesUrl + '/:name', component: Categories },
];

const orderRoutes = [
  { path: checkoutUrl, component: Checkout },
  { path: ordersUrl, component: Orders },
];

const productRoutes = [
  { path: productsUrl, component: ProductList },
  { path: productsUrl + '/:id', component: ProductDetail },
];

const userRoutes = [
  { path: userUrl, component: User },
  { path: addressesUrl, component: AddressBook },
  { path: editUserUrl, component: UserEdit },
  { path: userFavoritesUrl, component: UserFavorites },
  { path: userUrl + '/:id', component: User },
  { path: userProductsUrl, component: UserProducts },
  { path: addAddressUrl, component: AddAddress },
  { path: registerUrl, component: RegisterForm },
];

export const routes = [
  { path: homeUrl, component: Home },
  ...adminRoutes,
  ...categoryRoutes,
  ...orderRoutes,
  ...productRoutes,
  ...userRoutes,
];
