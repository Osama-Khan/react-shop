import React from 'react'
import Icon from '../icon/icon'
import {categoriesUrl, productsUrl, homeUrl } from '../../routes';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const loc = useLocation().pathname;
  console.log(loc);
  return (
    <nav class="shadow">
        <ul class="nav container">
            <li class="nav-logo sm-d-none">
                <Icon dataIcon="cib:stripe-s"/>
            </li>
            <li class="nav-item">
                <Link class={`nav-link ${loc === homeUrl? "active": ""}`} to={homeUrl}>Home</Link>
            </li>
            <li class="nav-item">
                <Link class={`nav-link ${loc === productsUrl? "active": ""}`} to={productsUrl}>Products</Link>
            </li>
            <li class="nav-item">
                <Link class={`nav-link ${loc === categoriesUrl? "active": ""}`} to={categoriesUrl}>Categories</Link>
            </li>
        </ul>
    </nav>
  );
}

export default Navbar;
