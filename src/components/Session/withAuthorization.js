import React from 'react';

import AuthUserContext from './context';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';



const withAuthorization = condition => Component => {

	class WithAuthorization extends React.Component {
		constructor(props){
			super(props);

			this.state = {}
		}

		componentDidMount(){
			 this.listener = this.props.firebase.onAuthUserListener(
		        authUser => {
		          if (!condition(authUser)) {
		            this.props.history.push(ROUTES.SIGN_IN);
		          }
		        },
		        () => this.props.history.push(ROUTES.SIGN_IN),
		      );
		}

		componentWillUnmount(){
			this.listener();
		}

		render(){
			return (
				<AuthUserContext.Consumer>
					{
						authUser =>
							condition(authUser)
								? <Component {...this.props} />
								: null
					}
				</AuthUserContext.Consumer>
			)
			
		}
	}

	return compose(
				withRouter,
				withFirebase
			)(WithAuthorization)
}

export default withAuthorization;
