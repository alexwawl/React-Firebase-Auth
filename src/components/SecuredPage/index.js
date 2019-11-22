import React from 'react';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization, withEmailVerification, } from '../Session';

const SecuredPage = () => (
  <div>
    <h1>Secured Page</h1>
    <div>
    <AuthUserContext.Consumer>
        {authUser => (
            <span>User: {authUser.uid}</span>
        )}
    </AuthUserContext.Consumer>
    </div>
  </div>
);

const condition = authUser => !!authUser;

export default compose(
    withEmailVerification,
    withAuthorization(condition),
  )(SecuredPage);