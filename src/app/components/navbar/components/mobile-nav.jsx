import {
  categoriesUrl,
  checkoutUrl,
  homeUrl,
  productsUrl,
  userUrl,
} from '../../../routes';
import Icon from '../../icon/icon';
import { Link } from 'react-router-dom';

export default function MobileNav({ loc }) {
  return (
    <>
      <ul className="d-flex d-md-none nav container p-0">
        <li className="nav-logo m-1">
          <Link to="/" className="anchor-color-remover">
            <Icon dataIcon="cib:stripe-s" />
          </Link>
        </li>
        <li className="ml-auto my-auto">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <Icon dataIcon="eva-menu-2-outline" classes="icon-sm" />
          </button>
        </li>
      </ul>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item p-0 my-1">
            <Link
              className={`px-2 py-3 w-100 nav-link ${
                loc === homeUrl ? 'active' : ''
              }`}
              to={homeUrl}>
              <Icon dataIcon="ant-design:home-filled" /> Home
            </Link>
          </li>
          <li className="nav-item p-0 my-1">
            <Link
              className={`px-2 py-3 w-100 nav-link ${
                loc === productsUrl ? 'active' : ''
              }`}
              to={productsUrl}>
              <Icon dataIcon="ant-design:shopping-filled" /> Products
            </Link>
          </li>
          <li className="nav-item p-0 my-1">
            <Link
              className={`px-2 py-3 w-100 nav-link ${
                loc === categoriesUrl ? 'active' : ''
              }`}
              to={categoriesUrl}>
              <Icon dataIcon="bx:bxs-category-alt" /> Categories
            </Link>
          </li>
          <li className="border border-bottom m-1"></li>
          <li className="nav-item p-0 my-1">
            <Link
              className={`px-2 py-3 w-100 nav-link ${
                loc === userUrl ? 'active' : ''
              }`}
              to={userUrl}>
              <Icon dataIcon="mi-user" /> Account
            </Link>
          </li>
          <li className="nav-item p-0 my-1">
            <Link
              className={`px-2 py-3 w-100 nav-link ${
                loc === checkoutUrl ? 'active' : ''
              }`}
              to={checkoutUrl}>
              <Icon dataIcon="bi-cart" /> Cart
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
