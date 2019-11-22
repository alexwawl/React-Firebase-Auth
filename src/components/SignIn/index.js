import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { DEFAULT_AVATAR_URL } from '../../constants/vars';

import * as ROUTES from '../../constants/routes';


const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this EMail address already exists.
`;

const INITIAL_STATE = {
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
	error:'',
	isSubmited: false
}
const SignInPage = () => {
	return (
		<div>
			<div>
                     Sign In
            </div>
			<div>
				<SignInForm />

				<SignInGoogle />
				<SignInGithub />
			</div>
		</div>
	)
}


class SignInGoogleBase extends Component {
	constructor(props){
		super(props);

		this.state = {
			error: null,
		}
	}

	onSubmit = event => {
		this.props.firebase
			.doSignInWithGoogle()
			.then(socialAuthUser => {
				//Create User in Realtime Firesebase DB
				if(socialAuthUser.additionalUserInfo.isNewUser){
					return this.props.firebase
								.user(socialAuthUser.user.uid)
								.set({
											username: socialAuthUser.user.displayName,
											email: socialAuthUser.user.email,
											createdAt: this.props.firebase.serverValue.TIMESTAMP,
											submissionsCount: 0,
											roles: {},
											avatarURL: socialAuthUser.additionalUserInfo.profile.picture || DEFAULT_AVATAR_URL,
								})
				}
			})
			.then( _ => {
				this.setState( {error: null} )
				this.props.history.push(ROUTES.HOME);
			})
			.catch( error => {
				if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
				    error.message = ERROR_MSG_ACCOUNT_EXISTS;
				}
				this.setState({error})
			})

		event.preventDefault()
	}

	render(){
		const { error } = this.state;

		return (
			<form onSubmit={this.onSubmit}>
				<button type="submit">
					Sign In with Google
				</button>
				{error && <p>{error.message}</p>}
			</form>
		);
	}

}

class SignInGithubBase extends Component {
	constructor(props){
		super(props);

		this.state = {
			error: null,
		}
	}

	onSubmit = event => {
		event.preventDefault()
		this.props.firebase
			.doSignInWithGitHub()
			.then(socialAuthUser => {
				//Create User in Realtime Firesebase DB
				if(socialAuthUser.additionalUserInfo.isNewUser){
					return this.props.firebase
								.user(socialAuthUser.user.uid)
								.set({
										username: socialAuthUser.user.displayName,
										email: socialAuthUser.user.email,
										createdAt: this.props.firebase.serverValue.TIMESTAMP,
										submissionsCount: 0,
										roles: {},
										avatarURL: socialAuthUser.additionalUserInfo.profile.avatar_url || DEFAULT_AVATAR_URL,
								})
				}
			})
			.then(socialAuthUser => {
				this.setState( {error: null} )
				this.props.history.push(ROUTES.HOME);
			})
			.catch( error => {
				if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
				    error.message = ERROR_MSG_ACCOUNT_EXISTS;
				}
				this.setState({error})
			})

		event.preventDefault()
	}

	render(){
		const { error } = this.state;

		return (
			<form onSubmit={this.onSubmit}>
				<button type="submit">
					Sign In with Github
				</button>
				{error && <p>{error.message}</p>}
			</form>
		);
	}

}

class SignInFormBase extends Component {
	constructor(props){
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		this.setState({ isSubmited : true})
		const { email, password} = this.state;

		this.props.firebase
			.doSignInWithEmailAndPassword(email, password)
			.then(authUser => {
				this.setState({...INITIAL_STATE});
				this.props.history.push(ROUTES.HOME)
			})
			.catch(error => {
				this.setState({error, isSubmited: false})
			})

		event.preventDefault();	
	}

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value})
	}

	render() {
		const {
			email,
			password,
			error,
			isSubmited
		} = this.state;

		const isInvalid = password === '' || email === '' || isSubmited

		return (
				<form onSubmit={this.onSubmit}>
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

					<button type="submit" disabled={isInvalid}>Sign In</button>
					{ error && <p>{error.message}</p> }
					<SignUpLink />
				</form>
		)
	}
}

const SignInLink = () => {
	return (
		<p>
			<Link to={ROUTES.SIGN_IN}>Sign In</Link>
		</p>
	)
}

const SignInGoogle = compose(
	withRouter,
	withFirebase
	)(SignInGoogleBase);

const SignInGithub = compose(
	withRouter,
	withFirebase)(SignInGithubBase);

const SignInForm = compose(
	withRouter,
	withFirebase
)(SignInFormBase);

export default SignInPage;

export {
	SignInForm,
	SignInLink,
    SignInGoogle,
    SignInGithub
}