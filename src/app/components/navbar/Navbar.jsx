import { React, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../context/app.provider';
import DefaultNav from './components/default-nav';
import MobileNav from './components/mobile-nav';

export default function Navbar() {
  const context = useContext(AppContext);
  let loc = useLocation().pathname;

  return (
    <nav className="shadow">
      <DefaultNav context={context} loc={loc} />
      <MobileNav loc={loc} />
    </nav>
  );
}
