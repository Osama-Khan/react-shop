import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../context/app.provider';
import DefaultNav from './components/default-nav';
import MobileNav from './components/mobile-nav';

export default function Navbar() {
  const context = useContext(AppContext);
  let loc = useLocation().pathname;

  const [offset, setOffset] = useState(0);
  useEffect(() => {
    window.onscroll = () => {
      setOffset(window.pageYOffset);
    };
  });

  return (
    <nav className={`sticky-top${offset > 0 ? ' elevated' : ''}`}>
      <DefaultNav context={context} loc={loc} />
      <MobileNav loc={loc} />
    </nav>
  );
}
