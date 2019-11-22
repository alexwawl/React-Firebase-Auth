import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};


class Firebase {
	constructor(){
		app.initializeApp(config);

		this.serverValue = app.database.ServerValue;
		this.emailAuthProvider = app.auth.EmailAuthProvider;
		this.auth = app.auth();
		this.db = app.database();
		this.storage = app.storage();

		this.googleProvider = new app.auth.GoogleAuthProvider();
		this.githubProvider = new app.auth.GithubAuthProvider();
	}

	// *** Auth API ***
	doCreateUserWithEmailAndPassword = (email, password) => {
		return this.auth.createUserWithEmailAndPassword(email, password); 
	}
	
	doSignInWithEmailAndPassword = (email, password) => 
		this.auth.signInWithEmailAndPassword(email, password);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

	doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password);

	onAuthUserListener = (next, fallback) => 
		this.auth.onAuthStateChanged( authUser => {
			if (authUser) {
				this.user(authUser.uid)
			        .once('value')
			        .then(snapshot => {
			          	const dbUser = snapshot.val();

			          	if(!dbUser.roles){
			          		dbUser.roles = {}
			          	}
			          	
			          	authUser = {
			          		uid: authUser.uid,
			          		email: authUser.email,
			          		emailVerified: authUser.emailVerified,
			          		providerData: authUser.providerData,
			          		...dbUser
			          	}

			          	next(authUser)
			        });
			} else {
				fallback();
			}
		});

	doSignInWithGitHub = () => 
		this.auth.signInWithPopup(this.githubProvider);

	doSignInWithGoogle = () => 
		this.auth.signInWithPopup(this.googleProvider);

	doSendEmailVerification = () =>
	    this.auth.currentUser.sendEmailVerification({
	      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
	    });


	// *** User API ***
	user = uid => this.db.ref(`users/${uid}`);
  	users = () => this.db.ref('users');

}

export default Firebase;