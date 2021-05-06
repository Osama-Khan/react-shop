import React from 'react'
import Icon from '../icon/icon'
import {categoriesUrl, productsUrl, homeUrl } from '../../routes';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const loc = useLocation().pathname;
  return (
    <nav className="shadow">
        <ul className="nav container">
            <li className="nav-logo sm-d-none">
                <Icon dataIcon="cib:stripe-s"/>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${loc === homeUrl? "active": ""}`} to={homeUrl}>Home</Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${loc === productsUrl? "active": ""}`} to={productsUrl}>Products</Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${loc === categoriesUrl? "active": ""}`} to={categoriesUrl}>Categories</Link>
            </li>
        </ul>
    </nav>
  );
}

export default Navbar;
