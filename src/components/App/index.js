import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withAuthentication } from '../Session';
import * as ROUTES from '../../constants/routes';


import HomePage from '../Home';
import AnotherPage from '../AnotherPage';
import SecuredPage from '../SecuredPage';
import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';



const App = () => (
  <Router>
    <div>
      	<Navigation />
	
      	<Route exact path={ROUTES.HOME} component={HomePage} />
      	<Route path={ROUTES.ANOTHER_PAGE} component={AnotherPage} />
      	<Route path={ROUTES.SECURED_PAGE} component={SecuredPage} />
      	<Route path={ROUTES.SIGN_UP} component={SignUpPage} />
	<Route path={ROUTES.SIGN_IN} component={SignInPage} />
    </div>
  </Router>
);

export default withAuthentication(App);
