import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes'; 


const Navigation = () => {
	return (
		<div>
			<AuthUserContext.Consumer >
				{ authUser => 
					authUser 
						? (<NavigationAuth authUser={authUser}/> )
                        : (<NavigationNonAuth />)
				}
			</AuthUserContext.Consumer>
		</div>
	)
}

const NavigationNonAuth = () => (
	<ul>
        <li>
            <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li>
            <Link to={ROUTES.ANOTHER_PAGE}>Another Page</Link>
        </li>
        <li>
            <Link to={ROUTES.SECURED_PAGE}>Secured Page</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
  </ul>
);

const NavigationAuthBase = () => (
		<AuthUserContext.Consumer >
            { authUser => (
                <ul>
                    <li>
                        <Link to={ROUTES.HOME}>Home</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.ANOTHER_PAGE}>Another Page</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.SECURED_PAGE}>Secured Page</Link>
                    </li>
                    {authUser ? (
                    <li>
                        <SignOutButton />
                    </li>
                    ) : (
                        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
                    )}
                </ul>
            )}
		</AuthUserContext.Consumer >
)

const NavigationAuth = withFirebase(withRouter(NavigationAuthBase));

export default Navigation;