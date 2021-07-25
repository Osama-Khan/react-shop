import { Link } from 'react-router-dom';
import { categoriesUrl, checkoutUrl, productsUrl, userUrl } from '../../routes';
import Icon from '../icon/icon';

export default function Footer() {
  return (
    <footer className="bg-dark mt-5 py-3 text-white">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h4>
              <Icon dataIcon="fa:compass" />
              &nbsp;Navigation
            </h4>
            <div>
              <Link to={productsUrl}>Products</Link>
            </div>
            <div>
              <Link to={categoriesUrl}>Categories</Link>
            </div>
            <div>
              <Link to={checkoutUrl}>Cart</Link>
            </div>
            <div>
              <Link to={userUrl}>My Account</Link>
            </div>
          </div>
          <div className="col-md-4 d-none d-md-flex">
            <div className="logo">
              <Icon dataIcon="cib:stripe-s" />
            </div>
          </div>
          <div className="col-md-4">
            <h4>
              <Icon dataIcon="fa:info-circle" />
              &nbsp;About us
            </h4>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem
              cupiditate praesentium voluptates animi eius quo quos reiciendis
              possimus dignissimos consequatur amet saepe enim iusto voluptate,
              corrupti ullam quis, mollitia ex!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
