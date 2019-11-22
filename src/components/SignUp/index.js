import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { SignInLink, SignInGoogle, SignInGithub} from '../SignIn';
import { DEFAULT_AVATAR_URL } from '../../constants/vars';

import * as ROUTES from '../../constants/routes';


const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this EMail address already exists.
`;


const INITIAL_STATE = {
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
	error:'',
	avatarURL: DEFAULT_AVATAR_URL,
}

const SignUpPage = () => {
	return (
		<div>
			<div>Create Account</div>
			<div>
				<SignUpForm />
				<SignInGoogle />
                <SignInGithub />
			</div>
	    </div>
	)
}

class SignUpFormBase extends Component{
	constructor(props){
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		const {username, email, password} = this.state;

		this.props.firebase
			.doCreateUserWithEmailAndPassword(email, password)
			.then(authUser => {
				// Create User in Firebase RealTime DB
				return this.props.firebase
				          .user(authUser.user.uid)
				          .set({
				          		createdAt: this.props.firebase.serverValue.TIMESTAMP,
				          		submissionsCount: 0,
				          		avatarURL: DEFAULT_AVATAR_URL,
								username,
								email, 
							});
			})
			.then(() => {
        		return this.props.firebase.doSendEmailVerification();
			})
			.then( _ => { 
				this.setState({...INITIAL_STATE});
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
				    error.message = ERROR_MSG_ACCOUNT_EXISTS;
				}
				this.setState({error})
			})

		event.preventDefault();	
	}

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value})
	}

	onChangeCheckbox = event => {
		this.setState({ [event.target.name]: event.target.checked})
	}

	render() {
		const {
			username,
			email,
			password,
			confirmPassword,
			error
		} = this.state;

		const isInvalid = password !== confirmPassword
							|| password === ''
							|| email === ''
							|| username === ''

		return (
			<form onSubmit={this.onSubmit}>
				<input
					name="username"
					value={username}
					type="text"
					placeholder="Full Name"
					onChange={this.onChange}
				/>
				<input 
					name="email"
					value={email}
					type="text"
					placeholder="Email Address"
					onChange={this.onChange}
				/>

				<input 
					name="password"
					value={password}
					type="password"
					placeholder="Password"
					onChange={this.onChange}
				/>
				<input 
					name="confirmPassword"
					value={confirmPassword}
					type="password"
					placeholder="Confirm Password"
					onChange={this.onChange}
				/>
				<button type="submit" disabled={isInvalid}>Sign Up</button>
				{ error && <p>{error.message}</p> }
				<SignInLink />
			</form>
		)
	}
}


const SignUpForm = compose(
	withRouter,
	withFirebase
)(SignUpFormBase);


const SignUpLink = () => {
	return (
		<span>
			<Link to={ROUTES.SIGN_UP}>Create Account</Link>
		</span>
	)
}

export default SignUpPage;

export {
	SignUpLink, SignUpForm
}