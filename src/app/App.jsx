import React from 'react'
import Navbar from './components/navbar/Navbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { routes as r } from './routes';

function App() {
  const routes = r.map((r, i) => (
    <Route key={`route-${i}`} exact path={r.path} component={r.component} />
  ));
  return (
    <div className="app">
      <Router>
      <Navbar/>
      <div className="container">
          <AnimatedSwitch
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            className="switch-wrapper"
          >
            {routes}
          </AnimatedSwitch>
      </div>
      </Router>
    </div>
  );
}

export default App;
